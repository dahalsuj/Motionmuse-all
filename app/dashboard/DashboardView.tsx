import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  workspaceName: string | null;
  onboardingCompleted: boolean;
}

interface DashboardViewProps {
  user: User;
}

export default function DashboardView({ user }: DashboardViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Common Features for All Plans */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/video-generator">Create Video</Link>
            </Button>
          </div>
        </Card>

        {/* Plan-Specific Features */}
        {user.plan === "free" && (
          <Card className="p-6 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Free Plan Features</h2>
            <ul className="space-y-2 mb-6">
              <li>✓ Basic video generation</li>
              <li>✓ 720p resolution</li>
              <li>✓ 5 videos per month</li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          </Card>
        )}

        {user.plan === "pro" && (
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Pro Plan Features</h2>
            <ul className="space-y-2">
              <li>✓ Advanced video generation</li>
              <li>✓ 1080p resolution</li>
              <li>✓ 50 videos per month</li>
              <li>✓ Priority support</li>
              <li>✓ Custom branding</li>
            </ul>
          </Card>
        )}

        {user.plan === "enterprise" && (
          <Card className="p-6 bg-purple-50">
            <h2 className="text-xl font-semibold mb-4">Enterprise Features</h2>
            <ul className="space-y-2">
              <li>✓ Premium video generation</li>
              <li>✓ 4K resolution</li>
              <li>✓ Unlimited videos</li>
              <li>✓ 24/7 dedicated support</li>
              <li>✓ API access</li>
              <li>✓ Custom integrations</li>
            </ul>
          </Card>
        )}

        {/* Usage Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg font-medium capitalize">{user.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Workspace</p>
              <p className="text-lg font-medium">{user.workspaceName || "Personal"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 