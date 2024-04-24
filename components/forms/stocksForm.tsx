import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { StockIcon } from "@/public/feature-svgs/featureIcons";
import SearchField from "../searchField";
import { searchAssetsFromApi } from "@/services/thirdParty/twelveData";
import { searchResultsFromExistingAssetsInDatabaseAction } from "@/app/(protected)/dashboard/actions";
import LoadingSpinner from "../ui/loading-spinner";
import SearchResults from "../searchResults";
import { TTwelveDataResult } from "@/types/types";

function StocksForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TTwelveDataResult[]>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);

  // useEffect to trigger API call when searchQuery changes
  useEffect(() => {
    // Set a timer to delay the API call
    const timerId = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch();
      }
    }, 1500);

    // Clear the timer on each searchQuery change
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setLoadingAsset(true);
  };
  const handleSearch = async () => {
    const resultsFromDB = await searchResultsFromExistingAssetsInDatabaseAction(
      searchQuery
    );
    // Set the state with the initial results from the database
    setResults(resultsFromDB);
    setLoadingAsset(false);

    try {
      const resultsFromApi = await searchAssetsFromApi({
        query: searchQuery,
        type: "Common Stock",
      });

      // Merge resultsFromDB with resultsFromAPI, keeping all items from resultsFromDB and adding unmatched items from resultsFromAPI
      const mergedResults = resultsFromDB.map((dbResult) => {
        const matchingResult = resultsFromApi?.find(
          (apiResult) => apiResult.instrument_name === dbResult.instrument_name
        );
        return matchingResult ? { ...dbResult, ...matchingResult } : dbResult;
      });

      // Add unmatched items from resultsFromAPI
      resultsFromApi?.forEach((apiResult) => {
        const isUnmatched = !resultsFromDB.some(
          (dbResult) => dbResult.instrument_name === apiResult.instrument_name
        );
        if (isUnmatched) {
          mergedResults.push(apiResult);
        }
      });

      setResults(mergedResults);
    } finally {
      setLoadingAsset(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex-col lg:flex-row h-24 px-6 items-center gap-4"
        >
          <StockIcon height={24} width={24} fill="white" />
          Stocks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="md:flex md:gap-2">
          <DialogTitle>Add Transaction for Stocks</DialogTitle>
          <p className="text-muted-foreground text-sm">Search for Stocks</p>
        </div>
        <div className="flex w-full flex-col pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 items-center">
            <SearchField
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </div>
          {loadingAsset ? (
            <div className="my-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="pt-4">
              {results.length > 0 ? (
                <>
                  <SearchResults
                    source="twelvedata"
                    results={results}
                    handleModalState={setOpen}
                    defaultCurrency={defaultCurrency}
                  />
                </>
              ) : (
                <div className="text-center my-12">Refine your assets!</div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StocksForm;
