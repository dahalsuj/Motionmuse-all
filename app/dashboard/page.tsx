"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Video, Presentation, Mic2, Plus, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.plan === "pro") {
      router.replace("/dashboard/pro");
    } else if (user?.plan === "enterprise") {
      router.replace("/dashboard/enterprise");
    }
  }, [user, router]);

  const aiTools = [
    {
      name: "Gen AI Studio",
      description: "Create videos from text prompts.",
      icon: Wand2,
      href: "/dashboard/video-generator",
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      name: "Create Clips",
      description: "Extract highlights from a longer video.",
      icon: Video,
      href: "/dashboard/clips",
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      name: "Slides to Video",
      description: "Turn slide decks into compelling videos.",
      icon: Presentation,
      href: "/dashboard/slides",
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      beta: true,
    },
    {
      name: "Create an avatar of yourself",
      description: "Clone your voice & face",
      icon: Mic2,
      href: "/dashboard/avatar",
      color: "bg-pink-100",
      textColor: "text-pink-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 min-h-screen">
      {/* Welcome Banner */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-muse-red to-muse-orange p-8 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <User className="inline-block w-8 h-8 mr-2" />
            Welcome back, {user?.name}!
          </h1>
          <p className="text-white/90 text-lg">Ready to create something amazing today?</p>
        </div>
        <Button
          asChild
          className="bg-white text-muse-red font-bold shadow-lg hover:bg-orange-50 transition"
        >
          <Link href="/video-generator">Try Video Generator</Link>
        </Button>
      </div>

      {/* Usage and Quotas for Free Users */}
      {user?.plan === "free" && (
        <Card className="mb-8 p-6 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-xl font-bold mb-2 text-muse-red">Usage & Quotas</h2>
          <div className="mb-1">Videos used this month: <b>2</b></div>
          <div className="mb-1">Monthly quota: <b>5</b></div>
          <div className="mb-1">Remaining videos: <b>3</b></div>
          <div className="mt-2 text-sm text-muted-foreground">Upgrade to Pro for more videos and features!</div>
          <Button asChild className="mt-4 bg-gradient-to-r from-muse-red to-muse-orange text-white hover:from-muse-red/90 hover:to-muse-orange/90">
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </Card>
      )}

      {/* AI Tools Grid */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-muse-orange" /> AI Apps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.name} href={tool.href}>
                <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer h-full rounded-xl border-0 bg-white">
                  <div className={`w-12 h-12 rounded-lg ${tool.color} ${tool.textColor} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    {tool.name}
                    {tool.beta && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Beta
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy flex items-center gap-2">
            <Video className="w-5 h-5 text-muse-orange" /> Recent Projects
          </h2>
          <Button asChild className="bg-gradient-to-r from-muse-red to-muse-orange text-white hover:from-muse-red/90 hover:to-muse-orange/90">
            <Link href="/video-generator">
            <Plus className="w-4 h-4 mr-2" />
            New Project
            </Link>
          </Button>
        </div>
        <Card className="p-8 text-center rounded-xl shadow-md border-0 bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Create your first project
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating a new video project or using one of our AI tools.
          </p>
          <Button asChild className="bg-gradient-to-r from-muse-red to-muse-orange text-white hover:from-muse-red/90 hover:to-muse-orange/90">
            <Link href="/video-generator">
            <Plus className="w-4 h-4 mr-2" />
            New Project
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
} 