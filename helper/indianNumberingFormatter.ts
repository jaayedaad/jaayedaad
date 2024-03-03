export function formatIndianNumber(number: number) {
  const intNumber = parseInt(number.toString());
  if (number >= 10000000) {
    return (number / 10000000).toFixed(1) + "Cr";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(1) + "L";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "T";
  } else {
    return number.toString();
  }
}

export function formatInternationalNumber(number: number) {
  const intNumber = parseInt(number.toString());
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return number.toString();
  }
}
