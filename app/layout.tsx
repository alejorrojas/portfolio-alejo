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
  description: "Welcome to my own little world (or portfolio), I'm Alejo Rojas. Passionate aspiring software engineer exploring the realms of technology. Dedicated to crafting innovative solutions through code using React, Typescript, NextJS, and Java. Lifelong learner, problem solver, and creative thinker. "
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        
        <body className="bg-radial-pattern">
          <nav className='w-screen top-0- md:pt-10 md:pr-32 xs:pt-5 xs:pr-10  m-0 flex justify-between items-center'>
             <Link href="/" className={`${itim.className} text-xl pl-5 ml-4 hover:text-blue-400 transition duration-100 ease-in-out`} >Home</Link>
             <a target="_blank" href="https://www.linkedin.com/in/alejorrojas/" className='flex items-center'>
                <Image src="/avatar.jpeg" width="100" height="100" alt='Avatar' className='md:w-12 xs:w-8 rounded-full shadow-lg ring-2 ring-blue-400 hover:ring-blue-200 hover:shadow-sm hover:shadow-blue-500 transition duration-700 ease-in-out'/>
                <h2 className={`${itim.className} text-l ml-4 hover:text-blue-400 transition duration-100 ease-in-out`}>Alejo Rojas</h2>
             </a>
          </nav>
          {children}
        </body>
    </html>
  )
}
