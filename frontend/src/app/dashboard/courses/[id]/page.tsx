"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { materialService } from "@/services/material.service";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { formatDate } from "../../../../../utils/formatDate";
import { toast } from "react-toastify";
import { Material } from "@/types/material";
import { User } from "@/types/user";
import { useQuery } from "@apollo/client/react";
import { COURSE, mapCourse } from "@/graphql/courses";

interface Params {
  id: string;
}

export default function CourseDetailsPage() {
  const { id } = useParams() as unknown as Params;
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState("materials");
  const { data, loading, error } = useQuery(COURSE, {
    variables: { id },
    skip: !id,
  });

  const gqlCourse = data?.course;
  const course = gqlCourse ? mapCourse(gqlCourse) : null;
  const students: User[] = gqlCourse?.students || [];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsResponse = await materialService.getMaterialsByCourse(
          id
        );
        setMaterials(materialsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchMaterials();
  }, [id]);

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await materialService.deleteMaterial(materialId);
      toast.info("Material has been successfully deleted!");
      setMaterials((prev) => prev.filter((m) => m._id !== materialId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

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
    <div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col items-start lg:flex-row gap-4 lg:gap-0 justify-between">
          <h1 className="text-2xl font-bold mb-4">{course?.title}</h1>

          {user?.role === "lecturer" && (
            <div className="mb-4">
              <Link
                href={`/dashboard/courses/${course._id}/edit`}
                className="btn-secondary mr-2 px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition duration-200"
              >
                Edit Course
              </Link>
              <Link
                href={`/dashboard/courses/${course._id}/materials/upload`}
                className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              >
                Upload New Material
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="mr-4">Course Code: {course?.courseCode}</span>
        </div>
        <p className="text-gray-700 mb-4">{course?.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">
            No of Enrolled Students:{" "}
            {Array.isArray(course?.students) ? course.students.length : 0}
          </span>
          <span>
            No of Materials:{" "}
            {Array.isArray(course?.materials) ? course.materials.length : 0}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "materials"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("materials")}
          >
            Course Materials
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "students"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Enrolled Students
          </button>
        </div>

        <div className="p-6">
          {activeTab === "materials" && (
            <div>
              {materials?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {materials.map((material) => (
                        <tr key={material._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {material.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {material.updatedAt &&
                              formatDate(material.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              href={material.fileUrl}
                              download
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Download
                            </a>
                            {user?.role === "lecturer" && (
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(material._id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No materials have been uploaded for this course yet.
                  </p>
                  {user?.role === "lecturer" && (
                    <Link
                      href={`/dashboard/courses/${course?._id}/materials/upload`}
                      className="btn-primary px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                    >
                      Upload First Material
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Enrolled Students ({students?.length || 0})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students?.length > 0 ? (
                      students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4" colSpan={2}>
                          No Students Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
