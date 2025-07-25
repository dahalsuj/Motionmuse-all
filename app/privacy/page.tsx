import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, UserCheck, Lock, Globe, Cookie, Trash2, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "data-collection", label: "Data Collection", icon: <UserCheck className="inline w-5 h-5 text-logo-blue mr-2" /> },
  { id: "user-content", label: "User Content", icon: <Globe className="inline w-5 h-5 text-logo-green mr-2" /> },
  { id: "cookies", label: "Use of Cookies", icon: <Cookie className="inline w-5 h-5 text-logo-yellow mr-2" /> },
  { id: "data-retention", label: "Data Retention", icon: <Trash2 className="inline w-5 h-5 text-logo-orange mr-2" /> },
  { id: "security", label: "Security Practices", icon: <Lock className="inline w-5 h-5 text-logo-purple mr-2" /> },
  { id: "ai-processing", label: "AI Processing", icon: <Globe className="inline w-5 h-5 text-logo-pink mr-2" /> },
  { id: "user-rights", label: "User Rights", icon: <ShieldCheck className="inline w-5 h-5 text-logo-green mr-2" /> },
  { id: "third-party", label: "Third-Party Tools", icon: <ExternalLink className="inline w-5 h-5 text-logo-blue mr-2" /> },
  { id: "international", label: "International Data Transfers", icon: <Globe className="inline w-5 h-5 text-logo-yellow mr-2" /> },
  { id: "no-sale", label: "No Sale of Data", icon: <AlertCircle className="inline w-5 h-5 text-logo-red mr-2" /> },
  { id: "gdpr", label: "GDPR & Regulations", icon: <ShieldCheck className="inline w-5 h-5 text-logo-green mr-2" /> },
  { id: "changes", label: "Changes to Policy", icon: <AlertCircle className="inline w-5 h-5 text-logo-orange mr-2" /> },
  { id: "contact", label: "Contact Us", icon: <UserCheck className="inline w-5 h-5 text-logo-blue mr-2" /> },
];

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              Your Privacy, <span className="logo-gradient-text">Our Promise</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              At Motion Muse, we believe your trust is our greatest asset. Discover how we protect your data and empower your creativity with transparency and care.
            </p>
          </div>
        </div>
      </section>
      {/* TOC & Content */}
      <section className="py-10 bg-muted/50 flex-1">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row gap-8">
          {/* Sticky TOC Sidebar (desktop) */}
          <nav aria-label="Table of Contents" className="hidden md:block md:w-1/4 sticky top-24 self-start">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex items-center text-muted-foreground hover:text-logo-blue focus:outline-none focus:ring-2 focus:ring-logo-blue rounded px-2 py-1 transition-colors">
                    {section.icon}
                    <span>{section.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Main Content */}
          <div className="md:w-3/4 w-full">
            <div className="prose prose-lg max-w-none text-foreground mb-8">
              <p>
                Welcome to Motion Muse! We're passionate about helping you create stunning marketing videos with the power of AI—while keeping your privacy and security at the heart of everything we do. This Privacy Policy explains how we collect, use, and safeguard your information as you bring your creative ideas to life on our platform.
              </p>
            </div>
            <Accordion type="multiple" className="w-full">
              {/* Data Collection */}
              <AccordionItem value="data-collection" id="data-collection">
                <AccordionTrigger className="text-lg font-semibold">{sections[0].icon} Data Collection</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li><strong>Account Information:</strong> We collect information you provide when you register, such as your name, email address, and password.</li>
                    <li><strong>User Content:</strong> We collect text prompts, uploaded files, and any other content you submit to generate videos.</li>
                    <li><strong>Usage Data:</strong> We collect information about your interactions with the Service, including access times, pages viewed, and actions taken.</li>
                    <li><strong>Device & Log Data:</strong> We may collect information about the device and browser you use, IP address, and log data.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* User Content */}
              <AccordionItem value="user-content" id="user-content">
                <AccordionTrigger className="text-lg font-semibold">{sections[1].icon} User Content</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Your creative input is yours. The text prompts and other content you submit are processed by our AI models to generate marketing videos just for you. We may store this content to improve our services, provide support, and comply with legal obligations—but we never use your content to train public AI models without your consent.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Use of Cookies */}
              <AccordionItem value="cookies" id="cookies">
                <AccordionTrigger className="text-lg font-semibold">{sections[2].icon} Use of Cookies</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We use cookies and similar tracking technologies to make your experience seamless, remember your preferences, and help us continually improve. You can control cookies through your browser settings.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Data Retention */}
              <AccordionItem value="data-retention" id="data-retention">
                <AccordionTrigger className="text-lg font-semibold">{sections[3].icon} Data Retention</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We retain your personal data and user content for as long as your account is active or as needed to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your data as described below.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Security Practices */}
              <AccordionItem value="security" id="security">
                <AccordionTrigger className="text-lg font-semibold">{sections[4].icon} Security Practices</AccordionTrigger>
                <AccordionContent>
                  <p>
                    <span className="inline-flex items-center gap-2 text-logo-green font-medium"><ShieldCheck className="w-5 h-5" /> Your security is our priority.</span> We implement robust administrative, technical, and physical safeguards to protect your information. While no method of transmission over the Internet or electronic storage is 100% secure, we are committed to keeping your data safe.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* AI Processing */}
              <AccordionItem value="ai-processing" id="ai-processing">
                <AccordionTrigger className="text-lg font-semibold">{sections[5].icon} AI Processing</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Your submitted content is processed by advanced AI models to generate videos tailored to your needs. We may use trusted third-party AI providers or cloud services to perform these operations, always with your privacy in mind.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* User Rights */}
              <AccordionItem value="user-rights" id="user-rights">
                <AccordionTrigger className="text-lg font-semibold">{sections[6].icon} User Rights</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li><strong>Access:</strong> You may request access to the personal data we hold about you.</li>
                    <li><strong>Correction:</strong> You may request correction of inaccurate or incomplete data.</li>
                    <li><strong>Deletion:</strong> You may request deletion of your personal data, subject to certain exceptions.</li>
                    <li><strong>Objection & Restriction:</strong> You may object to or request restriction of processing in certain circumstances.</li>
                  </ul>
                  <p className="mt-2 text-logo-blue flex items-center gap-2"><UserCheck className="w-5 h-5" /> To exercise your rights, please contact us using the information below. We're here to help!</p>
                </AccordionContent>
              </AccordionItem>
              {/* Third-Party Tools */}
              <AccordionItem value="third-party" id="third-party">
                <AccordionTrigger className="text-lg font-semibold">{sections[7].icon} Third-Party Tools & Data Processing</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We may use third-party service providers (such as cloud hosting, analytics, and AI processing) to operate and improve the Service. These providers may process your data on our behalf and are contractually obligated to protect your information.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* International Data Transfers */}
              <AccordionItem value="international" id="international">
                <AccordionTrigger className="text-lg font-semibold">{sections[8].icon} International Data Transfers</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Your information may be transferred to and processed in countries outside your country of residence, including the United States and other jurisdictions where our service providers operate. We comply with applicable data protection laws regarding such transfers.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* No Sale of Data */}
              <AccordionItem value="no-sale" id="no-sale">
                <AccordionTrigger className="text-lg font-semibold">{sections[9].icon} No Sale of Personal Data</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We do not sell your personal data to third parties. <span className="text-logo-red font-medium">Your trust means everything to us.</span>
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* GDPR & Regulations */}
              <AccordionItem value="gdpr" id="gdpr">
                <AccordionTrigger className="text-lg font-semibold">{sections[10].icon} Compliance with GDPR and Similar Regulations</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We comply with the General Data Protection Regulation (GDPR) and other applicable data protection laws. You have the right to lodge a complaint with a supervisory authority if you believe your rights have been violated.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Changes to Policy */}
              <AccordionItem value="changes" id="changes">
                <AccordionTrigger className="text-lg font-semibold">{sections[11].icon} Changes to This Policy</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Contact Us */}
              <AccordionItem value="contact" id="contact">
                <AccordionTrigger className="text-lg font-semibold">{sections[12].icon} Contact Us</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>Email: <a href="mailto:support@motionmuse.watch" className="underline text-logo-blue">support@motionmuse.watch</a></li>
                    <li>Address: Motion Muse, 123 Innovation Way, San Francisco, CA 94107, United States</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8 text-center">
              <Link href="#policy-top" className="text-logo-blue underline focus:outline-none focus:ring-2 focus:ring-logo-blue rounded px-2 py-1">Back to Top</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 