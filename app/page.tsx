import Header from "@/components/Header"
import CloudifyWheel from "@/components/CloudifyWheel"

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
        <CloudifyWheel />
      </div>
    </>
  )
}