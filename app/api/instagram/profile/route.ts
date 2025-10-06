import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").replace("@","").trim();
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  // SCRAPERAPI_KEY in server environment (do NOT expose in frontend)
  const key = process.env.SCRAPERAPI_KEY;
  if (!key) return NextResponse.json({ error: "server not configured" }, { status: 500 });

  const target = `https://www.instagram.com/${encodeURIComponent(username)}/?__a=1&__d=dis`;
  const apiUrl = `https://api.scraperapi.com/?api_key=${encodeURIComponent(key)}&url=${encodeURIComponent(target)}&render=false`;

  try {
    const res = await fetch(apiUrl, { method: "GET" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "upstream error", details: text }, { status: 502 });
    }
    const text = await res.text();
    // قد تكون JSON أو HTML؛ حاول تحويل
    try {
      const data = JSON.parse(text);
      return NextResponse.json({ success: true, data });
    } catch {
      // ليس JSON — رجّع الخام لفرونت للـ parser هناك أو قم بتحليله هنا
      return NextResponse.json({ success: true, raw: text });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "fetch_failed", details: String(err) }, { status: 500 });
  }
}
