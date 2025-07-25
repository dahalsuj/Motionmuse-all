import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

// Import the Logo component
import Logo from "./logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="logo-hover">
              <Logo width={160} height={40} />
            </div>
            <p className="text-muted-foreground">Innovative marketing solutions with AI-powered video generation</p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Facebook"
                className="text-logo-blue hover:text-logo-blue-dark hover:bg-logo-blue/10"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Twitter"
                className="text-logo-green hover:text-logo-green-light hover:bg-logo-green/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Instagram"
                className="text-logo-purple hover:text-logo-pink hover:bg-logo-purple/10"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="YouTube"
                className="text-muse-red hover:text-muse-orange hover:bg-muse-red/10"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-logo-blue">
                  Video Marketing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-logo-green">
                  Content Creation
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-logo-yellow">
                  Social Media
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-logo-purple">
                  Brand Strategy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-logo-blue">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-logo-green">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-logo-yellow">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-logo-purple">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy">Subscribe</h4>
            <p className="mb-4 text-muted-foreground">Stay updated with our latest news and offers.</p>
            <div className="flex flex-col space-y-2">
              <Input placeholder="Your email" type="email" className="border-navy/20 focus-visible:ring-logo-blue" />
              <Button className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Motion Muse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
