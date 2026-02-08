import Link from "next/link";
import Image from "next/image";
import UniOfIbadan from "@/assets/images/university-of-ibadan.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              CC
            </span>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Campus connect
              </p>
              <p className="text-sm text-gray-500">
                Collaborative learning for modern campuses
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-600">
              How it works
            </a>
            <a href="#testimonials" className="hover:text-blue-600">
              Stories
            </a>
            <Link href="/login" className="hover:text-blue-600">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 md:flex-row md:items-center">
            <div className="md:w-1/2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Built for students, powered for lecturers
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 max-w-3xl">
                Transform the way your campus communicates, teaches, and learns.
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl text-blue-100">
                Campus connect brings every course, announcement, and resource
                into one intuitive workspace—so you can focus on learning, not
                logistics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="btn-primary text-center px-6 py-3 rounded-md bg-white text-blue-700 hover:bg-blue-50 transition duration-200"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="text-white btn text-center border border-white/60 px-6 py-3 rounded-md transition duration-200 hover:border-white hover:bg-white/10"
                >
                  Explore the dashboard
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6 text-sm text-blue-100">
                <div>
                  <p className="text-2xl font-semibold text-white">98%</p>
                  <p>On-time resource delivery</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">45k+</p>
                  <p>Learning resources shared</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-2xl bg-white/10 p-4 shadow-2xl">
                <Image
                  src={UniOfIbadan}
                  alt="Education Platform"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg"
                  priority
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-blue-100">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-white font-semibold">Live Announcements</p>
                  <p className="mt-2">
                    Push critical updates to every class instantly.
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-white font-semibold">Smart Schedules</p>
                  <p className="mt-2">
                    Keep lectures and deadlines crystal clear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Campus connect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Course Management
              </h3>
              <p className="text-gray-600">
                Easily access and manage course materials for all your classes
                in one place.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Specifically designed interfaces for both students and
                lecturers, ensuring optimal experience.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Seamless File Sharing
              </h3>
              <p className="text-gray-600">
                Upload and access course materials in any format with our
                flexible file management system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 bg-white border-t border-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Everything your campus needs, in three simple steps
              </h2>
              <p className="text-gray-600 mb-10 max-w-2xl">
                Launch your digital campus in minutes. Import courses, invite
                your community, and stay connected with a unified hub for
                lectures, resources, and feedback.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Create your departments",
                    description:
                      "Set up departments, courses, and shared resource libraries in one workspace.",
                  },
                  {
                    title: "Invite students and lecturers",
                    description:
                      "Assign roles and permissions so every user sees exactly what they need.",
                  },
                  {
                    title: "Track engagement",
                    description:
                      "Monitor announcements, uploads, and participation from a single dashboard.",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Built-in productivity boosters
              </h3>
              <ul className="space-y-4 text-gray-700">
                {[
                  "Automated reminders for assignments and deadlines",
                  "Secure file storage for lecture notes and media",
                  "Insights dashboard for participation trends",
                  "Mobile-friendly access on any device",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
              >
                Start building your campus
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Trusted by campus teams
            </p>
            <h2 className="text-3xl font-bold mt-2">
              Real stories from Campus connect users
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Our departments now share resources in minutes, and students never miss a deadline.",
                name: "Dr. Adeola Ajayi",
                role: "Head of Department",
              },
              {
                quote:
                  "The role-based dashboard makes it easy to track lectures, files, and announcements in one place.",
                name: "Ola Yusuf",
                role: "Computer Science Student",
              },
              {
                quote:
                  "Switching to Campus connect reduced admin time and kept everyone aligned.",
                name: "Chioma Nwankwo",
                role: "Faculty Administrator",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-gray-700">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to enhance your educational journey?
          </h2>
          <p className="text-xl mb-14 max-w-2xl mx-auto">
            Join thousands of students and lecturers already using Campus
            connect to streamline their educational experience.
          </p>
          <Link
            href="/register"
            className="btn-primary text-center px-6 py-4 rounded-md bg-white text-blue-600 hover:bg-gray-200 transition duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Campus connect
              </p>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Empowering departments to collaborate with students in a secure,
                streamlined learning environment.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <a href="#features" className="hover:text-blue-600">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-blue-600">
                How it works
              </a>
              <a href="#testimonials" className="hover:text-blue-600">
                Stories
              </a>
              <Link href="/register" className="hover:text-blue-600">
                Get started
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 text-xs text-gray-400 md:flex-row md:justify-between">
            <p>© 2024 Campus connect. All rights reserved.</p>
            <p>Built to keep your campus aligned.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
