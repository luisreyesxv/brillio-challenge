"use client";

import { useState } from "react";
import listings from "@/json/listings.json";

import ListingCard from "@/components/ListingCard";
import { ListingType } from "@/types/ListingType";

type ResultsType = ListingType[];

// i'm assuming the app is for someone trying to buy a house,
// so like active is "good" because they want the listing and sold means they can't get it
export default function Home() {
  const [results, setResults] = useState<ResultsType>([]);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Search listings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Use the filters below to narrow down your results.
            </p>
          </div>

          {/* The Form */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                City
              </label>
              <input
                type="text"
                placeholder="Austin"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Minimum price
              </label>
              <input
                type="text"
                placeholder="$250,000"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Maximum price
              </label>
              <input
                type="text"
                placeholder="$750,000"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Minimum bedrooms
              </label>
              <select className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none">
                <option>Any</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Keywords
              </label>
              <input
                type="text"
                placeholder="pool, renovated, garage"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Target budget
              </label>
              <input
                type="text"
                placeholder="$500,000"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-6 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Search listings
          </button>
        </section>

        {/* where we show the results */}

        <section className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {results.map((listing, index) => (
              <ListingCard
                key={`listing card for ${listing.address} ${index}`}
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
