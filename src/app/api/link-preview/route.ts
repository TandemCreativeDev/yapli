import { NextRequest, NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Security check - only prevent localhost/internal network access in production
    const urlObj = new URL(url);
    const isProduction = process.env.NODE_ENV === "production";
    
    if (isProduction) {
      if (
        urlObj.hostname === "localhost" ||
        urlObj.hostname === "127.0.0.1" ||
        urlObj.hostname.startsWith("192.168.") ||
        urlObj.hostname.startsWith("10.") ||
        urlObj.hostname.startsWith("172.")
      ) {
        return NextResponse.json(
          { error: "Access to local/internal networks not allowed" },
          { status: 403 }
        );
      }
    }

    // Get link preview data
    const data = await getLinkPreview(url, {
      followRedirects: "follow",
      timeout: 10000, // 10 second timeout
      resolveDNSHost: isProduction, // Only use DNS resolution in production
    });

    // Extract and structure the relevant data
    const preview = {
      url: data.url,
      title: data.title || "",
      description: data.description || "",
      images: data.images || [],
      siteName: data.siteName || "",
      favicon: data.favicons?.[0] || "",
      domain: urlObj.hostname,
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Link preview error:", error);
    
    // Return a generic error to avoid exposing internal details
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}