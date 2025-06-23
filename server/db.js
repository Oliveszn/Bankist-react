require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD, // Same as pgAdmin login
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};

//  CREATE TABLE users (
//    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//    firstName VARCHAR(255) NOT NULL,
//    lastName VARCHAR(255) NOT NULL,
//    userName VARCHAR(255) NOT NULL UNIQUE,
//    password VARCHAR(255) NOT NULL,
//    balance DECIMAL(15, 2) DEFAULT 0.00,
//    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
//  );

// CREATE TABLE movements (
//    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//    amount DECIMAL(15, 2) NOT NULL,  -- Positive (credit) or negative (debit)
//    type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
//    description TEXT,  -- e.g., "ATM withdrawal", "Salary deposit"
//    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//    FOREIGN KEY (user_id) REFERENCES users(id)
// );

// CREATE INDEX idx_users_username ON users(userName);
// CREATE INDEX idx_movements_user_id ON movements(user_id);
// CREATE INDEX idx_movements_created_at ON movements(created_at);
