/**
 * Pad the start of a numerical value with zeros.
 *
 * @param value The value to pad with zeros.
 * @param length The desired number of digits.
 * @returns The padded number as a string.
 */
export function padNumberStart(value: number, length: number): string {
  const [integerPart, decimalPart] = String(value).split(".");
  let paddedIntegerPart = integerPart;
  if (paddedIntegerPart.length < length) {
    for (let i = paddedIntegerPart.length; i < length; i++) {
      paddedIntegerPart = `0${paddedIntegerPart}`;
    }
  }
  if (decimalPart) return `${paddedIntegerPart}.${decimalPart}`;
  return paddedIntegerPart;
}
