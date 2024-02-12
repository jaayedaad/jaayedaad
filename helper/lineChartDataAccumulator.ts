export function prepareLineChartData(historicalData: any[]) {
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

  // Calculate sum of "close" values for each date
  const result: { name: string; amt: number }[] = historicalData.reduce(
    (acc, asset) => {
      asset.prices.forEach((price: any, index: number) => {
        const name = formatTimestamp(price.date);
        const amt = acc[index]
          ? acc[index].amt + (price.value || 0)
          : price.value || 0;
        acc[index] = { name, amt };
      });
      return acc;
    },
    []
  );

  return result;
}
