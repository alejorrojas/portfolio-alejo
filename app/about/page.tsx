'use client'
import React from 'react'
import Note from '../features/Note'
import dataAbout from '../_data/about.data'

const About = () => {
  return (
    <main className='min-w-screen min-h-screen flex xs:flex-row'>
        <section>
            <Note properties='cursor-pointer bg-amber-200' cornerProperties='bg-amber-300'>
                <header className=' mb-3'>
                    <h3>Hi, I&apos;m Alejo <span className='font-semibold'>:)</span></h3>
                </header>
                <p className='leading-relaxed  ' >{dataAbout.presentation.main}</p>
                <p className='leading-relaxed ' >{dataAbout.presentation.aside}</p>
            </Note>

            <Note properties='cursor-pointer relative left-80 bottom-72 bg-amber-200' cornerProperties="bg-amber-300">
                    <header className=''>
                        <h3 className='font-semibold'>Work work and work 🕓</h3>
                    </header>
                    <ul className='mt-8'>
                        {dataAbout.work.map((work, i) => (
                            <li className='list-none mt-8' key={i}>
                                <p>- {work.title}</p>
                                <small>{work.period}</small>                
                            </li>
                        ))}
                    </ul>
            </Note>

            <Note properties='cursor-pointer relative left-10 bottom-72 bg-amber-200' cornerProperties="bg-amber-300">
                <header className='mb-3'>
                        <h3>Studies</h3>
                </header>       
                {dataAbout.studies.map((study, i )=> (
                    <li key={i}>{study}</li>
                    ))}
            
            </Note>         
        </section>
        <section>
            <Note properties='cursor-pointer relative left-96 bg-amber-200' cornerProperties="bg-amber-300">
                    
            </Note>
        </section>
    </main>
  )
}

export default About