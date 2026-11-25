import { Course, ICourse } from "../models/Course";
import { NotFoundError } from "../utils/errors";

export type CreateCourseInput = {
  title: string;
  courseCode: string;
  description: string;
  lecturer: string;
};

export type UpdateCourseInput = {
  title?: string;
  courseCode?: string;
  description?: string;
  lecturer?: string;
};

export async function listCourses(): Promise<ICourse[]> {
  return Course.find().populate("lecturer", "name email role");
}

export async function getCourseById(id: string): Promise<ICourse> {
  const course = await Course.findById(id);
  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course;
}

export async function getLecturerCourses(
  lecturerId: string,
  options: { page?: number; limit?: number } = {}
): Promise<ICourse[]> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;

  return Course.find({ lecturer: lecturerId })
    .populate("lecturer", "name email role")
    .populate("materials")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
}

export async function getStudentCourses(studentId: string): Promise<ICourse[]> {
  return Course.find({ students: studentId })
    .populate("lecturer", "name email role")
    .lean() as unknown as Promise<ICourse[]>;
}

export async function createCourse(
  input: CreateCourseInput
): Promise<ICourse> {
  const course = new Course(input);
  await course.save();
  return course;
}

export async function updateCourse(
  id: string,
  input: UpdateCourseInput
): Promise<ICourse> {
  const course = await Course.findByIdAndUpdate(id, input, { new: true });
  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course;
}

export async function deleteCourse(id: string): Promise<void> {
  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    throw new NotFoundError("Course not found");
  }
}

export async function getStudentsByCourse(courseId: string) {
  const course = await Course.findById(courseId).populate("students");
  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course.students;
}

export async function enrollStudent(
  courseId: string,
  studentId: string
): Promise<ICourse> {
  const course = await Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { students: studentId } },
    { new: true }
  ).populate("lecturer", "name email role");

  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course;
}

export async function disenrollStudent(
  courseId: string,
  studentId: string
): Promise<ICourse> {
  const course = await Course.findByIdAndUpdate(
    courseId,
    { $pull: { students: studentId } },
    { new: true }
  ).populate("lecturer", "name email role");

  if (!course) {
    throw new NotFoundError("Course not found");
  }
  return course;
}
