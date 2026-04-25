"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Trang chủ", href: "#" },
  { label: "Quay thưởng", href: "#" },
  { label: "Cẩm nang", href: "#" },
  { label: "Tin tức", href: "#" },
  { label: "Liên hệ", href: "#" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* 🔥 LOGO */}
        <div className="text-white text-xl font-bold">
          Cloudify
        </div>
      </div>

      {/* 📱 MOBILE MENU */}

    </header>
  )
}