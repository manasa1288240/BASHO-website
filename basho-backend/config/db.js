const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sruthijayesh:Bashobyshivangi@bashocluster.fvwp2hr.mongodb.net/bashoDB?retryWrites=true&w=majority"
    );
    console.log("MongoDB connected successfully (Atlas)");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
