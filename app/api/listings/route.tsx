import listings from "@/json/listings.json";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());

  const answer = {
    results: listings,
    pagination: { page: 1, totalPages: listings.length / 6 },
    searchParams: params,
  };
  return new Response(JSON.stringify(answer), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
