"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Social Media Story",
      description: "Perfect for Instagram and Facebook stories",
      thumbnail: "https://placehold.co/400x600",
      category: "Social Media",
    },
    {
      id: 2,
      name: "YouTube Thumbnail",
      description: "Stand out with eye-catching thumbnails",
      thumbnail: "https://placehold.co/400x600",
      category: "YouTube",
    },
    {
      id: 3,
      name: "Product Demo",
      description: "Showcase your product features",
      thumbnail: "https://placehold.co/400x600",
      category: "Marketing",
    },
    {
      id: 4,
      name: "Tutorial Video",
      description: "Create engaging educational content",
      thumbnail: "https://placehold.co/400x600",
      category: "Education",
    },
    {
      id: 5,
      name: "Promotional Video",
      description: "Promote your business or service",
      thumbnail: "https://placehold.co/400x600",
      category: "Marketing",
    },
    {
      id: 6,
      name: "Social Media Post",
      description: "Create engaging social media content",
      thumbnail: "https://placehold.co/400x600",
      category: "Social Media",
    },
  ];

  const categories = [
    "All",
    "Social Media",
    "YouTube",
    "Marketing",
    "Education",
    "Business",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <p className="text-gray-500 mt-1">
          Choose from our collection of professional templates
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="rounded-full"
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              <div className="mt-2">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {template.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 