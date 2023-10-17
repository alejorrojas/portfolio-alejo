'use client'
import Note from '@/components/Note'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <main className="flex min-w-screen min-h-screen xs:p-2 md:p-10">
      <Note properties="bg-red-200" cornerProperties="bg-red-300">
        <header className="cursor-pointer mb-5 font-semibold">
            <h3>Ooops :(</h3>
        </header>
       <p>Something went wrong</p>
       <footer className="mt-6">
          <p className='underline'> <Link href="/">Go back to the home page</Link></p>
       </footer>
      </Note>
    </main>
  )
}

export default NotFound