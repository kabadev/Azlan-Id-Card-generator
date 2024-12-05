import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ message: "URL is required" }, { status: 400 });
  }

  try {
    // Properly encode the URL
    const encodedUrl = encodeURIComponent(url);

    const response = await fetch(
      `https://azlanbgrembg.onrender.com/api/remove-bg/?url=${encodedUrl}`,
      {
        method: "GET",
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      return NextResponse.json(
        { error: "Error from FastAPI", details: await response.text() },
        { status: response.status }
      );
    }

    // Get the image data from the response
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
