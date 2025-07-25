import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Basic access to our AI video generator",
      price: "$0",
      period: "forever",
      features: [
        { included: true, text: "3 videos per month" },
        { included: true, text: "720p video quality" },
        { included: true, text: "Basic templates" },
        { included: true, text: "15-second maximum duration" },
        { included: false, text: "Custom branding" },
        { included: false, text: "Priority rendering" },
        { included: false, text: "Advanced editing tools" },
        { included: false, text: "Commercial usage rights" },
      ],
      cta: "Get Started",
      href: "/login",
      color: "logo-blue",
      popular: false,
    },
    {
      name: "Pro",
      description: "Perfect for individual creators and small businesses",
      price: "$29",
      period: "per month",
      features: [
        { included: true, text: "30 videos per month" },
        { included: true, text: "1080p video quality" },
        { included: true, text: "All templates" },
        { included: true, text: "60-second maximum duration" },
        { included: true, text: "Custom branding" },
        { included: true, text: "Priority rendering" },
        { included: false, text: "Advanced editing tools" },
        { included: false, text: "Commercial usage rights" },
      ],
      cta: "Start Free Trial",
      href: "/login",
      color: "muse-red",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For teams and organizations with advanced needs",
      price: "$99",
      period: "per month",
      features: [
        { included: true, text: "Unlimited videos" },
        { included: true, text: "4K video quality" },
        { included: true, text: "All templates + exclusive ones" },
        { included: true, text: "No duration limits" },
        { included: true, text: "Custom branding" },
        { included: true, text: "Priority rendering" },
        { included: true, text: "Advanced editing tools" },
        { included: true, text: "Commercial usage rights" },
      ],
      cta: "Contact Sales",
      href: "/contact",
      color: "logo-green",
      popular: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              Simple, Transparent <span className="logo-gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              Choose the plan that's right for you and start creating amazing videos today
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`flex flex-col border-${plan.color}/20 ${plan.popular ? "relative shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-muse-red px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-navy">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline text-navy">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="ml-1 text-sm font-medium text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <Check className={`mr-2 h-4 w-4 text-${plan.color}`} />
                        ) : (
                          <X className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={
                            feature.included ? "text-foreground" : "text-muted-foreground line-through opacity-75"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                        : `bg-${plan.color} hover:bg-${plan.color}/90 text-white`
                    }`}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-navy">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about our pricing and plans</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Can I change plans at any time?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
                },
                {
                  question: "Is there a free trial?",
                  answer:
                    "Yes, we offer a 7-day free trial on our Pro plan so you can experience all the features before committing.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and for Enterprise plans, we can also accommodate bank transfers and purchase orders.",
                },
                {
                  question: "Can I cancel my subscription?",
                  answer:
                    "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
                },
                {
                  question: "Do you offer discounts for non-profits or educational institutions?",
                  answer:
                    "Yes, we offer special pricing for non-profits, educational institutions, and students. Please contact our sales team for more information.",
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-medium text-navy">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 wave-animation">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-navy">
                Ready to Transform Your Video Content?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of creators and businesses using Motion Muse to create stunning videos
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                asChild
              >
                <Link href="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-navy text-navy hover:bg-navy/10" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
