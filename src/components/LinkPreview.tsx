"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  images?: string[];
  siteName?: string;
  favicon?: string;
  domain?: string;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
}

export default function LinkPreview({ url, className = "" }: LinkPreviewProps) {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setPreview(data);
      } catch (err) {
        console.error("Failed to fetch link preview:", err);
        setError("Failed to load preview");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className={`border border-border rounded-lg p-4 animate-pulse ${className}`}>
        <div className="flex space-x-3">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return null; // Don't show anything if preview fails
  }

  const image = preview.images?.[0];
  const title = preview.title || preview.siteName || preview.domain;
  const description = preview.description;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border border-border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      <div className="flex space-x-3">
        {image && (
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt={title || "Link preview"}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-medium text-text line-clamp-2 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-text opacity-70 line-clamp-2 mb-1">
              {description}
            </p>
          )}
          <p className="text-xs text-yapli-teal">
            {preview.domain || new URL(url).hostname}
          </p>
        </div>
      </div>
    </a>
  );
}