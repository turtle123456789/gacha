"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"

export default function Admin() {
  const [items, setItems] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)

useEffect(() => {
  socket.on("list:update", (list: string[]) => {
    console.log("📱 admin nhận list:", list)
    setItems(list)
    setSelected(null)
  })

  return () => {
    socket.off("list:update")
  }
}, [])

  const handleSelect = (index: number) => {
    if (index < 0 || index >= items.length) return

    setSelected(index)
    console.log("ADMIN SELECT:", i)

    socket.emit("admin:select", index)
  }

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Admin</h1>

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selected === i}
            onChange={() => handleSelect(i)}
          />
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}