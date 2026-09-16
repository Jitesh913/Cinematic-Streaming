import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_TOKEN ?? "";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const search = req.nextUrl.searchParams.toString();
  const url = `${BASE_URL}/${path.join("/")}${search ? `?${search}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `TMDB ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}