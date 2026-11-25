/* eslint-disable @next/next/no-sync-scripts */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ApolloProvider from "@/components/ApolloProvider";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus connect - Learning Management System",
  description:
    "A platform for students and lecturers to connect and share course materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ApolloProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow bg-gray-50 justify-center items-center">
                {children}
              </main>
              <Footer />
            </div>
          </ApolloProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
