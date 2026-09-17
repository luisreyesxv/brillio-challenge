"use client";

import { useState } from "react";
import listings from "@/json/listings.json";

import ListingCard from "@/components/ListingCard";
import { ListingType } from "@/types/ListingType";

import Form from "@/components/Form";

type ResultsType = ListingType[];

// i'm assuming the app is for someone trying to buy a house,
// so like active is "good" because they want the listing and sold means they can't get it
export default function Home() {
  const [results, setResults] = useState<ResultsType>([]);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* The Form */}
        <Form />

        {/* where we show the results */}

        <section className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {results.map((listing, index) => (
              <ListingCard
                key={`${listing.address}-${listing.id}`}
                listing={listing}
              />
            ))}

            {results.length < 1 && "Sorry no result yet"}
          </div>
        </section>
      </section>
    </main>
  );
}
