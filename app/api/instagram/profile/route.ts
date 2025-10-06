import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.replace("@", "").trim();
    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Invalid username" },
        { status: 400 }
      );
    }

    // Call your PythonAnywhere API instead of spawning Python
    const apiUrl = `https://foxbit.pythonanywhere.com/profile?username=${cleanUsername}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch profile", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Instagram profile API error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
