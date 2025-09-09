import Note from '@/components/Note'
import React from 'react'

const Social = () => {
  return (
    <main className="xs:p-2 md:p-10 min-w-screen min-h-screen">
      <Note
        cancel=".footer"
        properties="cursor-pointer bg-blue-200 relative left-20 top-20"
        cornerProperties="bg-blue-300"
      >
        <header>
          <h2 className="mb-5 text-3xl xs:text-xl">Reach me out!</h2>
        </header>
        <footer className="footer">
          <ul className="leading-[2.5rem]">
             <li>
              <a
                target="_blank"
                href="https://x.com/alejorrojass"
              >
                📌 <span className="underline">X</span>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/alejorrojas/"
              >
                📌 <span className="underline">Linkedin</span>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.goodreads.com/user/show/143446151"
              >
                📌 <span className="underline">Goodreads</span>
              </a>
            </li>
          </ul>
        </footer>
      </Note>
    </main>
  );
}

export default Social