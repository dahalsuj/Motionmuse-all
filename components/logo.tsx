"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export default function Logo({ className = "", width = 180, height = 60 }: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show logo after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`inline-block ${className}`} style={{ width: `${width}px`, height: `${height}px` }} />
  }

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <div className="relative flex items-center h-full">
        <Image
          src="/images/motionmuse-logo-transparent.png"
          alt="Motion Muse"
          width={width * 1.4}
          height={height * 1.4}
          className="h-auto max-h-16 w-auto object-contain transition-all duration-300"
          priority
        />
      </div>
    </Link>
  )
}
