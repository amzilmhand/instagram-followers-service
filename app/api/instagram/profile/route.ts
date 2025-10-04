import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_TIMEOUT_MS = 15000; // 15s timeout per endpoint

/** Read endpoints from env. Can be a single URL or comma-separated list. */
function getEndpoints(): string[] {
  const raw = process.env.INSTALOADER_API_URL || "";
  // allow fallback to a default (optional)
  const fallback = "https://instaloader-api-production.up.railway.app";
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [fallback];
}

async function fetchWithTimeout(url: string, timeout = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.replace("@", "").trim();
    if (!cleanUsername) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const endpoints = getEndpoints();
    const errors: Array<{ endpoint: string; status?: number; text?: string; error?: string }> = [];

    for (const base of endpoints) {
      // ensure no double slashes and proper query param
      const trimmed = base.replace(/\/+$/, ""); // remove trailing slashes
      const apiUrl = `${trimmed}/profile?username=${encodeURIComponent(cleanUsername)}`;

      try {
        const res = await fetchWithTimeout(apiUrl);

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          errors.push({ endpoint: apiUrl, status: res.status, text });
          // try next endpoint
          continue;
        }

        // success
        const data = await res.json().catch(() => null);
        if (!data) {
          errors.push({ endpoint: apiUrl, error: "Invalid JSON in response" });
          continue;
        }

        return NextResponse.json(data, { status: 200 });
      } catch (err: any) {
        // distinguish between timeout and other network errors
        const message = err?.name === "AbortError" ? "timeout" : (err?.message || String(err));
        errors.push({ endpoint: apiUrl, error: message });
        continue; // try next endpoint in the list
      }
    }

    // if we reach here, all endpoints failed
    return NextResponse.json(
      { error: "All profile endpoints failed", attempts: errors },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("Instagram profile API error:", err);
    return NextResponse.json({ error: "Internal server error", details: err?.message }, { status: 500 });
  }
}
