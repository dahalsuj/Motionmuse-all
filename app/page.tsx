// "use client"

// import HeroSection from "@/components/hero-section"

// export default function Home() {
//   return (
//     <main className="flex-1">
//       <HeroSection />
//     </main>
//   )
// }
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Film, Lightbulb, Megaphone, Rocket } from "lucide-react"
import HeroSection from "@/components/hero-section"
import AnimatedSection from "@/components/animated-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">Our Services</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Comprehensive marketing solutions to elevate your brand
              </p>
            </div>
          </AnimatedSection>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                icon: <Film className="h-12 w-12 text-logo-blue mb-2" />,
                title: "Video Marketing",
                description: "Create engaging video content that resonates with your audience",
                color: "logo-blue",
                delay: 0.1,
              },
              {
                icon: <Megaphone className="h-12 w-12 text-logo-green mb-2" />,
                title: "Social Media",
                description: "Engage your audience across all social platforms",
                color: "logo-green",
                delay: 0.2,
              },
              {
                icon: <Lightbulb className="h-12 w-12 text-logo-yellow mb-2" />,
                title: "Brand Strategy",
                description: "Develop a cohesive brand identity that stands out",
                color: "logo-yellow",
                delay: 0.3,
              },
            ].map((service, index) => (
              <AnimatedSection key={index} delay={service.delay}>
                <Card
                  className={`border-${service.color}/20 hover:border-${service.color} transition-colors hover:shadow-md`}
                >
                  <CardHeader className="pb-2">
                    {service.icon}
                    <CardTitle className="text-navy">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our AI-powered solutions create professional content in minutes, saving you time and resources.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the page content... */}
      {/* Video Generator Promo */}
      <AnimatedSection>
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mx-auto lg:order-last relative">
                <div className="absolute inset-0 bg-gradient-to-r from-logo-purple/20 via-logo-pink/20 to-logo-orange/20 rounded-lg blur-xl"></div>
                <Image
                  src="/images/video-generator-demo.png"
                  alt="AI Video Generator Demo"
                  width={600}
                  height={400}
                  className="rounded-lg relative z-10 shadow-lg transform transition-transform duration-500 hover:scale-105"
                  priority
                  quality={100}
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-navy">
                  AI-Powered Video Generator
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Create professional videos in minutes with our cutting-edge AI technology. No design skills required.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-muse-red" />
                    <span>Customizable templates for any industry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-muse-orange" />
                    <span>Text-to-video technology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-logo-blue" />
                    <span>High-quality output ready for social media</span>
                  </li>
                </ul>
                <div>
                  <Button
                    className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/video-generator" className="inline-flex items-center gap-1">
                      <span className="relative z-10">
                        Try it now <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-muse-orange to-muse-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Additional sections would follow... */}
      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">
                What Our Clients Say
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Hear from businesses that have transformed their marketing with Motion Muse
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                color: "logo-blue",
                index: 1,
                name: "Laura Bennett",
                position: "Head of Content, FreshFlow Organics",
                image: "/images/clients/laura-bennett.jpg",
                quote:
                  "Motion Muse transformed our content strategy. Their AI video generator saved us countless hours and delivered professional results that our audience loves.",
              },
              {
                color: "logo-green",
                index: 2,
                name: "Emma Rodriguez",
                position: "Head of Marketing, NovaThreads Apparel",
                image: "/images/clients/emma-rodriguez.jpg",
                quote:
                  "The quality and speed of Motion Muse's video generator has revolutionized our social media campaigns. We've seen a 40% increase in engagement since implementing their solutions.",
              },
              {
                color: "logo-purple",
                index: 3,
                name: "James Parker",
                position: "VP of Brand Strategy, UrbanLift Media",
                image: "/images/clients/james-parker.jpg",
                quote:
                  "As a media company, we have high standards for video content. Motion Muse not only met but exceeded our expectations with their innovative AI technology.",
              },
            ].map(({ color, index, name, position, image, quote }) => (
              <Card
                key={index}
                className={`overflow-hidden border-${color}/20 hover:border-${color} transition-colors`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Image
                      src={image}
                      alt={`${name}`}
                      width={50}
                      height={50}
                      className="rounded-full object-cover h-[50px] w-[50px]"
                      quality={100}
                    />
                    <div>
                      <CardTitle className="text-lg text-navy">{name}</CardTitle>
                      <CardDescription>{position}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">"{quote}"</p>
                </CardContent>
              </Card>
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
                Ready to Transform Your Marketing?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Get started with Motion Muse today and see the difference our AI-powered solutions can make.
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
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}