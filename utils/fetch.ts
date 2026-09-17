import { ListingSearchResponse } from "@/types/ListingTypes";
import { FormValues } from "@/types/FormTypes";

export async function searchListings(
  values: FormValues,
  page: number,
): Promise<ListingSearchResponse> {
  const params = new URLSearchParams();

  //   i don't want to add empty params to the search if they aren't needed/provided
  function addParam(key: string, value: string | number | undefined) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  //   i want to be explicit on what we are passing, so we notice if don't accidentally push soemthing without someone knowing
  addParam("minPrice", values.minPrice);
  addParam("maxPrice", values.maxPrice);
  addParam("minBedrooms", values.minBedrooms);
  addParam("city", values.city);
  addParam("keywords", values.keywords);
  addParam("targetBudget", values.targetBudget);
  addParam("page", page ?? 1);

  const response = await fetch(`/api/listings?${params.toString()}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to search listings");
  }

  return data;
}
