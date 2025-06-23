const Movement = require("../models/Movements");
const User = require("../models/Users");
const db = require("../db");

const requestLoan = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const { amount } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan amount",
      });
    }

    if (amount > 5000) {
      return res.status(400).json({
        success: false,
        message: "You dont qualify for a loan that high",
      });
    }

    // Create loan movement
    const loanMovement = await Movement.createLoan(userId, amount);

    // Update user balance
    await client.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2`,
      [amount, userId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: `Loan of ${amount} approved`,
      movement: loanMovement,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Loan error:", error);
    res.status(500).json({
      success: false,
      message: "Loan processing failed",
    });
  } finally {
    client.release();
  }
};

const transferMoney = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { amount, recipientUsername } = req.body;
    const senderId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!recipientUsername) {
      return res.status(400).json({
        success: false,
        message: "Recipient username is required",
      });
    }

    const recipient = await User.findByUsername(recipientUsername);
    if (!recipient) {
      return res.status(401).json({
        success: false,
        message: "Recipient not found",
      });
    }

    //to check if if sender has more than what hes sending
    const senderBalance = await Movement.getCurrentBalance(senderId);
    if (senderBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds",
      });
    }

    // preventing sender from sending to himself
    if (recipient.username === req.user.username) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to yourself",
      });
    }

    // record transfer for sender (negative amount)
    const senderMovement = await Movement.makeTransfer(
      senderId,
      amount,
      recipient.username
    );

    // record transfer for receiver (positive amount)
    const recipientMovement = await Movement.receiveTransfer(
      recipient.id,
      amount,
      req.user.username
    );

    // update sender balance
    await client.query(
      `UPDATE users SET balance = balance - $1 WHERE id = $2`,
      [amount, senderId]
    );

    // update receiver balance
    await client.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2`,
      [amount, recipient.id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: `Transfer of ${amount} to ${recipient.username} completed`,
      senderMovement,
      recipientMovement,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transfer error:", error);
    res.status(500).json({
      success: false,
      message: "Transfer failed",
    });
  } finally {
    client.release();
  }
};

module.exports = { requestLoan, transferMoney };
