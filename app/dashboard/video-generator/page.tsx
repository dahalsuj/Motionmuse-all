"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Video, Upload, Settings } from "lucide-react";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Add video generation logic here
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gen AI Studio</h1>
        <p className="text-gray-500 mt-1">
          Create amazing videos using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Video</h2>
            <Textarea
              placeholder="Describe your video idea..."
              className="min-h-[200px] mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Video"}
              </Button>
              <Button variant="outline" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="mt-6 p-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Style
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option>Cinematic</option>
                  <option>Documentary</option>
                  <option>Commercial</option>
                  <option>Social Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option>15 seconds</option>
                  <option>30 seconds</option>
                  <option>60 seconds</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option>1080p</option>
                  <option>720p</option>
                  <option>4K</option>
                </select>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </Card>

          {/* Usage Stats */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Videos Generated</span>
                <span className="font-medium">3/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/5"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                2 videos remaining this month
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 