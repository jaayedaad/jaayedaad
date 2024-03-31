import { TInterval } from "@/lib/types";

export function prepareLineChartData(
  timeRange: TInterval,
  data: {
    name: string;
    amt: number;
  }[],
  setDataToShow: (
    value: React.SetStateAction<
      | {
          name: string;
          amt: number;
        }[]
      | undefined
    >
  ) => void
) {
  // Calculate start and end dates based on the selected time range
  const today = new Date(data[0].name);

  let startDate: Date, endDate: Date;
  if (timeRange === "1d") {
    startDate = new Date(data[1].name);
    startDate.setDate(startDate.getDate());
    endDate = today;
  } else if (timeRange === "1w") {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    endDate = today;
  } else if (timeRange === "1m") {
    startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    endDate = today;
  } else if (timeRange === "1y") {
    startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    endDate = today;
  } else if (timeRange === "All") {
    startDate = new Date(data[data.length - 1].name);
    startDate.setFullYear(today.getFullYear() - 1);
    endDate = today;
  }
  // Fetch data based on the calculated start and end dates
  const fetchedData = data.filter((item) => {
    const itemDate = new Date(item.name);
    return (
      itemDate.getTime() >= startDate.getTime() &&
      itemDate.getTime() <= endDate.getTime()
    );
  });

  // Adjust date format if timeRange is not "1d"
  const formattedData = fetchedData.map((item) => {
    const itemDate = new Date(item.name);
    if (timeRange === "1y") {
      const month = (itemDate.getMonth() + 1).toString().padStart(2, "0");
      const year = itemDate.getFullYear().toString().slice(-2);
      return {
        ...item,
        name: `${month}-${year}`,
      };
    } else {
      const day = itemDate.getDate().toString().padStart(2, "0");
      const month = (itemDate.getMonth() + 1).toString().padStart(2, "0");
      return {
        ...item,
        name: `${day}-${month}`,
      };
    }
  });

  setDataToShow(formattedData.reverse());
}
