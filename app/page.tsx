import Note from "@/components/Note"
import Link from "next/link"

const Home = () => {
  return (
    <main className="flex min-w-screen min-h-screen xs:p-2 md:p-10">
      <Note cancel=".footer" properties="bg-yellow-100" cornerProperties="bg-yellow-200">
        <header className="cursor-pointer">
          <p>Hey guys,</p>
          <p>This is my last-minute portfolio. I&apos;ve been busy with some serious procrastination stuff, so this is what I&apos;ve got </p>
        </header>
        <small className="small md:text-xl xs:text-base cursor-default ">Anyway, <a className="footer text-blue-500" href="mailto:alejoivanrojas@gmail.com">email</a> me if you have any suggestions</small>
       
       <footer className="footer mt-6">
          <ul className="leading-[2.5rem]">
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