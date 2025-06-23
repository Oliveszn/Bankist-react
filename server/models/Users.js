const db = require("../db");
const bcrypt = require("bcryptjs");

const User = {
  async create({ firstname, lastname, username, password }) {
    const bonusAmount = 5000.0;
    const { rows } = await db.query(
      `INSERT INTO users (firstname, lastname, username, password, balance)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, firstname, lastname, username, balance, created_at`,
      [firstname, lastname, username, password, bonusAmount]
    );
    return rows[0];
  },

  async findByUsername(username) {
    const { rows } = await db.query("SELECT * from users WHERE username = $1", [
      username,
    ]);
    return rows[0];
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  async delete(username) {
    // Using CASCADE in your schema will automatically delete related records
    const { rowCount } = await db.query(
      "DELETE FROM users WHERE username = $1 RETURNING id",
      [username]
    );
    return rowCount > 0; // Returns true if user was deleted
  },

  async findByUserId(userId) {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  },

  async getMovements(userId) {
    console.log("Authenticated user ID:", userId);
    const { rows } = await db.query(
      `SELECT * FROM movements 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    console.log("Found movements:", rows);
    return rows;
  },
};

module.exports = User;
