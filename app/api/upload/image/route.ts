import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth || !auth.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WEBP images are allowed" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "images");
    await writeFile(join(uploadsDir, file.name), Buffer.from(await file.arrayBuffer()));

    // Return the URL path to the uploaded file
    const imageUrl = `/uploads/images/${file.name}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 