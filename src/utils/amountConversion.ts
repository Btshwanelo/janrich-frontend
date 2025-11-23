export function amountConversion(
  num: number,
  currency: string = "R"
): string {
  const formatted = num.toFixed(2);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formatted.split(".");
  
  // Add space separators for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  // Combine with currency prefix
  return `${currency} ${formattedInteger}.${decimalPart}`;
}
