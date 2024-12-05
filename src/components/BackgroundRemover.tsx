"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BackgroundRemover() {
  const [imageUrl, setImageUrl] = useState("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const removeBackground = async () => {
    if (!imageUrl) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setProcessedImage(URL.createObjectURL(blob));
      } else {
        console.error("Failed to remove background");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Input
        type="url"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="max-w-md w-full"
      />
      <Button onClick={removeBackground} disabled={isLoading || !imageUrl}>
        {isLoading ? "Processing..." : "Remove Background"}
      </Button>
      {imageUrl && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-semibold">Original Image:</h2>
          <img src={imageUrl} alt="Original" className="max-w-sm" />
        </div>
      )}
      {processedImage && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-semibold">Processed Image:</h2>
          <img src={processedImage} alt="Processed" className="max-w-sm" />
        </div>
      )}
    </div>
  );
}
