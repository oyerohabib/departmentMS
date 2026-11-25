"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CourseCard from "@/components/CourseCard";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  COURSES,
  DISENROLL_FROM_COURSE,
  ENROLL_IN_COURSE,
  mapCourse,
} from "@/graphql/courses";

export default function CoursesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, refetch } = useQuery(COURSES, { skip: !user });
  const [enroll] = useMutation(ENROLL_IN_COURSE);
  const [disenroll] = useMutation(DISENROLL_FROM_COURSE);

  const courses = (data?.courses || []).map(mapCourse);

  const handleEnroll = async (courseId: string) => {
    try {
      await enroll({ variables: { courseId } });
      toast.success("Course enrolled successfully");
      await refetch();
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleDisenroll = async (courseId: string) => {
    try {
      await disenroll({ variables: { courseId } });
      toast.info("Course disenrolled successfully");
      await refetch();
    } catch (err) {
      console.log("err", err);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const lecturerName =
      typeof course.lecturer === "object" && course.lecturer
        ? course.lecturer.name
        : "";

    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">All Courses</h1>
          <p className="text-gray-600">
            Browse and enroll in available courses
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-center flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search courses by title, code, or lecturer..."
              className="form-input border rounded-md p-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = course.students
              ? (course.students as string[]).includes(user!._id)
              : false;
            return (
              <CourseCard
                key={course._id}
                course={course}
                actionButton={{
                  label: isEnrolled ? "Disenroll" : "Enroll",
                  onClick: isEnrolled
                    ? () => handleDisenroll(course._id)
                    : () => handleEnroll(course._id),
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-600">
            No courses found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
