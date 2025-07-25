"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Film, Upload, Wand2, Download } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

/*
Example API Usage:
fetch("https://<your-ngrok-url>.ngrok-free.app/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    prompt: "A robot walking through a futuristic city at night"
  })
})
  .then(response => response.json())
  .then(data => {
    console.log("Video URL:", data.video_url);
    
    // Create a video element
    const video = document.createElement("video");
    video.src = data.video_url;
    video.controls = true;
    video.width = 576;
    document.body.appendChild(video);
  })
  .catch(error => console.error("Error:", error));
*/

export default function VideoGenerator() {
  const { user } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [localVideoUrl, setLocalVideoUrl] = useState("")
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [contentType, setContentType] = useState("text-to-video")
  const [formData, setFormData] = useState({
    prompt: "",
    style: "realistic",
    aspectRatio: "16:9",
  })
  const [selectedTab, setSelectedTab] = useState("text-to-video")
  const [videoError, setVideoError] = useState(false)

  // Function to download video and create local URL
  const downloadAndShowVideo = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') ?? 0);
      
      let chunks = [];
      let receivedLength = 0;
      
      while(true && reader) {
        const {done, value} = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Calculate and set progress
        const progress = (receivedLength / contentLength) * 100;
        setDownloadProgress(Math.round(progress));
      }
      
      // Combine chunks into a single Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      
      // Create blob and local URL
      const blob = new Blob([chunksAll], { type: 'video/mp4' });
      const localUrl = URL.createObjectURL(blob);
      setLocalVideoUrl(localUrl);
      setDownloadProgress(100);
      
    } catch (error) {
      console.error('Error downloading video:', error);
      alert('Failed to download video. Please try the direct link.');
    }
  };

  // Clean up blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
    };
  }, [localVideoUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setVideoUrl("");
    setLocalVideoUrl("");
    setDownloadProgress(0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://017b-34-143-249-81.ngrok-free.app";
      
      console.log("Sending request to:", `${backendUrl}/generate`);
      const res = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: formData.prompt
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        alert(errorData.error || "Failed to generate video");
        setGenerating(false);
        return;
      }

      const result = await res.json();
      console.log("Backend response:", result);
      
      const videoUrl = result?.video_url;
      if (videoUrl) {
        setVideoUrl(videoUrl);
        // Start downloading the video
        await downloadAndShowVideo(videoUrl);
      } else {
        console.error("No video URL in response. Full response:", result);
        alert("No video URL returned from backend.");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        alert("Request timed out after 5 minutes. Please try again.");
      } else {
        console.error("Error:", err);
        alert("Video generation failed.");
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-navy">AI Video Generator</h1>
            <p className="text-xl text-muted-foreground">
              Create professional videos in minutes with our AI-powered tool
            </p>
            {user?.plan && (
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-logo-blue text-white">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                </span>
              </div>
            )}
          </div>
  
          <Tabs
            value={selectedTab}
            onValueChange={(val) => {
              setSelectedTab(val);
              setVideoUrl("");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger
                value="text-to-video"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-muse-red data-[state=active]:to-muse-orange data-[state=active]:text-white"
              >
                Text to Video
              </TabsTrigger>
              <TabsTrigger
                value="image-to-video"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-logo-blue data-[state=active]:to-logo-green data-[state=active]:text-white"
              >
                Image to Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text-to-video">
              <Card className="border-muse-red/20">
                <CardHeader>
                  <CardTitle className="text-navy">Text to Video</CardTitle>
                  <CardDescription>Describe your video and our AI will generate it for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Video Description</Label>
                      <Textarea
                        id="prompt"
                        name="prompt"
                        placeholder="Describe your video in detail. E.g., A drone shot of a coastal city at sunset with people walking on the beach."
                        value={formData.prompt}
                        onChange={handleChange}
                        className="min-h-[120px] border-navy/20 focus-visible:ring-logo-blue"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="style">Video Style</Label>
                        <Select value={formData.style} onValueChange={(value) => handleSelectChange("style", value)}>
                          <SelectTrigger id="style" className="border-navy/20 focus:ring-logo-blue">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="cinematic">Cinematic</SelectItem>
                            <SelectItem value="animated">Animated</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="futuristic">Futuristic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                        <Select
                          value={formData.aspectRatio}
                          onValueChange={(value) => handleSelectChange("aspectRatio", value)}
                        >
                          <SelectTrigger id="aspectRatio" className="border-navy/20 focus:ring-logo-blue">
                            <SelectValue placeholder="Select aspect ratio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                            <SelectItem value="1:1">1:1 (Square)</SelectItem>
                            <SelectItem value="4:5">4:5 (Instagram)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Film className="mr-2 h-4 w-4" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="image-to-video">
              <Card className="border-logo-blue/20">
                <CardHeader>
                  <CardTitle className="text-navy">Image to Video</CardTitle>
                  <CardDescription>Upload an image and our AI will transform it into a video</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="image">Upload Image</Label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted border-navy/20"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 10MB)</p>
                            </div>
                            <Input id="image-upload" type="file" accept="image/*" className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prompt">Additional Instructions (Optional)</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Add any specific instructions for how you want the image to be animated"
                        className="min-h-[80px] border-navy/20 focus-visible:ring-logo-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="style">Animation Style</Label>
                        <Select defaultValue="zoom">
                          <SelectTrigger id="style" className="border-navy/20 focus:ring-logo-blue">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zoom">Zoom</SelectItem>
                            <SelectItem value="pan">Pan</SelectItem>
                            <SelectItem value="3d">3D Effect</SelectItem>
                            <SelectItem value="parallax">Parallax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white"
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Generate Video
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {videoUrl && (
            <Card className="border-rainbow-gradient bg-gradient-to-r from-transparent via-white to-transparent p-[1px]">
              <CardHeader className="bg-background rounded-t-lg">
                <CardTitle className="text-navy">Generated Video</CardTitle>
                <CardDescription>
                  {downloadProgress < 100 
                    ? `Downloading video... ${downloadProgress}%`
                    : 'Your AI-generated video is ready to view'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-background rounded-b-lg">
                <div className="aspect-video overflow-hidden rounded-lg bg-muted relative">
                  {downloadProgress < 100 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-muse-red to-muse-orange rounded-full transition-all duration-300"
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : localVideoUrl ? (
                    <video
                      key={localVideoUrl}
                      src={localVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Video playback error:", e);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Loading video...</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className="bg-gradient-to-r from-muse-red to-muse-orange hover:from-muse-red/90 hover:to-muse-orange/90 text-white"
                    onClick={() => window.open(videoUrl, '_blank')}
                  >
                    <Film className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-navy text-navy hover:bg-navy/10"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = videoUrl;
                      link.setAttribute('download', 'generated-video.mp4');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
