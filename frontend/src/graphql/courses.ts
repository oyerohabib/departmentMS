import { gql, TypedDocumentNode } from "@apollo/client";
import { Course } from "@/types/course";
import { User } from "@/types/user";

export type GqlCourse = {
  _id: string;
  title: string;
  courseCode: string;
  description: string;
  studentIds?: string[];
  materials?: string[];
  lecturer?: User | null;
  students?: User[];
  createdAt?: string;
  updatedAt?: string;
};

export const COURSE_FIELDS = gql`
  fragment CourseFields on Course {
    _id
    title
    courseCode
    description
    studentIds
    materials
    lecturer {
      _id
      name
      email
      role
    }
    createdAt
    updatedAt
  }
`;

export const MY_COURSES: TypedDocumentNode<{ myCourses: GqlCourse[] }> = gql`
  ${COURSE_FIELDS}
  query MyCourses {
    myCourses {
      ...CourseFields
    }
  }
`;

export const COURSES: TypedDocumentNode<{ courses: GqlCourse[] }> = gql`
  ${COURSE_FIELDS}
  query Courses {
    courses {
      ...CourseFields
    }
  }
`;

export const COURSE: TypedDocumentNode<
  { course: GqlCourse | null },
  { id: string }
> = gql`
  ${COURSE_FIELDS}
  query Course($id: ID!) {
    course(id: $id) {
      ...CourseFields
      students {
        _id
        name
        email
        role
      }
    }
  }
`;

export const CREATE_COURSE: TypedDocumentNode<
  { createCourse: GqlCourse },
  { input: { title: string; courseCode: string; description: string } }
> = gql`
  ${COURSE_FIELDS}
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      ...CourseFields
    }
  }
`;

export const UPDATE_COURSE: TypedDocumentNode<
  { updateCourse: GqlCourse },
  {
    id: string;
    input: { title?: string; courseCode?: string; description?: string };
  }
> = gql`
  ${COURSE_FIELDS}
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      ...CourseFields
    }
  }
`;

export const ENROLL_IN_COURSE: TypedDocumentNode<
  { enrollInCourse: GqlCourse },
  { courseId: string }
> = gql`
  ${COURSE_FIELDS}
  mutation EnrollInCourse($courseId: ID!) {
    enrollInCourse(courseId: $courseId) {
      ...CourseFields
    }
  }
`;

export const DISENROLL_FROM_COURSE: TypedDocumentNode<
  { disenrollFromCourse: GqlCourse },
  { courseId: string }
> = gql`
  ${COURSE_FIELDS}
  mutation DisenrollFromCourse($courseId: ID!) {
    disenrollFromCourse(courseId: $courseId) {
      ...CourseFields
    }
  }
`;

/** Map GraphQL course shape into the existing Course UI type. */
export function mapCourse(gqlCourse: GqlCourse): Course {
  return {
    _id: gqlCourse._id,
    title: gqlCourse.title,
    courseCode: gqlCourse.courseCode,
    description: gqlCourse.description,
    lecturer: gqlCourse.lecturer ?? undefined,
    students: gqlCourse.studentIds ?? [],
    materials: gqlCourse.materials ?? [],
    createdAt: gqlCourse.createdAt,
    updatedAt: gqlCourse.updatedAt,
  };
}
