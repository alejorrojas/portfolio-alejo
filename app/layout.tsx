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
  description: "Welcome to my own little world, alias portfolio, I'm Alejo Rojas. Passionate aspiring software engineer exploring the realms of technology. Dedicated to crafting innovative solutions through code using React, Typescript, NextJS, and Java. Lifelong learner, problem solver, and creative thinker. "
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        
        <body className="bg-radial-pattern">
          <nav className='w-screen top-0- pt-10 pr-32 m-0 flex justify-end items-center'>
             <Link href="https://www.linkedin.com/in/alejorrojas/" className='flex items-center'>
                <Image src="/avatar.jpeg" width="100" height="100" alt='Avatar' className='w-12 rounded-full shadow-lg ring-2 ring-blue-500'/>
                <h2 className={`${itim.className} text-l ml-4 font-sans`}>Alejo Rojas</h2>
             </Link>
          </nav>
          {children}
        </body>
    </html>
  )
}
