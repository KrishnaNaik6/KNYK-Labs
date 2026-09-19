/**
 * Formats a currency value gracefully.
 */
export function formatCurrency(amount?: number | null, currency = "INR"): string {
  if (amount == null || typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    return "Custom Quote";
  }

  try {
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);

    return `Starting from ${formatted}`;
  } catch {
    const symbol = currency.toUpperCase() === "INR" ? "₹" : "$";
    return `Starting from ${symbol}${amount.toLocaleString("en-US")}`;
  }
}

/**
 * Formats estimated delivery time nicely.
 */
export function formatDelivery(delivery?: string | null): string {
  if (!delivery || delivery.trim() === "") {
    return "Timeline on consultation";
  }
  return delivery;
}

/**
 * Formats advance percentage.
 */
export function formatAdvance(percentage?: number | null): string {
  if (!percentage || percentage <= 0) {
    return "Milestone based";
  }
  return `${percentage}% Advance`;
}
