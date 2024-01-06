import fs from "fs"
import Navbar from "@/components/Navbar"
import FormContent from "@/components/FormContent"
import { BeatLoader } from "react-spinners"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-y-hidden">
      <FormContent />
    </main>
  )
}
