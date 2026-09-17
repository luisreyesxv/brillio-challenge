import { describe, expect, it } from "vitest";
import { listings } from "./fixtures/listings";
import { searchListings } from "../lib/ListingsLogic";

describe("searchListings pagination", () => {
  it("returns the first page", () => {
    const result = searchListings({
      page: 1,
    });

    expect(result.results).toHaveLength(2);
    expect(result.pagination.page).toBe(1);
    expect(result.totalPages).toBe(2);
  });

  it("returns the second page", () => {
    const result = searchListings({
      page: 2,
    });

    expect(result.results).toHaveLength(2);
    expect(result.pagination.page).toBe(2);
  });

  it("returns a partial final page", () => {
    const result = searchListings({
      page: 2,
    });

    expect(result.results).toHaveLength(1);
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
    const result = searchListings({});

    expect(result.pagination.page).toBe(1);
  });
});
