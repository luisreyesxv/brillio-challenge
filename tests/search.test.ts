import { describe, expect, it } from "vitest";
import { listings } from "./fixtures/listings";
import { searchListings } from "../lib/ListingsLogic";

describe("searchListings", () => {
  it("returns all listings when no filters are provided", () => {
    const result = searchListings({});

    expect(result.total).toBe(listings.length);
    expect(result.results).toHaveLength(listings.length);
  });

  it("filters by minimum price", () => {
    const result = searchListings({
      minPrice: 300000,
    });

    expect(result.results.every((listing) => listing.price >= 300000)).toBe(
      true,
    );
    expect(result.total).toBe(3);
  });

  it("filters by maximum price", () => {
    const result = searchListings({
      maxPrice: 300000,
    });

    expect(result.results.every((listing) => listing.price <= 300000)).toBe(
      true,
    );
    expect(result.total).toBe(3);
  });

  it("filters by a price range", () => {
    const result = searchListings({
      minPrice: 275000,
      maxPrice: 350000,
    });

    expect(result.results.map((listing) => listing.id)).toEqual(["1", "4"]);
  });

  it("filters by minimum bedrooms", () => {
    const result = searchListings({
      minBedrooms: 3,
    });

    expect(result.results.map((listing) => listing.id)).toEqual(["2", "3"]);
  });

  it("filters city case-insensitively", () => {
    const result = searchListings({
      city: "aUsTiN",
    });

    expect(result.results).toHaveLength(3);
    expect(
      result.results.every(
        (listing) => listing.city.toLowerCase() === "austin",
      ),
    ).toBe(true);
  });

  it("matches keywords in the description case-insensitively", () => {
    const result = searchListings({
      keywords: "GARAGE",
    });

    expect(result.results.map((listing) => listing.id)).toEqual(["1"]);
  });

  it("trims keywords whitespace", () => {
    const result = searchListings({
      keywords: "  family  ",
    });

    expect(result.results.map((listing) => listing.id)).toEqual(["2"]);
  });

  it("returns an empty result when there are no matches", () => {
    const result = searchListings({
      city: "Houston",
    });

    expect(result.results).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("rejects a minimum price greater than the maximum price", () => {
    expect(() =>
      searchListings({
        minPrice: 500000,
        maxPrice: 100000,
      }),
    ).toThrow(/minPrice/i);
  });

  it("rejects negative page numbers", () => {
    expect(() =>
      searchListings({
        page: 0,
      }),
    ).toThrow(/page/i);
  });
});
