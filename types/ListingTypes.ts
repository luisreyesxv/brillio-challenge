export type ListingType = {
  id: string;
  source: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  listedDate: string;
  status: string;
  description: string;
  score?: number;
};

export type ListingSearchResponse = {
  results: ListingType[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
