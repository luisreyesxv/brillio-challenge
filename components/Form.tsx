"use client";

import { useState } from "react";
import { FormValues } from "@/types/FormTypes";

type FormErrors = Partial<Record<keyof FormValues, string>> & {
  general?: string;
};

const initialValues: FormValues = {
  city: "",
  minPrice: "",
  maxPrice: "",
  minBedrooms: "",
  keywords: "",
  targetBudget: "",
};

type Props = {
  apiFunction: (values: FormValues) => Promise<void>;
};

export default function Form({ apiFunction }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    // Clear the field's error when the user edits it
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
      general: "",
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    const minPrice = values.minPrice
      ? Number(values.minPrice.replace(/[$,,]/g, ""))
      : null;

    const maxPrice = values.maxPrice
      ? Number(values.maxPrice.replace(/[$,,]/g, ""))
      : null;

    const targetBudget = values.targetBudget
      ? Number(values.targetBudget.replace(/[$,,]/g, ""))
      : null;

    const minBedrooms = values.minBedrooms ? Number(values.minBedrooms) : null;

    const hasSearchValue = Object.values(values).some(
      (value) => value.trim() !== "",
    );

    if (!hasSearchValue) {
      nextErrors.general = "Enter at least one search filter.";
    }

    if (values.city.length > 100) {
      nextErrors.city = "City must be 100 characters or fewer.";
    }

    if (values.minPrice && !Number.isFinite(minPrice)) {
      nextErrors.minPrice = "Enter a valid minimum price.";
    } else if (minPrice !== null && minPrice < 0) {
      nextErrors.minPrice = "Minimum price cannot be negative.";
    }

    if (values.maxPrice && !Number.isFinite(maxPrice)) {
      nextErrors.maxPrice = "Enter a valid maximum price.";
    } else if (maxPrice !== null && maxPrice < 0) {
      nextErrors.maxPrice = "Maximum price cannot be negative.";
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      nextErrors.minPrice =
        "Minimum price cannot be greater than maximum price.";
    }

    if (
      values.minBedrooms &&
      (!Number.isInteger(minBedrooms) ||
        (minBedrooms !== null && minBedrooms < 0))
    ) {
      nextErrors.minBedrooms =
        "Minimum bedrooms must be a whole number of zero or greater.";
    }

    if (values.keywords.length > 100) {
      nextErrors.keywords = "Keywords must be 100 characters or fewer.";
    }

    if (values.targetBudget && !Number.isFinite(targetBudget)) {
      nextErrors.targetBudget = "Enter a valid target budget.";
    } else if (targetBudget !== null && targetBudget <= 0) {
      nextErrors.targetBudget = "Target budget must be greater than zero.";
    }

    return nextErrors;
  }

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    // Add your API request here later.
    apiFunction(values);
  }

  return (
    <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Search listings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Use the filters below to narrow down your results.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <p className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
            {errors.general}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              City
            </label>
            <input
              type="text"
              value={values.city}
              onChange={(event) => updateValue("city", event.target.value)}
              placeholder="Brooklyn"
              maxLength={100}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-300">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Minimum price
            </label>
            <input
              type="text"
              value={values.minPrice}
              onChange={(event) => updateValue("minPrice", event.target.value)}
              placeholder="$250,000"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
            {errors.minPrice && (
              <p className="mt-1 text-sm text-red-300">{errors.minPrice}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Maximum price
            </label>
            <input
              type="text"
              value={values.maxPrice}
              onChange={(event) => updateValue("maxPrice", event.target.value)}
              placeholder="$750,000"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
            {errors.maxPrice && (
              <p className="mt-1 text-sm text-red-300">{errors.maxPrice}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Minimum bedrooms
            </label>
            <select
              value={values.minBedrooms}
              onChange={(event) =>
                updateValue("minBedrooms", event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            {errors.minBedrooms && (
              <p className="mt-1 text-sm text-red-300">{errors.minBedrooms}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Keywords
            </label>
            <input
              type="text"
              value={values.keywords}
              onChange={(event) => updateValue("keywords", event.target.value)}
              placeholder="pool, renovated, garage"
              maxLength={100}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-300">{errors.keywords}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Target budget
            </label>
            <input
              type="text"
              value={values.targetBudget}
              onChange={(event) =>
                updateValue("targetBudget", event.target.value)
              }
              placeholder="$500,000"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
            {errors.targetBudget && (
              <p className="mt-1 text-sm text-red-300">{errors.targetBudget}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
        >
          Search listings
        </button>
      </form>
    </section>
  );
}
