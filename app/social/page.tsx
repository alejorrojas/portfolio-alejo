'use client'
import React from 'react'
import Note from '../components/Note'

const Social = () => {
  return (
    <main className='xs:p-2 md:p-10 min-w-screen min-h-screen'>
        <Note properties='cursor-pointer bg-blue-200 relative left-20 top-20' cornerProperties='bg-blue-300'>
            <header>
                <h3 className='mb-5'>Reach me out!</h3>
            </header>
            <ul className="leading-relaxed">
                <li><a target='_blank' href='https://www.linkedin.com/in/alejorrojas/'>📌 <span className='underline'>Linkedin</span></a></li>
                <li><a target='_blank' href='https://github.com/alejorrojas'>📌 <span className='underline'>Github</span></a></li>
                <li><a target='_blank' href='https://vsco.co/alejorrojas/gallery'>📌 <span className='underline'>VSCO</span></a></li>  
            </ul>
        </Note>
    </main>
  )
}

export default Social