const db = require("../db");

const Movements = {
  async createLoan(userId, amount) {
    const { rows } = await db.query(
      `INSERT INTO movements (user_id, amount, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, amount, "deposit", "Loan acquired"]
    );
    return rows[0];
  },

  async makeTransfer(senderId, amount, recipientUsername) {
    const { rows } = await db.query(
      `INSERT INTO movements (user_id, amount, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        senderId,
        -Math.abs(amount),
        "transfer",
        `Transfer to ${recipientUsername}`,
      ]
    );
    return rows[0];
  },

  async receiveTransfer(recipientId, amount, senderUsername) {
    const { rows } = await db.query(
      `INSERT INTO movements (user_id, amount, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        recipientId,
        Math.abs(amount),
        "transfer",
        `Transfer from ${senderUsername}`,
      ]
    );
    return rows[0];
  },

  async getCurrentBalance(userId) {
    const { rows } = await db.query(`SELECT balance FROM users WHERE id = $1`, [
      userId,
    ]);
    return rows[0]?.balance || 0;
  },
};

module.exports = Movements;
