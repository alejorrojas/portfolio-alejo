'use client'
import React from 'react'
import dataWork from '../_data/work.data'
import Note from '../components/Note'

const Work = () => {
  return (
    <main className="flex xl:flex-row xs:flex-col gap-3 min-w-screen min-h-screen xs:items-center justify-evenly xs:p-2 md:p-16">
    {dataWork.map((work, i) =>(
      <Note key={i} properties="bg-yellow-100" cornerProperties="bg-yellow-200">
        <header className='cursor-pointer'>
          <h3 className='font-semibold mb-5'>{work.title}</h3>
          <p>{work.description}</p>
        </header>
        
        <footer className='mt-5'>
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