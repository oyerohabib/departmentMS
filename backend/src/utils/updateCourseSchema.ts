import mongoose from "mongoose";
import { Course } from "../models/Course";
import { Material } from "../models/Material";
import { getMongoUri } from "./mongoUri";

async function updateCourseSchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(getMongoUri());
    console.log("Connected to MongoDB");

    // 1. Add courseCode field if missing
    const coursesWithoutCode = await Course.find({
      courseCode: { $exists: false },
    });
    for (const course of coursesWithoutCode) {
      // Generate a default course code if none exists
      const defaultCode = `${course.title
        .substring(0, 3)
        .toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      await Course.findByIdAndUpdate(course._id, {
        $set: { courseCode: defaultCode },
      });
    }
    console.log(
      `Updated ${coursesWithoutCode.length} courses with course codes`
    );

    // 2. Link existing materials to courses
    const materials = await Material.find({});
    for (const material of materials) {
      // Update the course to include this material in its materials array
      await Course.findByIdAndUpdate(material.courseId, {
        $addToSet: { materials: material._id },
      });
    }
    console.log(
      `Linked ${materials.length} materials to their respective courses`
    );

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
updateCourseSchema().catch(console.error);
