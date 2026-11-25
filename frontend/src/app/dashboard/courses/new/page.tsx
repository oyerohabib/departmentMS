"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import { CREATE_COURSE } from "@/graphql/courses";

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [createCourse, { loading }] = useMutation(CREATE_COURSE);

  if (user?.role !== "lecturer") {
    router.push("/dashboard");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createCourse({
        variables: {
          input: {
            title: formData.title,
            courseCode: formData.courseCode,
            description: formData.description,
          },
        },
      });
      toast.success("Course created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create course";
      setError(message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <p className="text-gray-600">
          Set up a new course for students to enroll
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="form-label">
                Course Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="form-input border rounded-md p-2 w-full mt-2"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>

            <div>
              <label htmlFor="courseCode" className="form-label">
                Course Code
              </label>
              <input
                id="courseCode"
                name="courseCode"
                type="text"
                required
                className="form-input border rounded-md p-2 w-full mt-2"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="e.g., CS101"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="form-label">
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="form-input border rounded-md p-2 w-full mt-2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the course content and objectives"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <Link
              href="/dashboard/courses"
              className="btn-secondary mr-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
