"use client";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { BarChart, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserUsageData {
  videosUsedThisMonth: number;
  monthlyQuota: number;
  remainingVideos: number;
  userPlan: string;
}

export default function UsagePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [usageData, setUsageData] = useState<UserUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    // In a real application, you would fetch user-specific usage data from an API.
    // For this example, we'll use static data.
    setUsageData({
      videosUsedThisMonth: 0,
      monthlyQuota: 100,
      remainingVideos: 100,
      userPlan: user.plan || "free",
    });
    setLoading(false);

    // Example of fetching usage data from a hypothetical API:
    // async function fetchUsageData() {
    //   try {
    //     setLoading(true);
    //     const res = await fetch("/api/usage");
    //     if (!res.ok) throw new Error("Failed to fetch usage data");
    //     const data = await res.json();
    //     setUsageData(data.usage);
    //   } catch (error) {
    //     console.error("Error fetching usage data:", error);
    //     // Handle error (e.g., show a toast message)
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // fetchUsageData();
  }, [user, router]);

  if (loading) {
    return <div className="p-8">Loading Usage Data...</div>;
  }

  if (!user || !usageData) {
    return null; // Should be redirected or data loaded
  }

  const { videosUsedThisMonth, monthlyQuota, remainingVideos, userPlan } = usageData;
  const progressPercent = (videosUsedThisMonth / monthlyQuota) * 100;

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Usage & Quotas</h1>
      <p className="text-gray-700 mb-12">
        Monitor your video usage and manage your plan quotas here.
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-muse-red flex items-center gap-2">
          <BarChart className="w-5 h-5" /> Usage Overview
        </h2>
        <Card className="p-8 rounded-2xl shadow-lg border-0 bg-gradient-to-r from-orange-50 to-white">
          <div className="mb-4">
            <p className="text-gray-700 text-lg mb-2">
              Videos used this month: <span className="font-semibold">{videosUsedThisMonth} / {monthlyQuota}</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-muse-red to-muse-orange h-3 rounded-full"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {remainingVideos} videos remaining this month.
            </p>
          </div>

          <p className="text-blue-600 text-sm">
            Enjoy higher limits and priority support as a <span className="capitalize font-semibold">{userPlan}</span> user!
          </p>
        </Card>
      </div>
    </div>
  );
} 