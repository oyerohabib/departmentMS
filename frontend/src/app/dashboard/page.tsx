"use client";

import { useAuth } from "@/context/AuthContext";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { MY_COURSES, mapCourse } from "@/graphql/courses";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading } = useQuery(MY_COURSES, { skip: !user });
  const courses = (data?.myCourses || []).map(mapCourse);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600">
            Here&apos;s an overview of your courses
          </p>
        </div>

        {user?.role === "lecturer" && (
          <Link
            href="/dashboard/courses/new"
            className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            Create New Course
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Courses</h3>
          <p className="text-3xl font-bold">{courses.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">My Courses</h2>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              actionButton={{
                label: "View Course",
                action: `/dashboard/courses/${course._id}`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          {user?.role === "student" ? (
            <p className="text-lg text-gray-600 mb-8">
              You haven&apos;t been assigned to any courses yet.
            </p>
          ) : user?.role === "lecturer" ? (
            <p className="text-lg text-gray-600 mb-8">
              You haven&apos;t created any courses yet.
            </p>
          ) : user?.role === "admin" ? (
            <p className="text-lg text-gray-600 mb-8">
              There are no courses created yet.
            </p>
          ) : null}
          {user?.role === "student" && (
            <Link
              href="/dashboard/courses/"
              className="btn-primary text-center px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
            >
              Browse Available Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
