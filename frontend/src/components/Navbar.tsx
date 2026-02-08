"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="bg-white/95 text-gray-900 border-b border-gray-100 sticky top-0 z-30 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            CC
          </span>
          <span className="text-lg font-semibold">Campus connect</span>
        </Link>
        <ul className="flex items-center gap-4 text-sm font-medium text-gray-600">
          {user ? (
            <>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link href="/dashboard/users" className="hover:text-blue-600">
                    Users
                  </Link>
                </li>
              )}
              {user.role !== "admin" && (
                <li>
                  <Link
                    href="/dashboard/courses"
                    className="hover:text-blue-600"
                  >
                    Courses
                  </Link>
                </li>
              )}
              <li>
                <Link href="/dashboard/profile" className="hover:text-blue-600">
                  Profile
                </Link>
              </li>
              {user.role === "lecturer" && (
                <li>
                  <Link
                    href="/dashboard/courses/new"
                    className="hover:text-blue-600"
                  >
                    Create Course
                  </Link>
                </li>
              )}
              <li>
                <button onClick={logout} className="hover:text-blue-600">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {isHome && (
                <>
                  <li>
                    <Link href="/#features" className="hover:text-blue-600">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/#how-it-works" className="hover:text-blue-600">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#testimonials"
                      className="hover:text-blue-600"
                    >
                      Stories
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  Get started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
