export function calculateHistoricalChanges(data: any[]) {
  let oneDayChanges: number[] = [];
  let oneWeekChanges: number[] = [];
  let oneMonthChanges: number[] = [];
  let oneYearChanges: number[] = [];
  const currentDateTimestampInSeconds: number = Math.floor(Date.now() / 1000);

  data.forEach((asset) => {
    let oneDayChangeFound = false;
    let oneWeekChangeFound = false;
    let oneMonthChangeFound = false;
    let oneYearChangeFound = false;

    for (const price of asset.prices) {
      const priceDateTimestamp = price.date;
      const daysDifference = Math.floor(
        (currentDateTimestampInSeconds - priceDateTimestamp) / (24 * 60 * 60)
      );

      if (price.close && !oneDayChangeFound) {
        oneDayChanges.push(price.close);
        oneDayChangeFound = true; // Set flag to true to avoid adding more than once
      }

      if (price.close && !oneWeekChangeFound) {
        if (daysDifference > 6) {
          oneWeekChanges.push(price.close);
          oneWeekChangeFound = true; // Set flag to true to avoid adding more than once
        }
      }

      if (price.close && !oneMonthChangeFound) {
        if (daysDifference > 29) {
          oneMonthChanges.push(price.close);
          oneMonthChangeFound = true; // Set flag to true to avoid adding more than once
        }
      }

      if (price.close && !oneYearChangeFound) {
        if (daysDifference >= 364) {
          oneYearChanges.push(price.close);
          oneYearChangeFound = true; // Set flag to true to avoid adding more than once
          break; // Move to the next asset
        }
      }

      // If all conditions are already satisfied, exit the loop early
      if (
        oneDayChangeFound &&
        oneWeekChangeFound &&
        oneMonthChangeFound &&
        oneYearChangeFound
      ) {
        break;
      }
    }
  });

  const results = {
    oneDayChanges,
    oneWeekChanges,
    oneMonthChanges,
    oneYearChanges,
  };
  return results;
}
