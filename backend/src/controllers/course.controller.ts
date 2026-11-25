import { RequestHandler } from "express";
import { sendResponse } from "../utils/responseHandler";
import { AppError } from "../utils/errors";
import * as courseService from "../services/course.service";

const handleError = (
  res: Parameters<RequestHandler>[1],
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof AppError) {
    sendResponse(res, error.statusCode, false, error.message, null);
    return;
  }
  console.error(fallbackMessage, error);
  sendResponse(res, 500, false, fallbackMessage, null);
};

export const createCourse: RequestHandler = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    sendResponse(res, 201, true, "Course created successfully", course);
  } catch (error) {
    handleError(res, error, "Failed to create course");
  }
};

export const getCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await courseService.listCourses();
    sendResponse(res, 200, true, "Courses fetched successfully", courses);
  } catch (error) {
    handleError(res, error, "Failed to fetch courses");
  }
};

export const getLecturerCourses: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const lecturerId = req.params.lecturerId;
    const courses = await courseService.getLecturerCourses(lecturerId, {
      page: Number(page),
      limit: Number(limit),
    });
    sendResponse(
      res,
      200,
      true,
      "Lecturer courses fetched successfully",
      courses
    );
  } catch (error) {
    handleError(res, error, "Failed to fetch lecturer courses");
  }
};

export const getCourseById: RequestHandler = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    sendResponse(res, 200, true, "Course fetched successfully", course);
  } catch (error) {
    handleError(res, error, "Failed to fetch course");
  }
};

export const updateCourse: RequestHandler = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    sendResponse(res, 200, true, "Course updated successfully", course);
  } catch (error) {
    handleError(res, error, "Failed to update course");
  }
};

export const deleteCourse: RequestHandler = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id);
    sendResponse(res, 200, true, "Course deleted successfully", null);
  } catch (error) {
    handleError(res, error, "Failed to delete course");
  }
};

export const getStudentsByCourse: RequestHandler = async (req, res) => {
  try {
    const students = await courseService.getStudentsByCourse(
      req.params.courseId
    );
    sendResponse(res, 200, true, "Students fetched successfully", students);
  } catch (error) {
    handleError(res, error, "Failed to fetch students");
  }
};

export const fetchStudentCourses: RequestHandler = async (req, res) => {
  const studentId = req.user?.userId;
  if (!studentId) {
    sendResponse(res, 401, false, "Unauthorized", null);
    return;
  }

  try {
    const enrolledCourses = await courseService.getStudentCourses(studentId);
    if (!enrolledCourses.length) {
      sendResponse(res, 404, false, "No courses found for this student", null);
      return;
    }
    sendResponse(
      res,
      200,
      true,
      "Student Courses retrieve successfully",
      enrolledCourses
    );
  } catch (error) {
    handleError(res, error, "Internal Server Error");
  }
};

export const enrollStudent: RequestHandler = async (req, res) => {
  const studentId = req.user?.userId;
  if (!studentId) {
    sendResponse(res, 401, false, "Unauthorized", null);
    return;
  }

  try {
    const course = await courseService.enrollStudent(
      req.params.courseId,
      studentId
    );
    sendResponse(res, 200, true, "Student enrolled successfully", course);
  } catch (error) {
    handleError(res, error, "Failed to enroll student");
  }
};

export const disenrollStudent: RequestHandler = async (req, res) => {
  const studentId = req.user?.userId;
  if (!studentId) {
    sendResponse(res, 401, false, "Unauthorized", null);
    return;
  }

  try {
    const course = await courseService.disenrollStudent(
      req.params.courseId,
      studentId
    );
    sendResponse(res, 200, true, "Disenroll Successfull", course);
  } catch (error) {
    handleError(res, error, "Failed to disenroll student");
  }
};
