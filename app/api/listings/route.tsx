import { NextRequest, NextResponse } from "next/server";
import { searchListings } from "@/lib/ListingsLogic";

import { validateSearchParams } from "@/utils/validateParams";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const validation = validateSearchParams(searchParams);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error,
      },
      { status: 400 },
    );
  }

  try {
    const answer = searchListings(validation.params);

    return new NextResponse(JSON.stringify(answer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to search listings",
      },
      { status: 400 },
    );
  }
}
