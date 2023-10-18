'use client'
import React from 'react'
import Note from '@/components/Note'
import dataWork from '@/data/work.data'

const Work = () => {
  return (
    <main className="flex xl:flex-row xs:flex-col gap-3 min-w-screen min-h-screen xs:items-center md:items-center lg:items-start justify-evenly xs:p-2 md:p-16">
    {dataWork.map((work, i) =>(
      <Note cancel=".footer" key={i} properties="bg-yellow-100" cornerProperties="bg-yellow-200">
        <header className='cursor-pointer'>
          <h3 className='font-semibold mb-5'>{work.title}</h3>
          <p className='xs:text-sm xs:leading-loose md:leading-loose md:text-base '>{work.description}</p>
        </header>
        
        <footer className='footer relative xs:top-2 md:top-10'>
          <ul>
            <li><a target="_blank" href={work.github} >📌 <span className="underline">Github</span></a></li>
          </ul>
        </footer>
      </Note>
    ))}
    
    </main>
  )
}

export default Work