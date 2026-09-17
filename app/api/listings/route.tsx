import { NextRequest } from "next/server";
import { searchListings } from "@/lib/ListingsLogic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());

  const answer = searchListings(params);

  return new Response(JSON.stringify(answer), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
