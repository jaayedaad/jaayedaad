"use client";
import { useEffect, useState } from "react";
import SearchResults from "@/components/searchResults";
import SearchField from "@/components/searchField";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ManualTransactionForm from "./manualTransactionForm";
import { Button } from "./ui/button";
import { TUserManualCategory } from "@/lib/types";

interface AddTransactionPropsType {
  usersManualCategories: TUserManualCategory[];
  handleModalState: React.Dispatch<React.SetStateAction<boolean>>;
  defaultCurrency: string;
}

export default function AddTransaction({
  usersManualCategories,
  handleModalState,
  defaultCurrency,
}: AddTransactionPropsType) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<any>>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [showManualTransactionForm, setShowManualTransactionForm] =
    useState(false);

  // Function to handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setLoadingAsset(true);
  };

  // Function to handle search
  const handleSearch = async () => {
    setShowManualTransactionForm(false);
    const response = await fetch("/api/assets/search", {
      method: "POST",
      body: JSON.stringify({ searchQuery: searchQuery }),
    });
    const resultsFromDB = await response.json();
    // Set the state with the initial results from the database
    setResults(resultsFromDB);
    setLoadingAsset(false);

    try {
      // search API endpoint
      const url = `https://api.twelvedata.com/symbol_search?symbol=${searchQuery}&outputsize=9`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
        },
      };

      const res = await fetch(url, options);
      const { data: resultsFromAPI } = await res.json();

      // Merge resultsFromDB with resultsFromAPI, keeping all items from resultsFromDB and adding unmatched items from resultsFromAPI
      const mergedResults = resultsFromDB.map((dbResult: any) => {
        const matchingResult = resultsFromAPI.find(
          (apiResult: any) =>
            apiResult.instrument_name === dbResult.instrument_name
        );
        return matchingResult ? { ...dbResult, ...matchingResult } : dbResult;
      });

      // Add unmatched items from resultsFromAPI
      resultsFromAPI.forEach((apiResult: any) => {
        const isUnmatched = !resultsFromDB.some(
          (dbResult: any) =>
            dbResult.instrument_name === apiResult.instrument_name
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

  const handleManualTransaction = () => {
    setShowManualTransactionForm(true);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex md:gap-6 items-center">
        {/* Search Field */}
        <SearchField
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
        <div className="text-center">
          <Button
            onClick={() => handleManualTransaction()}
            className="text-muted-foreground text-center"
            variant="ghost"
          >
            + add manually
          </Button>
        </div>
      </div>
      {/* Results Table */}
      {loadingAsset ? (
        <div className="my-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="pt-4">
          {!showManualTransactionForm && results.length > 0 ? (
            <>
              <SearchResults
                results={results}
                handleModalState={handleModalState}
                defaultCurrency={defaultCurrency}
              />
            </>
          ) : showManualTransactionForm ? (
            <ManualTransactionForm
              usersManualCategories={usersManualCategories}
              modalOpen={handleModalState}
              defaultCurrency={defaultCurrency}
            />
          ) : (
            <div className="text-center my-12">Search for any assets!</div>
          )}
        </div>
      )}
    </div>
  );
}
