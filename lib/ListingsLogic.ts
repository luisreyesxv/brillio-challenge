import listingsJson from "@/json/listings.json";
import { ListingType } from "@/types/ListingTypes";

const RESULTS_PER_PAGE = 6;

export type SearchFilters = {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  city?: string;
  keywords?: string;
  targetBudget?: number;
  page?: number;
};

export function searchListings(filters: SearchFilters) {
  const {
    minPrice,
    maxPrice,
    minBedrooms,
    city,
    keywords,
    targetBudget,
    page = 1,
  } = filters;

  const listings: ListingType[] = listingsJson;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new Error("minPrice cannot be greater than maxPrice");
  }

  if (page < 1) {
    throw new Error("page must be greater than zero");
  }

  const filteredListings = listings.filter((listing) => {
    if (minPrice !== undefined && listing.price < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && listing.price > maxPrice) {
      return false;
    }

    if (minBedrooms !== undefined && listing.bedrooms < minBedrooms) {
      return false;
    }

    if (city && !listing.city.toLowerCase().includes(city.toLowerCase())) {
      return false;
    }

    if (
      keywords &&
      !listing.description.toLowerCase().includes(keywords.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const scoredListings = filteredListings
    .map((listing) => {
      let score = 0;
      if (targetBudget !== undefined) {
        const difference = targetBudget - listing.price;

        let budgetScore;

        if (difference >= 0) {
          budgetScore = Math.min(60, 60 * (1 - difference / targetBudget));
        } else {
          // Over budget: gentle penalty, capped at -20.
          budgetScore = Math.max(
            -20,
            -20 * (Math.abs(difference) / targetBudget),
          );
        }
        score += budgetScore;
      }

      // More recent listings receive a higher score.
      const listedTime = new Date(listing.listedDate).getTime();

      const ageInDays = (Date.now() - listedTime) / (1000 * 60 * 60 * 24);

      score += Math.max(0, 25 * (1 - ageInDays / 365));

      // Active listings are more useful to buyers.
      if (listing.status === "active") {
        score += 15;
      } else if (listing.status === "pending") {
        score += 7;
      }

      return {
        ...listing,
        score: Math.round(score * 100) / 100,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Deterministic ordering for tied scores.
      return `${a.source}-${a.id}`.localeCompare(`${b.source}-${b.id}`);
    });

  const total = scoredListings.length;
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

  const startIndex = (page - 1) * RESULTS_PER_PAGE;

  return {
    results: scoredListings.slice(startIndex, startIndex + RESULTS_PER_PAGE),
    pagination: {
      page,
      totalPages,
    },
  };
}
