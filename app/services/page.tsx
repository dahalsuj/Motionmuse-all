import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Film, Lightbulb, Megaphone, Palette, PenTool, Rocket, Target, Zap } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: "video-marketing",
      title: "Video Marketing",
      description: "Create engaging video content that resonates with your audience",
      icon: <Film className="h-12 w-12 text-logo-blue mb-2" />,
      color: "logo-blue",
      features: [
        "AI-powered video generation",
        "Professional editing and post-production",
        "Custom animations and motion graphics",
        "Video SEO optimization",
        "Distribution strategy",
      ],
      image: "/images/video-generator-demo.png",
    },
    {
      id: "social-media",
      title: "Social Media",
      description: "Engage your audience across all social platforms",
      icon: <Megaphone className="h-12 w-12 text-logo-green mb-2" />,
      color: "logo-green",
      features: [
        "Content calendar planning",
        "Platform-specific strategies",
        "Community management",
        "Paid social campaigns",
        "Performance analytics",
      ],
      image: "/placeholder.svg?height=400&width=600&text=Social+Media+Management",
    },
    {
      id: "brand-strategy",
      title: "Brand Strategy",
      description: "Develop a cohesive brand identity that stands out",
      icon: <Lightbulb className="h-12 w-12 text-logo-yellow mb-2" />,
      color: "logo-yellow",
      features: [
        "Brand positioning",
        "Visual identity development",
        "Messaging framework",
        "Competitive analysis",
        "Brand guidelines",
      ],
      image: "/placeholder.svg?height=400&width=600&text=Brand+Strategy",
    },
    {
      id: "content-creation",
      title: "Content Creation",
      description: "Produce high-quality content that drives engagement",
      icon: <PenTool className="h-12 w-12 text-logo-purple mb-2" />,
      color: "logo-purple",
      features: [
        "Blog posts and articles",
        "Infographics and visual content",
        "Ebooks and whitepapers",
        "Email newsletters",
        "Case studies",
      ],
      image: "/placeholder.svg?height=400&width=600&text=Content+Creation",
    },
    {
      id: "digital-advertising",
      title: "Digital Advertising",
      description: "Reach your target audience with precision",
      icon: <Target className="h-12 w-12 text-logo-pink mb-2" />,
      color: "logo-pink",
      features: [
        "PPC campaign management",
        "Display advertising",
        "Retargeting campaigns",
        "Ad creative development",
        "Performance tracking",
      ],
      image: "/placeholder.svg?height=400&width=600&text=Digital+Advertising",
    },
    {
      id: "analytics",
      title: "Analytics & Reporting",
      description: "Gain insights to optimize your marketing efforts",
      icon: <BarChart3 className="h-12 w-12 text-logo-orange mb-2" />,
      color: "logo-orange",
      features: [
        "Custom dashboard creation",
        "KPI tracking",
        "Conversion optimization",
        "A/B testing",
        "Monthly performance reports",
      ],
      image: "/placeholder.svg?height=400&width=600&text=Analytics+and+Reporting",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              Our <span className="logo-gradient-text">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              Comprehensive marketing solutions to elevate your brand and drive results
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`border-${service.color}/20 hover:border-${service.color} transition-colors`}
              >
                <CardHeader className="pb-2">
                  {service.icon}
                  <CardTitle className="text-navy">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Zap className={`h-4 w-4 text-${service.color}`} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className={`text-${service.color} hover:bg-${service.color}/10 w-full justify-start`}
                    asChild
                  >
                    <Link href={`#${service.id}`} className="inline-flex items-center gap-1">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Service: Video Marketing */}
      <section id="video-marketing" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-logo-blue text-white">
                Featured Service
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-navy">Video Marketing</h2>
              <p className="text-muted-foreground md:text-xl">
                Create engaging video content that resonates with your audience and drives conversions.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-navy">Why Video Marketing?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-logo-blue" />
                    <span>Videos generate 1200% more shares than text and images combined</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-logo-blue" />
                    <span>86% of businesses use video as a marketing tool</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-logo-blue" />
                    <span>93% of marketers say they've landed a new customer thanks to a video on social media</span>
                  </li>
                </ul>
              </div>
              <div>
                <Button
                  className="bg-gradient-to-r from-logo-blue to-logo-blue-light hover:from-logo-blue/90 hover:to-logo-blue-light/90 text-white"
                  asChild
                >
                  <Link href="/video-generator" className="inline-flex items-center gap-1">
                    Try our Video Generator <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-logo-blue/20 via-logo-blue-light/20 to-logo-green/20 rounded-lg blur-xl"></div>
              <Image
                src="/images/video-generator-demo.png"
                alt="Video Marketing"
                width={600}
                height={400}
                className="rounded-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">Our Process</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                How we work with you to deliver exceptional results
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We learn about your business, goals, and target audience",
                icon: <Target className="h-10 w-10 text-logo-blue" />,
              },
              {
                step: "02",
                title: "Strategy",
                description: "We develop a customized plan to achieve your objectives",
                icon: <Lightbulb className="h-10 w-10 text-logo-green" />,
              },
              {
                step: "03",
                title: "Creation",
                description: "We produce high-quality content and implement campaigns",
                icon: <Palette className="h-10 w-10 text-logo-yellow" />,
              },
              {
                step: "04",
                title: "Optimization",
                description: "We analyze results and continuously improve performance",
                icon: <BarChart3 className="h-10 w-10 text-logo-purple" />,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-logo-blue/20 to-logo-green/20 rounded-full blur-lg"></div>
                  <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-background border border-muted shadow-sm">
                    {item.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.step}</span>
                  <h3 className="text-xl font-bold text-navy">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
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
                Ready to Elevate Your Marketing?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Contact us today to discuss how we can help you achieve your marketing goals.
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
