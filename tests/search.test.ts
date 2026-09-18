import { describe, expect, it } from "vitest";
import { listings } from "./fixtures/listings";
import { searchListings, RESULTS_PER_PAGE } from "../lib/ListingsLogic";

describe("searchListings", () => {
  it("returns no listings when no filters are provided", () => {
    const result = searchListings({});

    expect(result.total).toBe(listings.length);
    expect(result.results).toHaveLength(RESULTS_PER_PAGE);
  });

  it("filters by minimum price", () => {
    const result = searchListings({
      minPrice: 300000,
    });

    const result2 = searchListings({
      minPrice: 500000,
    });

    expect(result.results.every((listing) => listing.price >= 300000)).toBe(
      true,
    );
    expect(result.total).toBe(12);

    expect(result2.results.every((listing) => listing.price >= 500000)).toBe(
      true,
    );
    expect(result2.total).toBe(5);
  });

  it("filters by maximum price", () => {
    const result = searchListings({
      maxPrice: 300000,
    });

    const result2 = searchListings({
      maxPrice: 600000,
    });

    const result3 = searchListings({
      maxPrice: 9999999999,
    });

    expect(result.results.every((listing) => listing.price <= 300000)).toBe(
      true,
    );
    expect(result.total).toBe(0);

    expect(result2.results.every((listing) => listing.price <= 600000)).toBe(
      true,
    );
    expect(result2.total).toBe(11);

    expect(
      result3.results.every((listing) => listing.price <= 9999999999),
    ).toBe(true);
    expect(result3.total).toBe(listings.length);
  });

  it("filters by a price range", () => {
    const resultPriceRange = {
      minPrice: 400000,
      maxPrice: 600000,
    };

    const result2PriceRange = {
      minPrice: 2,
      maxPrice: 300000,
    };

    const result = searchListings({
      minPrice: resultPriceRange.minPrice,
      maxPrice: resultPriceRange.maxPrice,
    });

    const result2 = searchListings({
      minPrice: result2PriceRange.minPrice,
      maxPrice: result2PriceRange.maxPrice,
    });

    expect(
      result.results.every(
        (listing) =>
          listing.price <= resultPriceRange.maxPrice &&
          listing.price >= resultPriceRange.minPrice,
      ),
    ).toBe(true);

    expect(result.total).toBe(9);

    expect(
      result2.results.every(
        (listing) =>
          listing.price <= result2PriceRange.maxPrice &&
          listing.price >= result2PriceRange.minPrice,
      ),
    ).toBe(true);

    expect(result2.total).toBe(0);
  });

  it("filters by minimum bedrooms", () => {
    const result = searchListings({
      minBedrooms: 3,
    });

    const result2 = searchListings({
      minBedrooms: 0,
    });

    expect(result.results.every((listing) => listing.bedrooms >= 3)).toBe(true);

    expect(result.total).toBe(8);

    expect(result2.results.every((listing) => listing.bedrooms >= 0)).toBe(
      true,
    );

    expect(result2.total).toBe(listings.length);
  });

  it("filters city case-insensitively", () => {
    const result = searchListings({
      city: "SPrINgfiELd",
    });

    expect(result.results).toHaveLength(4);
    expect(
      result.results.every(
        (listing) => listing.city.toLowerCase() === "springfield",
      ),
    ).toBe(true);
  });

  it("filters city with incomplete name", () => {
    const result = searchListings({
      city: "Sprin",
    });

    expect(result.results).toHaveLength(4);
    expect(
      result.results.every((listing) =>
        listing.city.toLowerCase().includes("sprin"),
      ),
    ).toBe(true);
  });

  it("matches keywords in the description case-insensitively", () => {
    const result = searchListings({
      keywords: "GARAGE",
    });

    expect(
      result.results.every((listing) =>
        listing.description.toLowerCase().includes("garage"),
      ),
    ).toBe(true);

    expect(result.total).toEqual(1);
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
