"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Don't render anything during SSR
  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-logo-blue to-logo-green text-white shadow-lg hover:shadow-xl transition-shadow"
            asChild
          >
            <Link href="/contact" aria-label="Contact Us">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
