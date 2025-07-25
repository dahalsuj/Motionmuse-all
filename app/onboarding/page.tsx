"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const userTypes = [
  "Corporate communicator",
  "Content creator",
  "Marketer or advertiser",
  "Educator and Instructors",
  "Film-makers & animators",
  "Other",
];

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0/month",
    description: "Perfect for getting started",
    features: [
      "Basic video generation",
      "720p resolution",
      "5 videos per month",
      "Basic support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/month",
    description: "Best for professionals",
    features: [
      "Advanced video generation",
      "1080p resolution",
      "50 videos per month",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Premium video generation",
      "4K resolution",
      "Unlimited videos",
      "24/7 dedicated support",
      "API access",
      "Custom integrations",
    ],
  },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [workspaceName, setWorkspaceName] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Save name/workspace, go to next
  const handleContinueStep1 = () => {
    if (!name || !workspaceName) {
      setError("Please enter your name and workspace name.");
      return;
    }
    setError("");
    setStep(2);
  };

  // Step 2: Save user type, go to next
  const handleContinueStep2 = () => {
    if (!userType) {
      setError("Please select a user type.");
      return;
    }
    setError("");
    setStep(3);
  };

  // Step 3: Save plan, finish onboarding
  const handleContinueStep3 = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Save name, workspace, userType
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, workspaceName, userType }),
      });
      // Save plan and mark onboarding complete
      await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      // If enterprise, update team name to workspaceName
      if (selectedPlan === "enterprise" && workspaceName) {
        await fetch("/api/team/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: workspaceName }),
        });
      }
      // Force a full reload to refresh user context
      if (selectedPlan === "pro") window.location.href = "/dashboard/pro";
      else if (selectedPlan === "enterprise") window.location.href = "/dashboard/enterprise";
      else window.location.href = "/dashboard";
    } catch (err) {
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 1 && (
        <div>
          <h1 className="text-3xl font-bold mb-4">What should we call you?</h1>
          <div className="mb-4">
            <label className="block mb-1">Name:</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Workspace name:</label>
            <input value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} className="input w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button onClick={handleContinueStep1}>Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-3xl font-bold mb-2">Let's know you better</h1>
          <p className="mb-4 text-muted-foreground">
            The more we know about you, the better we can customize your experience.
          </p>
          <div className="grid gap-4 mb-6">
            {userTypes.map(type => (
              <Card
                key={type}
                className={`p-4 cursor-pointer ${userType === type ? "ring-2 ring-primary" : ""}`}
                onClick={() => setUserType(type)}
              >
                {type}
              </Card>
            ))}
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button onClick={handleContinueStep2} disabled={!userType}>Continue</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map(plan => (
          <Card
            key={plan.id}
                className={`p-6 cursor-pointer ${selectedPlan === plan.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold mb-2">{plan.price}</p>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <ul className="space-y-2 mb-6">
                  {plan.features.map(feature => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={selectedPlan === plan.id ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedPlan(plan.id)}
            >
              {selectedPlan === plan.id ? "Selected" : "Select Plan"}
            </Button>
          </Card>
        ))}
      </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button size="lg" onClick={handleContinueStep3} disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
      )}
    </div>
  );
}
