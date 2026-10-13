import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAgent = async (): Promise<void> => {
  try {
    await connectDB();

    const existingAgent = await User.findOne({
      email: "agent@test.com",
    });

    if (existingAgent) {
      console.log("Agent already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "agent123",
      10
    );

    await User.create({
      name: "Support Agent",
      email: "agent@test.com",
      password: hashedPassword,
      role: "AGENT",
    });

    console.log("Agent created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create agent", error);
    process.exit(1);
  }
};

createAgent();