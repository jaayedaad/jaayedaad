function fillMissingDates(data: { [date: string]: number }): {
  [date: string]: number;
} {
  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const filledData: { [date: string]: number } = {};

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    filledData[sortedDates[i]] = data[sortedDates[i]];

    if (i < sortedDates.length - 1) {
      const nextDate = new Date(sortedDates[i + 1]);
      const diffInDays =
        (nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
      if (diffInDays > 1) {
        for (let j = 1; j < diffInDays; j++) {
          const missingDate = new Date(
            currentDate.getTime() + j * 24 * 60 * 60 * 1000
          );
          const formattedMissingDate = missingDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          filledData[formattedMissingDate] = data[sortedDates[i]];
        }
      }
    }
  }

  if (sortedDates.length) {
    // Add current date if missing
    const currentDate = new Date();
    const latestDate = new Date(sortedDates[sortedDates.length - 1]);
    if (
      currentDate.toISOString().slice(0, 10) !==
      latestDate.toISOString().slice(0, 10)
    ) {
      const formattedCurrentDate = currentDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      filledData[formattedCurrentDate] =
        data[sortedDates[sortedDates.length - 1]];
    }
  }

  // Convert ISO date format back to original format
  const finalData: { [date: string]: number } = {};
  for (const key in filledData) {
    if (filledData.hasOwnProperty(key)) {
      const originalFormatDate = new Date(key).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      finalData[originalFormatDate] = filledData[key];
    }
  }

  // Sort finalData in reverse order
  const sortedFinalData: { [date: string]: number } = {};
  Object.entries(finalData)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .forEach(([date, value]) => {
      sortedFinalData[date] = value;
    });

  return sortedFinalData;
}

export function accumulateLineChartData(historicalData: any[]) {
  // Function to format timestamp to human-readable date
  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return day + " " + monthNames[monthIndex] + " " + year;
  }

  // Create an object to store aggregated amounts for each date
  let aggregatedAssetAmounts: { [date: string]: number }[] = [];
  // Iterate through each asset in historicalData
  historicalData.forEach((asset) => {
    let aggregatedAmountsForAsset: { [date: string]: number } = {};
    // Iterate through prices in each asset
    asset.values.forEach((price: any) => {
      const formattedDate = formatTimestamp(price.date);
      // If date already exists, add the value, else initialize it
      if (aggregatedAmountsForAsset[formattedDate]) {
        aggregatedAmountsForAsset[formattedDate] += price.value || 0;
      } else {
        aggregatedAmountsForAsset[formattedDate] = price.value || 0;
      }
    });
    aggregatedAmountsForAsset = fillMissingDates(aggregatedAmountsForAsset);
    aggregatedAssetAmounts.push(aggregatedAmountsForAsset);
  });

  // Merge and fill missing dates across all assets
  let mergedData: { [date: string]: number } = {};
  aggregatedAssetAmounts.forEach((assetData) => {
    for (const date in assetData) {
      if (assetData.hasOwnProperty(date)) {
        mergedData[date] = (mergedData[date] || 0) + assetData[date];
      }
    }
  });

  // Fill missing dates for the merged data
  const finalAggregatedAmounts = fillMissingDates(mergedData);

  // Convert aggregated amounts to the required format
  const result = Object.keys(finalAggregatedAmounts).map((date) => ({
    name: date,
    amt: finalAggregatedAmounts[date],
  }));

  return result;
}
