export function formatIndianNumber(number: number) {
  if (number >= 10000000) {
    return number / 10000000 + "Cr";
  } else if (number >= 100000) {
    return number / 100000 + "L";
  } else if (number >= 1000) {
    return number / 1000 + "k";
  } else {
    return number.toString();
  }
}
