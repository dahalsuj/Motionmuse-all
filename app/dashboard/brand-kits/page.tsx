'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, CloudUpload, Presentation, Zap, Type, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface BrandKit {
  id: string;
  colors: string[];
  fonts: string[];
  images: string[];
  audio: string[];
}

export default function BrandKitsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    fetchBrandKit();
  }, [user, router]);

  const fetchBrandKit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brand-kit");
      if (!res.ok) {
        const errorText = `Failed to fetch brand kit: ${res.status} ${res.statusText}`;
        console.error(errorText);
        toast.error(errorText);
        throw new Error(errorText);
      }
      const data = await res.json();
      setBrandKit(data.brandKit);
    } catch (error) {
      console.error("Error fetching brand kit:", error);
      toast.error("Failed to load brand kit");
    } finally {
      setLoading(false);
    }
  };

  const handleColorAdd = async (color: string) => {
    try {
      const updatedColors = [...(brandKit?.colors || []), color];
      await updateBrandKit({ colors: updatedColors });
      toast.success("Color added successfully");
    } catch (error) {
      toast.error("Failed to add color");
    }
  };

  const handleFontUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("font", file);

      const res = await fetch("/api/upload/font", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload font");
      const data = await res.json();

      const updatedFonts = [...(brandKit?.fonts || []), data.fontUrl];
      await updateBrandKit({ fonts: updatedFonts });
      toast.success("Font uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload font");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();

      const updatedImages = [...(brandKit?.images || []), data.imageUrl];
      await updateBrandKit({ images: updatedImages });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload audio");
      const data = await res.json();

      const updatedAudio = [...(brandKit?.audio || []), data.audioUrl];
      await updateBrandKit({ audio: updatedAudio });
      toast.success("Audio uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload audio");
    } finally {
      setUploading(false);
    }
  };

  const updateBrandKit = async (updates: Partial<BrandKit>) => {
    try {
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update brand kit");
      const data = await res.json();
      setBrandKit(data.brandKit);
    } catch (error) {
      console.error("Error updating brand kit:", error);
      throw error;
    }
  };

  const removeAsset = async (type: keyof BrandKit, index: number) => {
    try {
      const currentAssets = brandKit?.[type] || [];
      const updatedAssets = (currentAssets as string[]).filter((_: string, i: number) => i !== index);
      await updateBrandKit({ [type]: updatedAssets });
      toast.success("Asset removed successfully");
    } catch (error) {
      toast.error("Failed to remove asset");
    }
  };

  if (loading) {
    return <div className="p-8">Loading Brand Kit...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-white via-orange-50 to-muse-orange/10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Brand Kits</h1>
      <p className="text-gray-700 mb-12">
        Create a unified look for your video content. Set your Brand's fonts, color
        schemes and logos, and apply them to all your videos.{" "}
        <Link href="#" className="text-blue-600 hover:underline">
          Learn more
        </Link>
      </p>

      {/* Colors Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Colors</h2>
      <p className="text-gray-700 mb-6">
        Add your brand colors or any colors you would like to re-use.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandKit?.colors.map((color, index) => (
          <Card key={index} className="relative p-4 rounded-xl shadow-md border-0 bg-white">
            <button
              onClick={() => removeAsset("colors", index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <div
              className="w-full h-24 rounded-lg mb-2"
              style={{ backgroundColor: color }}
            />
            <p className="text-sm text-gray-600">{color}</p>
          </Card>
        ))}
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="w-12 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <Plus className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Add Color</p>
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleColorAdd(e.target.value)}
          />
        </Card>
      </div>

      {/* Fonts Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Fonts</h2>
      <p className="text-gray-700 mb-6">
        Upload your brand fonts or choose from our collection of professional typefaces.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandKit?.fonts.map((font, index) => (
          <Card key={index} className="relative p-4 rounded-xl shadow-md border-0 bg-white">
            <button
              onClick={() => removeAsset("fonts", index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{font.split("/").pop()}</p>
              <p className="text-sm text-gray-500">Custom Font</p>
            </div>
          </Card>
        ))}
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Type className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Upload Custom Font</p>
            <p className="text-sm text-gray-500 mt-1">TTF, OTF, WOFF formats</p>
            <input
              type="file"
              accept=".ttf,.otf,.woff"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleFontUpload(e.target.files[0])}
              disabled={uploading}
            />
          </div>
        </Card>
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Presentation className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Browse Font Library</p>
            <p className="text-sm text-gray-500 mt-1">Professional typefaces</p>
          </div>
        </Card>
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <CloudUpload className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Google Fonts</p>
            <p className="text-sm text-gray-500 mt-1">Import from Google Fonts</p>
          </div>
        </Card>
      </div>

      {/* Images Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Images</h2>
      <p className="text-gray-700 mb-6">
        Add brand images and custom watermarks and use them across your projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandKit?.images.map((image, index) => (
          <Card key={index} className="relative p-4 rounded-xl shadow-md border-0 bg-white">
            <button
              onClick={() => removeAsset("images", index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-48">
              <Image
                src={image}
                alt={`Brand image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </Card>
        ))}
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Drop JPG, PNG, WEBP</p>
            <p className="text-sm text-gray-500 mt-1">or browse from your computer</p>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              disabled={uploading}
            />
          </div>
        </Card>
      </div>

      {/* Audio Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-12">Audio</h2>
      <p className="text-gray-700 mb-6">
        Add brand music, sound effects, or voiceovers to use across your projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandKit?.audio.map((audio, index) => (
          <Card key={index} className="relative p-4 rounded-xl shadow-md border-0 bg-white">
            <button
              onClick={() => removeAsset("audio", index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{audio.split("/").pop()}</p>
              <p className="text-sm text-gray-500">Audio File</p>
            </div>
          </Card>
        ))}
        <Card className="relative flex flex-col items-center justify-center p-8 rounded-xl shadow-md border-0 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Drop MP3, WAV</p>
            <p className="text-sm text-gray-500 mt-1">or browse from your computer</p>
            <input
              type="file"
              accept="audio/*"
              className="absolute inset-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
              disabled={uploading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}