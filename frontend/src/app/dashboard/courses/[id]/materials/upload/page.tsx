"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function UploadMaterialPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lecture",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is a lecturer
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!file) {
      setError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would be a FormData upload to your API
      // const formData = new FormData();
      // formData.append('title', formData.title);
      // formData.append('description', formData.description);
      // formData.append('type', formData.type);
      // formData.append('file', file);

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push(`/dashboard/courses/${id}`);
    } catch (err) {
      setError("Failed to upload material. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upload Course Material</h1>
        <p className="text-gray-600">Add a new learning resource for CS101</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Material Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input border rounded-md p-2 w-full mt-2"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Week 1 Lecture Notes"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="form-input border rounded-md p-2 w-full mt-2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the material content"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="form-label">
              Material Type
            </label>
            <select
              id="type"
              name="type"
              className="form-input border rounded-md p-2 w-full mt-2"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="lecture">Lecture Notes</option>
              <option value="assignment">Assignment</option>
              <option value="reading">Required Reading</option>
              <option value="quiz">Quiz</option>
              <option value="resource">Additional Resource</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="file" className="form-label">
              Upload File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PPT, DOC, ZIP up to 50MB
                </p>
                {file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/dashboard/courses/${id}`}
              className="btn-secondary mr-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Uploading..." : "Upload Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
