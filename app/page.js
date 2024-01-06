import fs from "fs"
import markdownit from "markdown-it"
import Navbar from "@/components/Navbar"
const md = markdownit()


const content = fs.readFileSync("LandingPage.md")

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <div className="m-auto max-w-[50vw]" dangerouslySetInnerHTML={{__html: md.render(String(content))}} id="markdownContent"></div>
    </main>
  )
}
