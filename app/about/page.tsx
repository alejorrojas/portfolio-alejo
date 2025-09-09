import React from 'react'
import Note from '@/components/Note'
import dataAbout from '@/data/about.data'
import Image from 'next/image'

const About = () => {
  return (
    <main className='min-w-screen min-h-screen xs:p-2 md:p-10 xs:items-center'>
            <Note properties='cursor-pointer bg-[#fae29b]' cornerProperties='bg-[#f5db90]'>
                <header className=' mb-3'>
                    <h3>Hi, I&apos;m Alejo <span className='font-semibold'>:)</span></h3>
                </header>
                <p className='leading-relaxed  ' >{dataAbout.presentation.main}</p>
                <p className='leading-relaxed ' >{dataAbout.presentation.aside}</p>
            </Note>

            <Note properties='cursor-pointer bg-[#fae29b] relative xs:left-20 xs:bottom-32 md:left-52 md:bottom-52' cornerProperties='bg-[#f5db90]'>
                    <header className=''>
                        <h3 className='font-semibold'>Work work and work 🕓</h3>
                    </header>
                    <ul className='md:mt-8 xs:mt-3 '>
                        {dataAbout.work.map((work, i) => (
                            <li className='list-none mt-8' key={i}>
                                <p>- {work.title}</p>
                                <small>{work.period}</small>                
                            </li>
                        ))}
                    </ul>
            </Note>

            <Note properties='cursor-pointer bg-[#fae29b] relative xs:bottom-32 md:bottom-52' cornerProperties='bg-[#f5db90]'>
                <header className='mb-3'>
                        <h3>Studies</h3> 
                </header>       
                {dataAbout.studies.map((study, i )=> (
                    <li key={i}>{study}</li>
                    ))}
            
            </Note>         
            <Note properties='cursor-pointer bg-[#fae29b] relative xs:bottom-20 xs:left-20 md:bottom-[25rem] md:left-[40%]' cornerProperties='bg-[#f5db90]'>
                <Image alt='alejo-speaker' src="/speaker-3.jpeg"  width={1000} height={1000} />            
            </Note>
            <Note properties='cursor-pointer bg-[#fae29b] relative xs:bottom-20 xs:left-20 md:bottom-[60rem] md:left-[70%]' cornerProperties='bg-[#f5db90]'>
                <Image alt='alejo-speaker' src="/speaker-2.png"  width={1000} height={1000} />            
            </Note>
            <Note properties='cursor-pointer bg-[#fae29b] relative xs:bottom-72 xs:right-20 md:bottom-[70rem] md:left-[70%]' cornerProperties='bg-[#f5db90]'>
                <Image alt='alejo-speaker' src="/speaker-1.jpg" width={500} height={500} />            
            </Note>
            <Note properties='xs:hidden md:block cursor-pointer bg-[#fae29b] relative lg:bottom-[130rem] lg:left-[60%]' cornerProperties='bg-[#f5db90]' >
                <p>Some experiences where I had the chance to communicate my ideas {'->'}</p>
            </Note>
    </main>
  )
}
 
export default About