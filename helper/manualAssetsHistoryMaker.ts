import { TAsset, TConversionRates, THistoricalData } from "@/types/types";

export function prepareHistoricalDataForManualCategory(
  manualCategoryAssets: TAsset[],
  conversionRate: TConversionRates
) {
  const historicalData: THistoricalData[] = [];
  manualCategoryAssets.forEach((asset) => {
    const conversionRateMultiplier =
      1 / conversionRate[asset.buyCurrency.toLowerCase()];
    const aggregatedAssetData: {
      datetime: string;
      open: string;
      high: string;
      low: string;
      close: string;
      volume: string;
      previous_close: string;
      date: number;
      value: number;
    }[] = [];
    // sort assetPriceUpdates in ascending order
    const priceUpdates = asset.assetPriceUpdates.sort((a, b) => {
      // Convert the dates to actual Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
    // Sort transactions by date in ascending order
    asset.transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let quantityAtDate = 0;
    let priceAtDate = 0;
    asset.transactions.forEach((transaction, index) => {
      const unformatedDate = new Date(transaction.date);
      let transactionDate = new Date(
        unformatedDate.setDate(unformatedDate.getDate() - 1)
      );
      let nextTransactionDate =
        asset.transactions.length > index + 1
          ? new Date(asset.transactions[index + 1].date)
          : null;

      if (transaction.type === "buy") {
        quantityAtDate += +transaction.quantity;
      } else {
        quantityAtDate -= +transaction.quantity;
      }

      if (nextTransactionDate) {
        nextTransactionDate = new Date(
          nextTransactionDate.setDate(nextTransactionDate.getDate() - 1)
        );
        const lastUpdatedDates: Date[] = [];
        // Iterate over sorted assets and add dates newer than transactionDate
        priceUpdates.forEach((asset) => {
          const unformatedDate = new Date(asset.date);
          const assetTransactionDate = new Date(
            unformatedDate.setDate(unformatedDate.getDate() - 1)
          );

          if (
            new Date(assetTransactionDate.toDateString()) >=
            new Date(transactionDate.toDateString())
          ) {
            lastUpdatedDates.push(assetTransactionDate);
          }
        });

        lastUpdatedDates.push(nextTransactionDate);
        let index = 0;
        while (
          new Date(transactionDate.toDateString()) <
          new Date(nextTransactionDate.toDateString())
        ) {
          // Find last updated on date & price
          for (const assetUpdate of priceUpdates) {
            const updateDate = new Date(assetUpdate.date);
            if (updateDate >= transactionDate) {
              priceAtDate = +assetUpdate.price * conversionRateMultiplier;
              break; // set priceAtDate & exit the loop once a newer date is found
            }
          }
          while (
            new Date(transactionDate.toDateString()) <
            new Date(lastUpdatedDates[index + 1].toDateString())
          ) {
            aggregatedAssetData.push({
              datetime: transactionDate.toDateString(),
              open: priceAtDate.toFixed(2),
              high: priceAtDate.toFixed(2),
              low: priceAtDate.toFixed(2),
              close: priceAtDate.toFixed(2),
              volume: "0",
              previous_close: priceAtDate.toFixed(2),
              date: new Date(transactionDate).getTime() / 1000,
              value: quantityAtDate * priceAtDate,
            });

            transactionDate.setDate(transactionDate.getDate() + 1);
          }
          index += 1;
        }
      } else {
        const currentDate = new Date();
        const lastUpdatedDates: Date[] = [];
        // Iterate over sorted assets and add dates newer than transactionDate
        priceUpdates.forEach((asset) => {
          const unformatedDate = new Date(asset.date);
          const assetUpdateDate = new Date(
            unformatedDate.setDate(unformatedDate.getDate() - 1)
          );

          if (assetUpdateDate >= transactionDate) {
            lastUpdatedDates.push(assetUpdateDate);
          }
        });

        lastUpdatedDates.push(currentDate);
        let index = 0;
        while (
          new Date(transactionDate.toDateString()) <=
          new Date(currentDate.toDateString())
        ) {
          // Find last updated on date & price
          for (const assetUpdate of priceUpdates) {
            const updateDate = new Date(assetUpdate.date);
            if (
              new Date(updateDate.toDateString()) >=
              new Date(transactionDate.toDateString())
            ) {
              priceAtDate = +assetUpdate.price * conversionRateMultiplier;
              break; // set priceAtDate & exit the loop once a newer date is found
            }
          }
          if (lastUpdatedDates.length === 1) {
            lastUpdatedDates.push(new Date());
          }
          while (
            new Date(transactionDate.toDateString()) <=
            new Date(lastUpdatedDates[index + 1].toDateString())
          ) {
            const data = {
              datetime: transactionDate.toDateString(),
              open: priceAtDate.toFixed(2),
              high: priceAtDate.toFixed(2),
              low: priceAtDate.toFixed(2),
              close: priceAtDate.toFixed(2),
              volume: "0",
              previous_close: priceAtDate.toFixed(2),
              date: new Date(transactionDate).getTime() / 1000,
              value: quantityAtDate * priceAtDate,
            };
            aggregatedAssetData.push(data);

            transactionDate.setDate(transactionDate.getDate() + 1);
          }
          index += 1;
        }
      }
    });
    aggregatedAssetData.shift();
    historicalData.push({
      values: aggregatedAssetData,
      assetId: asset.id,
      assetSymbol: asset.symbol,
      assetType: asset.category,
    });
  });

  return historicalData;
}
