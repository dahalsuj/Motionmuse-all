"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  const faqs = [
    {
      question: "What services does Motion Muse offer?",
      answer:
        "Motion Muse offers a range of marketing services including AI-powered video generation, social media management, content creation, brand strategy, digital advertising, and analytics reporting. Our flagship product is our AI video generator that allows you to create professional videos in minutes.",
    },
    {
      question: "How does the AI video generator work?",
      answer:
        "Our AI video generator uses advanced machine learning algorithms to create professional videos from text prompts or images. Simply describe the video you want or upload an image, select your preferred style and settings, and our AI will generate a custom video for your brand.",
    },
    {
      question: "Do I need technical skills to use your services?",
      answer:
        "Not at all! Our platform is designed to be user-friendly and accessible to everyone, regardless of technical expertise. If you can write a description or upload an image, you can create professional videos with Motion Muse.",
    },
    {
      question: "How much do your services cost?",
      answer:
        "We offer flexible pricing plans to accommodate businesses of all sizes. Our packages start at $499/month for our Starter plan, $999/month for our Professional plan, and $1,999/month for our Enterprise plan. We also offer custom solutions for specific needs. Please contact us for a personalized quote.",
    },
    {
      question: "How long does it take to create a video?",
      answer:
        "With our AI video generator, you can create a professional video in just minutes. The exact time depends on the complexity and length of the video, but most videos are ready within 5-10 minutes after you submit your request.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              Get in <span className="logo-gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              Have questions or ready to transform your marketing? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
            <Card className="border-logo-blue/20">
              <CardHeader>
                <CardTitle className="text-navy">Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="rounded-full bg-green-100 p-3">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-navy">Message Sent!</h3>
                    <p className="text-center text-muted-foreground">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="border-navy/20 focus-visible:ring-logo-blue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="Your email"
                          required
                          className="border-navy/20 focus-visible:ring-logo-blue"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder="Your company"
                        className="border-navy/20 focus-visible:ring-logo-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="border-navy/20 focus-visible:ring-logo-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your project or inquiry"
                        required
                        className="min-h-[120px] border-navy/20 focus-visible:ring-logo-blue"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-muse-red/20">
                <CardHeader>
                  <CardTitle className="text-navy">Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-muse-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-navy">Address</h3>
                      <p className="text-muted-foreground">
                      548 Market Street, Suite 15342
                        <br />
                        San Francisco, CA 94107
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-muse-orange mt-0.5" />
                    <div>
                      <h3 className="font-medium text-navy">Email</h3>
                      <p className="text-muted-foreground">info@motionmuse.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-logo-green mt-0.5" />
                    <div>
                      <h3 className="font-medium text-navy">Phone</h3>
                      <p className="text-muted-foreground">+1 (415) 555-8752</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium text-navy mb-2">Office Hours</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span className="text-muted-foreground">9:00 AM - 6:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span className="text-muted-foreground">10:00 AM - 2:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="text-muted-foreground">Closed</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium text-navy mb-2">Follow Us</h3>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to common questions about our services
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-navy font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wave-animation">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Try our AI video generator today and see the difference it can make for your brand
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                asChild
              >
                <Link href="/video-generator">Try Video Generator</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-navy text-navy hover:bg-navy/10" asChild>
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
