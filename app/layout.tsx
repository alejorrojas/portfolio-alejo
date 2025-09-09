import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import Image from "next/image";
import Link from "next/link";

GeistSans.style.fontStyle = "bold";

export const metadata: Metadata = {
  title: "Alejo Rojas",
  description:
    "Welcome to my own little world, I'm Alejo. Passionate aspiring software engineer exploring the realms of technology. Dedicated to crafting innovative solutions through code using React, Typescript, NextJS, and Java. Lifelong learner, problem solver, and creative thinker. Thanks for reaching out my portfolio :)",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-radial-pattern">
        <nav className=" w-screen top-0- md:pt-10 md:pr-32 xs:pt-5 xs:pb-5 xs:pr-10  mb-5 flex justify-between items-center">
          <Link
            href="/"
            className={`${GeistSans.className} xs:text-xl  md:text-xl pl-8 ml-4 hover:text-gray-500 transition duration-100 ease-in-out`}
          >
            Home
          </Link>
          {/* <a
            target="_blank"
            href="https://x.com/alejorrojass"
            className="flex items-center"
          >
            <Image
              src="/profile-2025-small.jpeg"
              width="100"
              height="100"
              alt="Avatar"
              className="md:w-16 xs:w-12 rounded-full shadow-lg ring-2 ring-blue-400 hover:ring-blue-200 hover:ring-2  hover:shadow-sm hover:shadow-blue-500 transition duration-700 ease-in-out"
            />
            <h2
              className={`${GeistSans.className} md:text-2xl md:block xs:hidden  ml-4 hover:text-gray-700 transition duration-100 ease-in-out`}
            >
              Alejo
            </h2>
          </a> */}
         
          {/* Right side - Avatar and name */}
          <div className="flex items-center">
            <a
              target="_blank"
              href="https://x.com/alejorrojass"
              className="flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all duration-200 group active:scale-95 md:bg-white bg-transparent md:shadow-lg"
              rel="noopener noreferrer"
            >
              <div className="relative">
                <Image
                  src="/profile-2025-small.jpeg"
                  width={28}
                  height={28}
                  alt="Alejo's Avatar"
                  className="w-7 h-7 rounded-full ring-2 ring-gray-200/80 group-hover:ring-blue-300 transition-all duration-200 object-cover"
                />
                {/* Online indicator with subtle animation */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-[1.5px] border-white rounded-full shadow-sm animate-pulse"></div>
              </div>
              <span
                className={`${GeistSans.className} text-gray-800 text-sm font-medium group-hover:text-blue-600 transition-colors duration-200 hidden sm:block`}
              >
                Alejo
              </span>
              {/* Subtle external link indicator */}
              <svg
                className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </nav>
        <Image
          src="/click-alejo.svg"
          className="m-0 p-0 absolute z-[-1] animate-cursor xs:w-16 md:w-20"
          alt=""
          width={80}
          height={80}
        />
        {children}
      </body>
    </html>
  );
}
