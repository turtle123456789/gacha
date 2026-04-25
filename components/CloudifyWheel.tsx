"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { socket } from "@/lib/socket"

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
)

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#1A535C",
  "#FF9F1C",
  "#5E60CE",
  "#48BFE3",
  "#80ED99",
]

function getTextColor(bg: string) {
  const c = bg.substring(1)
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 255
  const g = (rgb >> 8) & 255
  const b = rgb & 255
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 150 ? "#000" : "#fff"
}

export default function CloudifyWheel() {
  const [rawText, setRawText] = useState("")
  const [items, setItems] = useState<string[]>([])

  const [mustSpin, setMustSpin] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [result, setResult] = useState("")
  const [removedIndexes, setRemovedIndexes] = useState<number[]>([])

  // 🔥 nhận list + kết quả từ server
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔥 connected:", socket.id)
    })

    socket.on("list:update", (list: string[]) => {
      console.log("🎰 nhận list:", list)
      setItems(list)
      setRemovedIndexes([]) // reset vòng tròn
    })

    socket.on("spin:result", (index: number) => {
      if (
        typeof index !== "number" ||
        isNaN(index) ||
        index < 0 ||
        index >= items.length
      ) {
        console.log("❌ index lỗi:", index)
        return
      }

      setPrizeIndex(index)
      setSelectedIndex(index)
      setMustSpin(true)
    })

    return () => {
      socket.off("list:update")
      socket.off("spin:result")
    }
  }, [items])

  // 🔥 gửi list lên server
    const handleApply = () => {
    const list = rawText
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean)

    socket.emit("list:update", list)
    }

  // 🔥 quay
  const handleSpin = () => {
    if (!items.length) {
      console.log("❌ chưa có list")
      return
    }

    if (mustSpin) return

    socket.emit("spin")
  }

  // 🔥 data hiển thị trên vòng (loại bỏ item đã trúng)
  const displayItems = items.filter(
    (_, i) => !removedIndexes.includes(i)
  )

  const data = displayItems.map((item, i) => {
    const bg = COLORS[i % COLORS.length]
    return {
      option: item,
      style: {
        backgroundColor: bg,
        textColor: getTextColor(bg),
      },
    }
  })

  // map index thật → index hiển thị
  const displayIndex = displayItems.findIndex(
    (item) => item === items[selectedIndex ?? -1]
  )

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 gap-10">

      {/* 🎰 WHEEL */}
      <div className="relative">

        {displayItems.length > 0 ? (
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={displayIndex >= 0 ? displayIndex : 0}
            data={data}
            spinDuration={0.3}
            onStopSpinning={() => {
              setMustSpin(false)
              if (selectedIndex !== null) {
                setResult(items[selectedIndex])
              }
            }}
          />
        ) : (
          <div className="text-white">Hết option rồi</div>
        )}

        {/* 🔥 NÚT QUAY */}
        <button
          onClick={handleSpin}
          disabled={mustSpin}
          className="absolute z-[999] top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          bg-blue-500 text-white w-20 h-20 rounded-full
          flex items-center justify-center font-bold shadow-xl border-4 border-white"
        >
          Quay
        </button>

      </div>

      {/* 📋 PANEL NHẬP */}
      <div className="bg-white text-black p-5 rounded-xl w-[320px] shadow-xl">

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full h-[200px] border p-2 bg-white text-black"
        />

        <button
          onClick={handleApply}
          className="w-full mt-3 bg-blue-500 text-white py-2 rounded"
        >
          Áp dụng
        </button>

      </div>

      {/* 🎉 MODAL */}
      {result && (
        <div className="fixed z-[9999] inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[400px] rounded shadow-lg">

            <div className="p-4 border-b">
              Kết quả
            </div>

            <div className="p-6 text-center text-2xl text-red-500 font-bold">
              {result}
            </div>

            <div className="flex">

              {/* ❌ chỉ đóng */}
              <button
                onClick={() => setResult("")}
                className="w-1/2 py-3 bg-gray-200"
              >
                OK
              </button>

              {/* 🔥 xóa trên vòng tròn */}
              <button
                onClick={() => {
                  if (selectedIndex !== null) {
                    setRemovedIndexes((prev) => [
                      ...prev,
                      selectedIndex,
                    ])
                  }

                  setResult("")
                  setSelectedIndex(null)
                }}
                className="w-1/2 py-3 bg-green-500 text-white"
              >
                Quay tiếp
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}