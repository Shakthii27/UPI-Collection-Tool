const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./configuration/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);
app.use(
  "/api/payment",
  require("./routes/paymentRoutes.js")
);

app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
