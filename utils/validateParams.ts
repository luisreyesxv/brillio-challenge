type ListingSearchParams = {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  city?: string;
  keywords?: string;
  targetBudget?: number;
  page: number;
};

type ValidationResult =
  | {
      success: true;
      params: ListingSearchParams;
    }
  | {
      success: false;
      error: string;
    };

function parseOptionalNumber(
  params: URLSearchParams,
  name: string,
): number | undefined {
  const value = params.get(name);

  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}

function parseOptionalInteger(
  params: URLSearchParams,
  name: string,
): number | undefined {
  const value = parseOptionalNumber(params, name);

  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be an integer`);
  }

  return value;
}

export function validateSearchParams(
  searchParams: URLSearchParams,
): ValidationResult {
  try {
    const minPrice = parseOptionalNumber(searchParams, "minPrice");
    const maxPrice = parseOptionalNumber(searchParams, "maxPrice");
    const minBedrooms = parseOptionalInteger(searchParams, "minBedrooms");
    const targetBudget = parseOptionalNumber(searchParams, "targetBudget");

    const page = parseOptionalInteger(searchParams, "page") ?? 1;

    const city = searchParams.get("city")?.trim() || undefined;
    const keywords = searchParams.get("keywords")?.trim() || undefined;

    if (city !== undefined && city.length > 100) {
      return {
        success: false,
        error: "City must be 100 characters or fewer.",
      };
    }

    if (keywords !== undefined && keywords.length > 100) {
      return {
        success: false,
        error: "Keywords must be 100 characters or fewer.",
      };
    }

    // Price validation
    if (minPrice !== undefined && minPrice < 0) {
      return {
        success: false,
        error: "minPrice must be greater than or equal to 0",
      };
    }

    if (maxPrice !== undefined && maxPrice < 0) {
      return {
        success: false,
        error: "maxPrice must be greater than or equal to 0",
      };
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return {
        success: false,
        error: "minPrice cannot be greater than maxPrice",
      };
    }

    // Bedrooms
    if (minBedrooms !== undefined && minBedrooms < 0) {
      return {
        success: false,
        error: "minBedrooms must be greater than or equal to 0",
      };
    }

    // Target budget
    if (targetBudget !== undefined && targetBudget <= 0) {
      return {
        success: false,
        error: "targetBudget must be greater than 0",
      };
    }

    // Pagination
    if (page < 1) {
      return {
        success: false,
        error: "page must be greater than or equal to 1",
      };
    }

    return {
      success: true,
      params: {
        minPrice,
        maxPrice,
        minBedrooms,
        city,
        keywords,
        targetBudget,
        page,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Invalid search parameters",
    };
  }
}
