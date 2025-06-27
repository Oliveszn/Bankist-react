require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./db");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const movementRoute = require("./routes/movementRoutes");

const app = express();
const PORT = process.env.PORT;

///to test conection
db.query("SELECT NOW()")
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));
console.log("CLIENT_BASE_URL:", process.env.CLIENT_BASE_URL);
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/auth", userRoute);
app.use("/api", movementRoute);

app.listen(PORT, () => console.log(`server on ports ${PORT}`));
