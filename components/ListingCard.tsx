import { ListingType } from "@/types/ListingTypes";

type Props = {
  listing: ListingType;
};
type colorClassType = {
  pending: string;
  sold: string;
  active: string;
};

export default function ListingCard({ listing }: Props) {
  const colorClass: colorClassType = {
    pending: "orange",
    sold: "red",
    active: "green",
  };

  const statusColor = colorClass[listing.status?.toLowerCase()];
  return (
    <div className="overflow-hidden rounded-xl border-2 border-[#6854ba] bg-[black] text-white shadow-sm">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{listing.address}</h3>
            <p className="mt-1 text-sm text-white">{listing.city}</p>
          </div>

          <span
            className="rounded-full px-2.5 py-1 text-sm font-black capitalize "
            style={{
              backgroundColor: statusColor,
            }}
          >
            {listing.status}
          </span>
        </div>

        <p className="text-2xl font-bold">${listing.price.toLocaleString()}</p>

        <div className="mt-4 flex gap-4 text-sm text-white">
          <span>{listing.bedrooms} beds</span>
          <span>{listing.bathrooms} baths</span>
          <span>{listing.sqft} sqft</span>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4">
          <span className="text-sm text-white ">Listed Date</span>
          <span className="font-semibold text-white ">
            {listing.listedDate}
          </span>
        </div>

        <div className=" flex items-center justify-between border-t pt-4">
          <span className="text-sm text-white">Relevance score</span>
          <span className="font-black text-[#2cc84d]">
            {listing.score?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
