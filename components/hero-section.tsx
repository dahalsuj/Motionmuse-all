"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const calculateTransform = (factor: number) => {
    if (!isMounted) return "translate(0px, 0px)"

    const x = (mousePosition.x / windowSize.width - 0.5) * factor
    const y = (mousePosition.y / windowSize.height - 0.5) * factor
    return `translate(${x}px, ${y}px)`
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-20 left-10 h-64 w-64 rounded-full bg-logo-blue/10 blur-3xl"
          style={{ transform: calculateTransform(-20) }}
        />
        <div
          className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-logo-green/10 blur-3xl"
          style={{ transform: calculateTransform(-15) }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-logo-yellow/10 blur-3xl"
          style={{ transform: `translate(-50%, -50%) ${calculateTransform(-10)}` }}
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tighter text-navy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transform Your <span className="logo-gradient-text">Marketing</span> with AI-Powered Videos
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Motion Muse helps brands create stunning video content with our innovative AI video generator.
            </motion.p>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-logo-blue hover:bg-logo-blue-dark text-white relative overflow-hidden group"
                asChild
              >
                <Link href="/video-generator">
                  <span className="relative z-10">Try Video Generator</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-logo-blue-light to-logo-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-logo-blue text-logo-blue hover:bg-logo-blue/10 transition-all duration-300"
                asChild
              >
                <Link href="/services">Our Services</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="mx-auto lg:ml-auto relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-logo-blue/20 via-logo-green/20 to-logo-yellow/20 rounded-lg blur-xl"></div>
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/video-production.webp"
                alt="AI-powered video production"
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-full transform transition-transform duration-700 hover:scale-105"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <span className="px-2 py-1 bg-white/90 text-navy text-xs font-medium rounded-full">
                    AI-Powered Video Creation
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
