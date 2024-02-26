"use client";
import { useEffect, useState } from "react";
import SearchResults from "@/components/searchResults";
import SearchField from "@/components/searchField";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ManualTransactionForm from "./manualTransactionForm";
import { Button } from "./ui/button";

interface AddTransactionPropsType {
  handleModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddTransaction({
  handleModalState,
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
      const url = `https://yh-finance.p.rapidapi.com/auto-complete?q=${searchQuery}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY,
          "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
        },
      };

      const res = await fetch(url, options);
      const { quotes: resultsFromAPI } = await res.json();

      // Merge resultsFromDB with resultsFromAPI, keeping all items from resultsFromDB and adding unmatched items from resultsFromAPI
      const mergedResults = resultsFromDB.map((dbResult: any) => {
        const matchingResult = resultsFromAPI.find(
          (apiResult: any) => apiResult.shortname === dbResult.shortname
        );
        return matchingResult ? { ...dbResult, ...matchingResult } : dbResult;
      });

      // Add unmatched items from resultsFromAPI
      resultsFromAPI.forEach((apiResult: any) => {
        const isUnmatched = !resultsFromDB.some(
          (dbResult: any) => dbResult.shortname === apiResult.shortname
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
      <div className="flex gap-6 items-center">
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
            + Or add it manually
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
              />
            </>
          ) : showManualTransactionForm ? (
            <ManualTransactionForm modalOpen={handleModalState} />
          ) : (
            <div className="text-center my-12">Search for any assets!</div>
          )}
        </div>
      )}
    </div>
  );
}
