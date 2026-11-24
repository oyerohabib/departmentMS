"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Material_1 = require("../models/Material");
const auth_1 = require("./auth");
const mongoUri_1 = require("./mongoUri");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to MongoDB...");
        yield mongoose_1.default.connect((0, mongoUri_1.getMongoUri)());
        console.log("Connected to MongoDB");
        // Create Admin
        console.log("Creating admin...");
        yield User_1.User.create({
            name: "Admin",
            email: "admin@campusconnect.com",
            password: yield (0, auth_1.hashPassword)("password"),
            role: "admin",
        });
        console.log("Admin created...");
        // Create Lecturers
        console.log("Creating lecturers...");
        const lecturers = yield User_1.User.insertMany([
            {
                name: "Prof. John Smith",
                email: "john.smith@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "lecturer",
            },
            {
                name: "Dr. Emily Johnson",
                email: "emily.johnson@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "lecturer",
            },
            {
                name: "Dr. Michael Brown",
                email: "michael.brown@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "lecturer",
            },
        ]);
        console.log("Lecturers created...");
        // Create Students
        console.log("Creating students...");
        const students = yield User_1.User.insertMany([
            {
                name: "Alice Williams",
                email: "alice.williams@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "Bob Davis",
                email: "bob.davis@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "Charlie Wilson",
                email: "charlie.wilson@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "Diana Moore",
                email: "diana.moore@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "Ethan Taylor",
                email: "ethan.taylor@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "Fiona Anderson",
                email: "fiona.anderson@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
            {
                name: "George Thomas",
                email: "george.thomas@campusconnect.com",
                password: yield (0, auth_1.hashPassword)("password"),
                role: "student",
            },
        ]);
        console.log("Students created...");
        // Create Courses
        console.log("Creating courses...");
        const courses = yield Course_1.Course.insertMany([
            {
                title: "Introduction to Computer Science",
                courseCode: "CS101",
                description: "An introductory course on computer science principles and programming.",
                lecturer: lecturers[0]._id,
            },
            {
                title: "Advanced Database Systems",
                courseCode: "DBS301",
                description: "A deep dive into database design, implementation, and optimization techniques.",
                lecturer: lecturers[1]._id,
            },
            {
                title: "Web Development Fundamentals",
                courseCode: "WEB201",
                description: "Learn the basics of web development, including HTML, CSS, and JavaScript.",
                lecturer: lecturers[2]._id,
            },
            {
                title: "Mobile App Development",
                courseCode: "MOB220",
                description: "Explore the principles of mobile app development for iOS and Android.",
                lecturer: lecturers[0]._id,
            },
            {
                title: "Data Structures and Algorithms",
                courseCode: "DSA210",
                description: "An in-depth study of data structures and algorithms for efficient problem-solving.",
                lecturer: lecturers[1]._id,
            },
            {
                title: "Introduction to AI & ML",
                courseCode: "AIM350",
                description: "An overview of artificial intelligence and machine learning concepts and applications.",
                lecturer: lecturers[2]._id,
            },
            {
                title: "Cybersecurity Fundamentals",
                courseCode: "SEC180",
                description: "Learn the basics of cybersecurity, including threats, vulnerabilities, and defenses.",
                lecturer: lecturers[0]._id,
            },
            {
                title: "Advanced Blockchain Systems",
                courseCode: "BLK400",
                description: "A comprehensive look at blockchain technology and its applications.",
                lecturer: lecturers[1]._id,
            },
        ]);
        console.log("Courses created...");
        // Assign Students to Courses
        console.log("Assigning students to courses...");
        yield Course_1.Course.updateMany({ _id: { $in: [courses[0]._id, courses[1]._id] } }, { $addToSet: { students: { $each: [students[0]._id, students[1]._id] } } });
        yield Course_1.Course.updateMany({ _id: { $in: [courses[1]._id, courses[2]._id] } }, { $addToSet: { students: { $each: [students[2]._id, students[3]._id] } } });
        yield Course_1.Course.updateMany({ _id: { $in: [courses[2]._id, courses[3]._id] } }, { $addToSet: { students: { $each: [students[4]._id, students[5]._id] } } });
        yield Course_1.Course.updateMany({ _id: { $in: [courses[4]._id, courses[5]._id] } }, { $addToSet: { students: { $each: [students[6]._id] } } });
        console.log("Students assigned to courses successfully.");
        // Create Materials
        console.log("Creating materials...");
        yield Material_1.Material.insertMany([
            {
                title: "CS101 Lecture Notes",
                fileUrl: "uploads/cs101_notes.pdf",
                courseId: courses[0]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "DBS Advanced Concepts",
                fileUrl: "uploads/dbs_advanced.pdf",
                courseId: courses[1]._id,
                uploadedBy: lecturers[1]._id,
            },
            {
                title: "Web Dev Basics",
                fileUrl: "uploads/web_dev_basics.pdf",
                courseId: courses[2]._id,
                uploadedBy: lecturers[2]._id,
            },
            {
                title: "Mobile App Design",
                fileUrl: "uploads/mobile_app_design.pdf",
                courseId: courses[3]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "Data Structures Overview",
                fileUrl: "uploads/data_structures.pdf",
                courseId: courses[4]._id,
                uploadedBy: lecturers[1]._id,
            },
            {
                title: "AI & ML Introduction",
                fileUrl: "uploads/ai_ml_intro.pdf",
                courseId: courses[5]._id,
                uploadedBy: lecturers[2]._id,
            },
            {
                title: "Cybersecurity Basics",
                fileUrl: "uploads/cybersecurity_basics.pdf",
                courseId: courses[6]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "Blockchain Fundamentals",
                fileUrl: "uploads/blockchain_fundamentals.pdf",
                courseId: courses[7]._id,
                uploadedBy: lecturers[1]._id,
            },
            {
                title: "CS101 Assignment 1",
                fileUrl: "uploads/cs101_assignment1.pdf",
                courseId: courses[0]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "DBS Project Guidelines",
                fileUrl: "uploads/dbs_project_guidelines.pdf",
                courseId: courses[1]._id,
                uploadedBy: lecturers[1]._id,
            },
            {
                title: "Web Dev Project",
                fileUrl: "uploads/web_dev_project.pdf",
                courseId: courses[2]._id,
                uploadedBy: lecturers[2]._id,
            },
            {
                title: "Mobile App Project",
                fileUrl: "uploads/mobile_app_project.pdf",
                courseId: courses[3]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "Data Structures Exercises",
                fileUrl: "uploads/data_structures_exercises.pdf",
                courseId: courses[4]._id,
                uploadedBy: lecturers[1]._id,
            },
            {
                title: "AI & ML Case Studies",
                fileUrl: "uploads/ai_ml_case_studies.pdf",
                courseId: courses[5]._id,
                uploadedBy: lecturers[2]._id,
            },
            {
                title: "Cybersecurity Case Studies",
                fileUrl: "uploads/cybersecurity_case_studies.pdf",
                courseId: courses[6]._id,
                uploadedBy: lecturers[0]._id,
            },
            {
                title: "Blockchain Case Studies",
                fileUrl: "uploads/blockchain_case_studies.pdf",
                courseId: courses[7]._id,
                uploadedBy: lecturers[1]._id,
            },
        ]);
        console.log("Materials created successfully.");
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.error("Error seeding database:", error);
        process.exitCode = 1;
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
});
seedDatabase();
//# sourceMappingURL=seedDatabase.js.map