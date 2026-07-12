require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect Database

connectDB();

// Start Server

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("🚛 TransitOps Backend Started");
  console.log(`🌍 Server : http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log("--------------------------------");
});