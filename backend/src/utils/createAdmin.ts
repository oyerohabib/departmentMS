import mongoose from "mongoose";
import { User } from "../models/User";
import { hashPassword } from "./auth";
import { getMongoUri } from "./mongoUri";

const createAdminUser = async () => {
  try {
    await mongoose.connect(getMongoUri());

    const hashedPassword = await hashPassword("password");

    const adminUser = new User({
      name: "Admin",
      email: "admin@campusconnect.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
