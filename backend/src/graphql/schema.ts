export const typeDefs = `#graphql
  enum Role {
    student
    lecturer
    admin
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    role: Role!
  }

  type Course {
    _id: ID!
    title: String!
    courseCode: String!
    description: String!
    lecturer: User
    students: [User!]!
    studentIds: [ID!]!
    materials: [ID!]!
    createdAt: String
    updatedAt: String
  }

  input CreateCourseInput {
    title: String!
    courseCode: String!
    description: String!
  }

  input UpdateCourseInput {
    title: String
    courseCode: String
    description: String
  }

  type Query {
    courses: [Course!]!
    course(id: ID!): Course
    myCourses: [Course!]!
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
    enrollInCourse(courseId: ID!): Course!
    disenrollFromCourse(courseId: ID!): Course!
  }
`;
