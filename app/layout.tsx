import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Alejo Rojas",
  description: "Welcome to my own little world, alias portfolio, I'm Alejo Rojas. Passionate aspiring software engineer exploring the realms of technology. Dedicated to crafting innovative solutions through code using React, Typescript, NextJS, and Java. Lifelong learner, problem solver, and creative thinker. React, Typescript, NextJS and Java. "
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
