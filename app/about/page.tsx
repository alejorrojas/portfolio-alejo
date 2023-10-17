'use client'
import React from 'react'
import Note from '../components/Note'
import dataAbout from '../_data/about.data'

const About = () => {
  return (
    <main className='min-w-screen min-h-screen xs:p-2 md:p-10'>
            <Note properties='cursor-pointer bg-[#fae29b]' cornerProperties='bg-[#f5db90]'>
                <header className=' mb-3'>
                    <h3>Hi, I&apos;m Alejo <span className='font-semibold'>:)</span></h3>
                </header>
                <p className='leading-relaxed  ' >{dataAbout.presentation.main}</p>
                <p className='leading-relaxed ' >{dataAbout.presentation.aside}</p>
            </Note>

            <Note properties='cursor-pointer bg-[#fae29b]' cornerProperties='bg-[#f5db90]'>
                    <header className=''>
                        <h3 className='font-semibold'>Work work and work 🕓</h3>
                    </header>
                    <ul className='md:mt-8 xs:mt-3'>
                        {dataAbout.work.map((work, i) => (
                            <li className='list-none mt-8' key={i}>
                                <p>- {work.title}</p>
                                <small>{work.period}</small>                
                            </li>
                        ))}
                    </ul>
            </Note>

            <Note properties='cursor-pointer bg-[#fae29b]' cornerProperties='bg-[#f5db90]'>
                <header className='mb-3'>
                        <h3>Studies</h3>
                </header>       
                {dataAbout.studies.map((study, i )=> (
                    <li key={i}>{study}</li>
                    ))}
            
            </Note>         
            <Note properties='cursor-pointer bg-[#fae29b]' cornerProperties='bg-[#f5db90]' position={{x:200,y:1}}>
                <p>Some experiences where I had the chance to communicate my ideas</p>
            </Note>
    </main>
  )
}

export default About