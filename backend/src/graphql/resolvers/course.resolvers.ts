import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context";
import * as courseService from "../../services/course.service";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
} from "../../utils/errors";

function requireAuth(ctx: GraphQLContext) {
  if (!ctx.user) {
    throw new UnauthorizedError("Authentication required");
  }
  return ctx.user;
}

function requireRoles(ctx: GraphQLContext, roles: string[]) {
  const user = requireAuth(ctx);
  if (!roles.includes(user.role)) {
    throw new ForbiddenError("Forbidden");
  }
  return user;
}

function mapError(error: unknown): never {
  if (error instanceof AppError) {
    throw new GraphQLError(error.message, {
      extensions: { code: error.code, http: { status: error.statusCode } },
    });
  }
  console.error(error);
  throw new GraphQLError("Internal server error", {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
}

function toId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

export const courseResolvers = {
  User: {
    _id: (parent: any) => parent._id?.toString?.() ?? parent.id,
  },
  Course: {
    _id: (parent: any) => parent._id?.toString?.() ?? parent.id,
    studentIds: (parent: any) =>
      (parent.students || [])
        .map((s: unknown) => toId(s))
        .filter(Boolean) as string[],
    materials: (parent: any) =>
      (parent.materials || [])
        .map((m: unknown) => toId(m))
        .filter(Boolean) as string[],
    lecturer: async (parent: any, _args: unknown, ctx: GraphQLContext) => {
      const id = toId(parent.lecturer);
      if (!id) return null;
      // Only reuse populated doc when it has required GraphQL fields (incl. role)
      if (
        parent.lecturer &&
        typeof parent.lecturer === "object" &&
        "email" in parent.lecturer &&
        "role" in parent.lecturer &&
        parent.lecturer.role
      ) {
        return parent.lecturer;
      }
      return ctx.loaders.userLoader.load(id);
    },
    students: async (parent: any, _args: unknown, ctx: GraphQLContext) => {
      const ids = (parent.students || [])
        .map((s: unknown) => toId(s))
        .filter(Boolean) as string[];
      if (!ids.length) return [];
      // Only reuse populated docs when they include role (schema non-null)
      if (
        parent.students?.[0] &&
        typeof parent.students[0] === "object" &&
        "email" in parent.students[0] &&
        "role" in parent.students[0]
      ) {
        return parent.students;
      }
      const users = await ctx.loaders.userLoader.loadMany(ids);
      return users.filter((u) => u && !(u instanceof Error));
    },
    createdAt: (parent: any) =>
      parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) =>
      parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
  },

  Query: {
    courses: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      try {
        requireAuth(ctx);
        return await courseService.listCourses();
      } catch (error) {
        mapError(error);
      }
    },
    course: async (
      _: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      try {
        requireAuth(ctx);
        return await courseService.getCourseById(args.id);
      } catch (error) {
        mapError(error);
      }
    },
    myCourses: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      try {
        const user = requireAuth(ctx);
        if (user.role === "student") {
          return await courseService.getStudentCourses(user.userId);
        }
        if (user.role === "lecturer") {
          return await courseService.getLecturerCourses(user.userId, {
            page: 1,
            limit: 100,
          });
        }
        // admin: all courses
        return await courseService.listCourses();
      } catch (error) {
        mapError(error);
      }
    },
  },

  Mutation: {
    createCourse: async (
      _: unknown,
      args: {
        input: { title: string; courseCode: string; description: string };
      },
      ctx: GraphQLContext
    ) => {
      try {
        const user = requireRoles(ctx, ["lecturer", "admin"]);
        return await courseService.createCourse({
          ...args.input,
          lecturer: user.userId,
        });
      } catch (error) {
        mapError(error);
      }
    },
    updateCourse: async (
      _: unknown,
      args: {
        id: string;
        input: {
          title?: string;
          courseCode?: string;
          description?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      try {
        requireRoles(ctx, ["lecturer", "admin"]);
        return await courseService.updateCourse(args.id, args.input);
      } catch (error) {
        mapError(error);
      }
    },
    deleteCourse: async (
      _: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      try {
        requireRoles(ctx, ["admin"]);
        await courseService.deleteCourse(args.id);
        return true;
      } catch (error) {
        mapError(error);
      }
    },
    enrollInCourse: async (
      _: unknown,
      args: { courseId: string },
      ctx: GraphQLContext
    ) => {
      try {
        const user = requireRoles(ctx, ["student"]);
        return await courseService.enrollStudent(args.courseId, user.userId);
      } catch (error) {
        mapError(error);
      }
    },
    disenrollFromCourse: async (
      _: unknown,
      args: { courseId: string },
      ctx: GraphQLContext
    ) => {
      try {
        const user = requireRoles(ctx, ["student"]);
        return await courseService.disenrollStudent(
          args.courseId,
          user.userId
        );
      } catch (error) {
        mapError(error);
      }
    },
  },
};
