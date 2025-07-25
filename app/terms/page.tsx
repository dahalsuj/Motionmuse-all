import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, UserCheck, Lock, Globe, FileText, DollarSign, AlertCircle, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "user-responsibilities", label: "User Responsibilities", icon: <UserCheck className="inline w-5 h-5 text-logo-blue mr-2" /> },
  { id: "intellectual-property", label: "Intellectual Property", icon: <FileText className="inline w-5 h-5 text-logo-green mr-2" /> },
  { id: "generated-content", label: "Use of Generated Content", icon: <CheckCircle className="inline w-5 h-5 text-logo-yellow mr-2" /> },
  { id: "subscription", label: "Subscription & Payment", icon: <DollarSign className="inline w-5 h-5 text-logo-orange mr-2" /> },
  { id: "warranty", label: "Disclaimer of Warranties", icon: <AlertCircle className="inline w-5 h-5 text-logo-purple mr-2" /> },
  { id: "liability", label: "Limitation of Liability", icon: <Lock className="inline w-5 h-5 text-logo-red mr-2" /> },
  { id: "termination", label: "Account Termination", icon: <XCircle className="inline w-5 h-5 text-logo-pink mr-2" /> },
  { id: "acceptable-use", label: "Acceptable Use Policy", icon: <ShieldCheck className="inline w-5 h-5 text-logo-green mr-2" /> },
  { id: "changes", label: "Changes to Terms", icon: <AlertCircle className="inline w-5 h-5 text-logo-orange mr-2" /> },
  { id: "law", label: "Governing Law", icon: <Globe className="inline w-5 h-5 text-logo-blue mr-2" /> },
  { id: "ai-disclaimer", label: "AI Disclaimer", icon: <ExternalLink className="inline w-5 h-5 text-logo-yellow mr-2" /> },
  { id: "contact", label: "Contact Us", icon: <UserCheck className="inline w-5 h-5 text-logo-blue mr-2" /> },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-navy">
              Terms of <span className="logo-gradient-text">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed max-w-3xl">
              Please read these terms carefully before using Motion Muse. We're committed to clarity, fairness, and your creative freedom.
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
                Thank you for choosing Motion Muse! These Terms of Service (“Terms”) are designed to help you understand your rights and responsibilities when using our AI-powered video generation platform. Please read them carefully—by accessing or using our Service, you agree to these Terms and help us foster a creative, safe, and fair environment for everyone.
              </p>
            </div>
            <Accordion type="multiple" className="w-full">
              {/* User Responsibilities */}
              <AccordionItem value="user-responsibilities" id="user-responsibilities">
                <AccordionTrigger className="text-lg font-semibold">{sections[0].icon} User Responsibilities</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
                    <li>You must not submit, upload, or generate content that is unlawful, infringing, defamatory, obscene, or otherwise objectionable.</li>
                    <li>You are solely responsible for the content you provide and any consequences of sharing or publishing generated videos.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Intellectual Property */}
              <AccordionItem value="intellectual-property" id="intellectual-property">
                <AccordionTrigger className="text-lg font-semibold">{sections[1].icon} Intellectual Property Rights</AccordionTrigger>
                <AccordionContent>
                  <p>
                    All intellectual property rights in the Service, including software, algorithms, and AI models, are owned by Motion Muse or its licensors. Except for the rights expressly granted to you, no rights are transferred or licensed by implication.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Use of Generated Content */}
              <AccordionItem value="generated-content" id="generated-content">
                <AccordionTrigger className="text-lg font-semibold">{sections[2].icon} Use of Generated Content</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>You retain all rights to the content you submit and to the AI-generated videos you create using the Service.</li>
                    <li>Subject to your compliance with these Terms, you are granted a worldwide, royalty-free, non-exclusive license to use, reproduce, and distribute the generated videos, including for commercial purposes.</li>
                    <li>You are responsible for ensuring that your use of generated content complies with applicable laws and does not infringe third-party rights.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Subscription & Payment */}
              <AccordionItem value="subscription" id="subscription">
                <AccordionTrigger className="text-lg font-semibold">{sections[3].icon} Subscription and Payment Terms</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Access to certain features of the Service may require a paid subscription. By subscribing, you agree to pay all applicable fees and charges. Subscription terms, pricing, and cancellation policies are provided at the time of purchase and may be updated from time to time.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Disclaimer of Warranties */}
              <AccordionItem value="warranty" id="warranty">
                <AccordionTrigger className="text-lg font-semibold">{sections[4].icon} Disclaimer of Warranties</AccordionTrigger>
                <AccordionContent>
                  <p>
                    The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. Motion Muse does not warrant that the Service will be uninterrupted, error-free, or free of harmful components.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Limitation of Liability */}
              <AccordionItem value="liability" id="liability">
                <AccordionTrigger className="text-lg font-semibold">{sections[5].icon} Limitation of Liability</AccordionTrigger>
                <AccordionContent>
                  <p>
                    To the fullest extent permitted by law, Motion Muse and its affiliates, officers, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of the Service or generated content.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Account Termination */}
              <AccordionItem value="termination" id="termination">
                <AccordionTrigger className="text-lg font-semibold">{sections[6].icon} Account Termination</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is otherwise harmful to the Service or other users.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Acceptable Use Policy */}
              <AccordionItem value="acceptable-use" id="acceptable-use">
                <AccordionTrigger className="text-lg font-semibold">{sections[7].icon} Acceptable Use Policy</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>You must not misuse the Service, attempt to gain unauthorized access, or interfere with the operation of the Service.</li>
                    <li>You must not use the Service to generate or distribute spam, malware, or other harmful content.</li>
                    <li>We reserve the right to investigate and take appropriate action against violations.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Changes to Terms */}
              <AccordionItem value="changes" id="changes">
                <AccordionTrigger className="text-lg font-semibold">{sections[8].icon} Changes to Terms</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the effective date. Continued use of the Service after changes constitutes acceptance of the new Terms.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Governing Law */}
              <AccordionItem value="law" id="law">
                <AccordionTrigger className="text-lg font-semibold">{sections[9].icon} Governing Law</AccordionTrigger>
                <AccordionContent>
                  <p>
                    These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Motion Muse is established, without regard to its conflict of law principles.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* AI Disclaimer */}
              <AccordionItem value="ai-disclaimer" id="ai-disclaimer">
                <AccordionTrigger className="text-lg font-semibold">{sections[10].icon} AI Disclaimer</AccordionTrigger>
                <AccordionContent>
                  <p>
                    The Service uses artificial intelligence to generate video content based on user input. Generated content may be inaccurate, incomplete, or reflect unintended bias. You are solely responsible for reviewing and verifying the accuracy and appropriateness of all outputs before use or publication.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* Contact Us */}
              <AccordionItem value="contact" id="contact">
                <AccordionTrigger className="text-lg font-semibold">{sections[11].icon} Contact Us</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>Email: <a href="mailto:support@motionmuse.watch" className="underline text-logo-blue">support@motionmuse.watch</a></li>
                    <li>Address: Motion Muse, 123 Innovation Way, San Francisco, CA 94107, United States</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8 text-center">
              <Link href="#terms-top" className="text-logo-blue underline focus:outline-none focus:ring-2 focus:ring-logo-blue rounded px-2 py-1">Back to Top</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 