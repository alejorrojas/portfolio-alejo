'use client'
import Note from "@/components/Note"
import Link from "next/link"

const Home = () => {
  return (
    <main className="flex min-w-screen min-h-screen xs:p-2 md:p-10">
      <Note properties="bg-yellow-100" cornerProperties="bg-yellow-200">
        <header className="cursor-pointer">
          <p>Hey guys,</p>
          <p>This is my last-minute portfolio. I&apos;ve been busy with some serious procrastination stuff, so this is what I&apos;ve got </p>
        </header>
        <small className="md:text-xl xs:text-base cursor-default ">Anyway, <a className="text-blue-500" href="mailto:alejoivanrojas@gmail.com">email</a> me if you have any suggestions</small>
       
       <footer className="mt-6">
          <ul className="leading-relaxed">
            <li><Link href="/work">📌 <span className="underline">Projects</span></Link></li>
            <li><Link href="/about">📌 <span className="underline">About</span></Link></li>
            <li><Link href="/social">📌 <span className="underline">Social</span></Link></li>
          </ul>
       </footer>
      </Note>
    </main>
  )
}

export default Home