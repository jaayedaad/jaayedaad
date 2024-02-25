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
  const aggregatedAmounts: { [date: string]: number } = {};

  // Iterate through each asset in historicalData
  historicalData.forEach((asset) => {
    // Iterate through prices in each asset
    asset.prices.forEach((price: any) => {
      const formattedDate = formatTimestamp(price.date);
      // If date already exists, add the value, else initialize it
      if (aggregatedAmounts[formattedDate]) {
        aggregatedAmounts[formattedDate] += price.value || 0;
      } else {
        aggregatedAmounts[formattedDate] = price.value || 0;
      }
    });
  });

  // Convert aggregated amounts to the required format
  const result = Object.keys(aggregatedAmounts).map((date) => ({
    name: date,
    amt: aggregatedAmounts[date],
  }));

  return result;
}
