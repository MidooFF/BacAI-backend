const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      dbName: "BacAIDB",
    });
  } catch (err) {
    console.error("mongoDB connection error: " + err);
  }
};

module.exports = connectDB;
