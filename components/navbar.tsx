"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Import the Logo component
import Logo from "./logo"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
    { name: "Video Generator", path: "/video-generator" },
    { name: "Contact", path: "/contact" },
  ]

  // Helper to get dashboard route based on user plan
  const getDashboardRoute = () => {
    if (!user) return "/dashboard";
    switch (user.plan) {
      case "pro":
        return "/dashboard/pro";
      case "enterprise":
        return "/dashboard/enterprise";
      default:
        return "/dashboard";
    }
  };

  // Only show Dashboard and Video Generator if user is logged in
  const loggedInNavItems = [
    { name: "Dashboard", path: getDashboardRoute() },
    { name: "Video Generator", path: "/video-generator" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Updated logo with better dimensions */}
        <div className="logo-hover">
          <Logo width={180} height={45} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {mounted && (user
            ? loggedInNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-bold transition-colors hover:text-logo-blue ${
                    pathname === item.path ? "text-muse-red" : "text-navy"
                  }`}
                >
                  {item.name}
                </Link>
              ))
            : navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-bold transition-colors hover:text-logo-blue ${
                    pathname === item.path ? "text-muse-red" : "text-navy"
                  }`}
                >
                  {item.name}
                </Link>
              ))
          )}
          <div className="flex items-center gap-4">
            {user ? (
              <Link href={getDashboardRoute()}>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User dashboard">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-logo-blue text-white">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                    </Link>
            ) : (
              <Button
                className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Link href={getDashboardRoute()}>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User dashboard">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-logo-blue text-white">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
                  </Link>
          ) : (
            <Button variant="ghost" size="sm" className="text-logo-blue hover:bg-logo-blue/10" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col space-y-4">
            {mounted && (user
              ? loggedInNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-sm font-bold transition-colors hover:text-logo-blue ${
                      pathname === item.path ? "text-muse-red" : "text-navy"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))
              : navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-sm font-bold transition-colors hover:text-logo-blue ${
                      pathname === item.path ? "text-muse-red" : "text-navy"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))
            )}
            {!user && (
              <Button
                className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white w-full"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
