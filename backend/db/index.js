// import mongoose from "mongoose";

// import { DB_NAME } from "../constants.js";
const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log("MONGODB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
