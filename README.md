# Implementation Notes

## Approach

I separated the application into three main concerns:

1. Listing search and ranking logic
2. API request validation and response handling
3. React UI state and user interaction

The search logic is independent from the UI, which allows it to be tested without rendering React components. This also makes the code easier to extend if new requirements are introduced.

## Filtering

Filters are applied before ranking:

- `minPrice` includes listings with a price greater than or equal to the minimum.
- `maxPrice` includes listings with a price less than or equal to the maximum.
- `minBedrooms` includes listings with at least the requested number of bedrooms.
- `city` is matched case-insensitively.
- `keyword` is matched case-insensitively against the listing description.

Filters use `AND` behavior. When multiple filters are provided, a listing must satisfy all of them.

Text inputs are trimmed before searching so that accidental whitespace does not affect the results.

## Relevance Scoring

The relevance score is based on target-budget proximity and listing recency.

The budget score is calculated from the percentage difference between the listing price and the target budget:

```text
budgetScore = max(0, 1 - abs(price - targetBudget) / targetBudget)
```
