"use client";

import { useState } from "react";
import ListingCard from "@/components/ListingCard";
import { ListingType } from "@/types/ListingTypes";

import Form from "@/components/Form";
import { FormValues } from "@/types/FormTypes";

import { searchListings } from "@/utils/fetch";

type ResultsType = ListingType[];

// i'm assuming the app is for someone trying to buy a house,
// so like active is "good" because they want the listing and sold means they can't get it
export default function Home() {
  const [results, setResults] = useState<ResultsType>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastSearchValues, setLastSearchValues] = useState<FormValues | null>(
    null,
  );
  const [searchMessage, setSearchMessage] = useState("");

  async function fetchSearchResults(values: FormValues, page = 1) {
    setResults([]);
    setCurrentPage(0);
    setTotalPages(0);

    if (page === 1) {
      setLastSearchValues(values);
    }

    setLoading(true);
    setSearchMessage("");

    try {
      const response = await searchListings(values, page);
      if (response.results.length) {
        setResults(response.results);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
      } else {
        setSearchMessage("No listings found matching your search.");
      }
    } catch (e) {
      if (e instanceof Error) {
        setSearchMessage(e.message);
      } else {
        setSearchMessage(
          "there was a problem with the connection. Please try again later",
        );
      }
    }

    setLoading(false);
  }

  async function handleNextButton() {
    if (lastSearchValues === null) {
      setSearchMessage("Please search using the form above");
      return;
    }
    const newPage = Number(currentPage) + 1;

    if (currentPage + 1 <= totalPages) {
      fetchSearchResults(lastSearchValues, newPage);
      setCurrentPage(newPage);
    } else {
      setSearchMessage("page doesn't exist");
    }
  }

  async function handlePreviousButton() {
    const newPage = Number(currentPage) - 1;
    if (lastSearchValues === null) {
      setSearchMessage("Please search using the form above");
      return;
    }

    if (currentPage - 1 > 0) {
      fetchSearchResults(lastSearchValues, newPage);
    } else {
      setSearchMessage("page doesn't exist");
    }
  }

  return (
    <main className="min-h-screen bg-[#141414] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* The Form */}
        <Form apiFunction={fetchSearchResults} />

        {/* where we show the results */}

        <section className="mt-12">
          <div className="grid gap-5 lg:grid-cols-3">
            {!loading &&
              results.map((listing, index) => (
                <ListingCard
                  key={`${listing.address}-${listing.id}`}
                  listing={listing}
                />
              ))}

            {loading && <p> loading results</p>}
            {!loading && searchMessage}
          </div>
        </section>

        {/* pagination */}
        <section className="mt-5">
          {!!totalPages && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePreviousButton}
                disabled={loading || currentPage <= 1}
                className="rounded bg-[#7f5bff] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-[#2cc84d]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextButton}
                disabled={loading || currentPage >= totalPages}
                className="rounded bg-[#7f5bff] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
