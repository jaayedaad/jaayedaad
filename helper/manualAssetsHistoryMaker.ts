import { Asset } from "@/actions/getAssetsAction";

export function prepareHistoricalDataForManualCategory(
  manualCategoryAssets: Asset[]
) {
  const historicalData: { prices: { date: number; value: number }[] }[] = [];
  manualCategoryAssets.forEach((asset) => {
    const aggregatedAssetData: { date: number; value: number }[] = [];
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

          if (assetTransactionDate >= transactionDate) {
            lastUpdatedDates.push(assetTransactionDate);
          }
        });

        lastUpdatedDates.push(new Date());
        let index = 0;
        while (transactionDate <= nextTransactionDate) {
          // Find last updated on date & price
          for (const assetUpdate of priceUpdates) {
            const updateDate = new Date(assetUpdate.date);
            if (updateDate >= transactionDate) {
              priceAtDate = +assetUpdate.price;
              break; // set priceAtDate & exit the loop once a newer date is found
            }
          }
          while (transactionDate <= lastUpdatedDates[index + 1]) {
            aggregatedAssetData.push({
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
          const assetTransactionDate = new Date(
            unformatedDate.setDate(unformatedDate.getDate() - 1)
          );

          if (assetTransactionDate >= transactionDate) {
            lastUpdatedDates.push(assetTransactionDate);
          }
        });

        lastUpdatedDates.push(currentDate);
        let index = 0;
        while (transactionDate <= currentDate) {
          // Find last updated on date & price
          for (const assetUpdate of priceUpdates) {
            const updateDate = new Date(assetUpdate.date);
            if (updateDate >= transactionDate) {
              priceAtDate = +assetUpdate.price;
              break; // set priceAtDate & exit the loop once a newer date is found
            }
          }
          while (
            new Date(transactionDate.toDateString()) <=
            new Date(lastUpdatedDates[index + 1].toDateString())
          ) {
            const data = {
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
    historicalData.push({ prices: aggregatedAssetData });
  });

  return historicalData;
}
