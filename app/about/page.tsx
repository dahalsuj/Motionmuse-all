import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Globe, Heart, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Morgan",
      position: "Founder & CEO",
      bio: "Alex has over 15 years of experience in digital marketing and video production. Prior to founding Motion Muse, Alex led marketing teams at several Fortune 500 companies.",
      image: "/images/team/alex-morgan.png",
      color: "from-logo-blue to-logo-green",
    },
    {
      name: "Jamie Wilson",
      position: "Chief Technology Officer",
      bio: "Jamie is an AI specialist with a background in computer vision and machine learning. They lead our engineering team in developing cutting-edge video generation technology.",
      image: "/images/team/jamie-wilson.png",
      color: "from-logo-purple to-logo-pink",
    },
    {
      name: "Taylor Reed",
      position: "Creative Director",
      bio: "Taylor brings 10+ years of experience in design and video production. Their work has been recognized with multiple industry awards for creativity and innovation.",
      image: "/images/team/taylor-reed.png",
      color: "from-logo-yellow to-logo-orange",
    },
    {
      name: "Jordan Chen",
      position: "Head of Marketing",
      bio: "Jordan specializes in growth marketing and brand strategy. Before joining Motion Muse, they helped scale several successful startups through innovative marketing campaigns.",
      image: "/images/team/jordan-chen.png",
      color: "from-muse-red to-muse-orange",
    },
  ]

  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-logo-blue" />,
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible with AI and video technology.",
    },
    {
      icon: <Users className="h-8 w-8 text-logo-green" />,
      title: "Collaboration",
      description: "We believe in working closely with our clients to achieve exceptional results.",
    },
    {
      icon: <Award className="h-8 w-8 text-logo-yellow" />,
      title: "Excellence",
      description: "We're committed to delivering the highest quality in everything we do.",
    },
    {
      icon: <Heart className="h-8 w-8 text-logo-purple" />,
      title: "Passion",
      description: "We're passionate about helping brands tell their stories through compelling video content.",
    },
    {
      icon: <Globe className="h-8 w-8 text-logo-pink" />,
      title: "Impact",
      description: "We aim to create content that makes a meaningful impact for our clients and their audiences.",
    },
    {
      icon: <Clock className="h-8 w-8 text-logo-orange" />,
      title: "Efficiency",
      description: "We value our clients' time and strive to deliver results quickly without sacrificing quality.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              About <span className="logo-gradient-text">Motion Muse</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              We're on a mission to revolutionize marketing through AI-powered video content
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-navy">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Motion Muse was founded in 2018 with a simple yet ambitious vision: to make professional video content
                  accessible to businesses of all sizes. We recognized that video was becoming the dominant form of
                  content online, but creating high-quality videos remained expensive, time-consuming, and technically
                  challenging for many businesses.
                </p>
                <p>
                  Our team of marketers, designers, and AI specialists came together to develop a solution that would
                  democratize video production. By leveraging the power of artificial intelligence, we created a
                  platform that allows anyone to generate professional videos in minutes, without specialized skills or
                  expensive equipment.
                </p>
                <p>
                  Today, Motion Muse serves thousands of clients worldwide, from small startups to Fortune 500
                  companies. We've expanded our services to include comprehensive marketing solutions, but our core
                  mission remains the same: to help brands tell their stories through compelling video content.
                </p>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-logo-blue/20 via-logo-green/20 to-logo-yellow/20 rounded-lg blur-xl"></div>
              <Image
                src="/images/video-production.webp"
                alt="Motion Muse team at work"
                width={600}
                height={400}
                className="rounded-lg object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">Our Values</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The principles that guide everything we do
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="flex flex-col items-center text-center space-y-4 pt-6">
                  <div className="p-3 rounded-full bg-muted">{value.icon}</div>
                  <h3 className="text-xl font-bold text-navy">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Meet the talented individuals behind Motion Muse
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="group flex flex-col items-center text-center space-y-4">
                <div className="relative w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-full`}></div>
                  <div className="absolute inset-1 bg-white dark:bg-navy rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="rounded-full object-cover h-[calc(100%-8px)] w-[calc(100%-8px)] transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-navy">{member.name}</h3>
                  <p className="text-sm font-medium text-muse-red">{member.position}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wave-animation">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">
                Join Our Journey
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Partner with Motion Muse and transform your marketing with AI-powered video content
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-navy text-navy hover:bg-navy/10" asChild>
                <Link href="/video-generator">Try Video Generator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
