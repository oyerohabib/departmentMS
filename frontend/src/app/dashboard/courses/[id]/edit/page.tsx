"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client/react";
import { COURSE, UPDATE_COURSE, mapCourse } from "@/graphql/courses";

export default function EditCoursePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    description: "",
  });
  const [error, setError] = useState("");
  const { data, loading: loadingCourse } = useQuery(COURSE, {
    variables: { id },
    skip: !id,
  });
  const [updateCourse, { loading: saving }] = useMutation(UPDATE_COURSE);

  const course = data?.course ? mapCourse(data.course) : null;

  useEffect(() => {
    if (data?.course) {
      setFormData({
        title: data.course.title,
        courseCode: data.course.courseCode,
        description: data.course.description,
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateCourse({
        variables: {
          id,
          input: {
            title: formData.title,
            courseCode: formData.courseCode,
            description: formData.description,
          },
        },
      });
      router.push(`/dashboard/courses/${id}`);
      toast.success("Course has been successfully edited!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update course";
      setError(message);
    }
  };

  if (loadingCourse) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-lg text-gray-600">Course not found.</p>
        <Link
          href="/dashboard/courses"
          className="btn-primary mt-4 inline-block"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Course Information</h1>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="title">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="courseCode">
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 cursor-pointer mt-4"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
