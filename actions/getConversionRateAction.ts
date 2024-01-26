export async function getConversionRate() {
  const res = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/inr.json"
  );
  let { inr: rawConversionRate } = await res.json();
  const conversionRate: string = rawConversionRate.toFixed(2);

  return conversionRate;
}
