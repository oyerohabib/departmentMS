"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">Campus connect</p>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Empowering departments to collaborate with students in a secure,
            streamlined learning environment.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <Link href="/#features" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-blue-600">
            How it works
          </Link>
          <Link href="/#testimonials" className="hover:text-blue-600">
            Stories
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            Get started
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-gray-400 md:flex-row md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Campus connect. All rights
            reserved.
          </p>
          <p>Built to keep your campus aligned.</p>
        </div>
      </div>
    </footer>
  );
}
