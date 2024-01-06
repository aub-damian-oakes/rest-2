import fs from "fs"
import markdownit from "markdown-it"
const md = markdownit()


const content = fs.readFileSync("./README.md")

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div dangerouslySetInnerHTML={{__html: md.render(String(content))}} id="markdownContent"></div>
    </main>
  )
}
