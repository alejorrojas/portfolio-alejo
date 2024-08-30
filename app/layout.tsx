import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Itim } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const itim = Itim({ weight: "400", subsets: ['latin'], variable: '--font-itim' })

export const metadata: Metadata = {
  title: "Alejo Rojas",
  description: "Welcome to my own little world, I'm Alejo. Passionate aspiring software engineer exploring the realms of technology. Dedicated to crafting innovative solutions through code using React, Typescript, NextJS, and Java. Lifelong learner, problem solver, and creative thinker. Thanks for reaching out my portfolio :)"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-radial-pattern">
        <nav className=" w-screen top-0- md:pt-10 md:pr-32 xs:pt-5 xs:pb-5 xs:pr-10  mb-5 flex justify-between items-center">
          <Link
            href="/"
            className={`${itim.className} xs:text-xl  md:text-2xl pl-5 ml-4 hover:text-gray-500 transition duration-100 ease-in-out`}
          >
            Home
          </Link>
          <a
            target="_blank"
            href="https://x.com/alejorrojass"
            className="flex items-center"
          >
            <Image
              src="/avatar.png"
              width="100"
              height="100"
              alt="Avatar"
              className="md:w-16 xs:w-12 rounded-full shadow-lg ring-2 ring-blue-400 hover:ring-blue-200 hover:ring-2  hover:shadow-sm hover:shadow-blue-500 transition duration-700 ease-in-out"
            />
            <h2
              className={`${itim.className} md:text-2xl md:block xs:hidden  ml-4 hover:text-gray-700 transition duration-100 ease-in-out`}
            >
              Alejo
            </h2>
          </a>
        </nav>
        <Image
          src="/click-alejo.svg"
          className="m-0 p-0 absolute z-[-1] animate-cursor ease-in-out xs:w-16 md:w-20"
          alt=""
          width={80}
          height={80}
        />
        {children}
      </body>
    </html>
  );
}
