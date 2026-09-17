import { ListingType } from "@/types/ListingType";

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
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{listing.address}</h3>
            <p className="mt-1 text-sm text-slate-500">{listing.city}</p>
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

        <p className="text-2xl font-bold">${listing.price}</p>

        <div className="mt-4 flex gap-4 text-sm text-slate-600">
          <span>{listing.bedrooms} beds</span>
          <span>{listing.bathrooms} baths</span>
          <span>{listing.sqft} sqft</span>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4">
          <span className="text-sm text-slate-500">Listed Date</span>
          <span className="font-semibold text-slate-500">
            {listing.listedDate}
          </span>
        </div>

        <div className=" flex items-center justify-between border-t pt-4">
          <span className="text-sm text-slate-500">Relevance score</span>
          <span className="font-semibold text-blue-600">
            {listing.score?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
