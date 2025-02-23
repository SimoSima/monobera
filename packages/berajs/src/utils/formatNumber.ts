export function formatNumber(num: number, decimals = 8) {
  // Convert to string with up to 8 decimal places
  let formatted = num.toFixed(decimals);
  // Remove trailing zeros and decimal point if not needed
  formatted = formatted.replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1");
  return formatted;
}

export const getSafeNumber = (value: string | undefined): number => {
  if (!value) return 0;
  return Number(value) > Number.MAX_SAFE_INTEGER
    ? Number.MAX_SAFE_INTEGER
    : Number(value) ?? 0;
};

export const truncateDecimal = (
  value: string | number | undefined,
  maxDecimal: number,
): number => {
  if (!value) return 0;
  const [integerPart = "0", decimalPart = "0"] = `${value}`.split(".");
  return Number(`${integerPart}.${decimalPart.substring(0, maxDecimal)}`);
};
