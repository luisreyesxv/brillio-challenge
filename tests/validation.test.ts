import { describe, expect, it } from "vitest";
import { searchListings, RESULTS_PER_PAGE } from "../lib/ListingsLogic";

describe("searchListings pagination", () => {
  it("returns the first page", () => {
    const result = searchListings({
      state: "VA",
      page: 1,
    });

    expect(result.results).toHaveLength(RESULTS_PER_PAGE);
    expect(result.pagination.page).toBe(1);
    expect(result.totalPages).toBe(2);
  });

  it("returns the second page", () => {
    const result = searchListings({
      state: "VA",
      page: 2,
    });

    expect(result.results).toHaveLength(RESULTS_PER_PAGE);
    expect(result.pagination.page).toBe(2);
  });

  it("returns a partial final page", () => {
    const result = searchListings({
      page: 2,
      maxPrice: 600000,
    });

    expect(result.results).toHaveLength(5);
    expect(result.totalPages).toBe(2);
  });

  it("returns no items beyond the final page", () => {
    const result = searchListings({
      page: 3,
    });

    expect(result.results).toEqual([]);
    expect(result.total).toBe(12);
    expect(result.totalPages).toBe(2);
  });

  it("uses sensible defaults when pagination is omitted", () => {
    const result = searchListings({ city: "springfield" });

    expect(result.pagination.page).toBe(1);
  });
});
