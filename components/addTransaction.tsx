"use client";
import { useEffect, useState } from "react";
import SearchResults from "@/components/searchResults";
import SearchField from "@/components/searchField";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ManualTransactionModal from "@/components/manualTransactionModal";

export default function AddTransaction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<any>>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);

  // Function to handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setLoadingAsset(true);
  };

  // Function to handle search
  const handleSearch = async () => {
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
      const { quotes: results } = await res.json();
      setResults(results);
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

  return (
    <div className="flex w-full flex-col mt-4">
      <div className="flex gap-6 items-center">
        {/* Search Field */}
        <SearchField
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
        <p className="text-muted-foreground">Or</p>
        <ManualTransactionModal />
      </div>
      {/* Results Table */}
      {loadingAsset ? (
        <div className="mb-16">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="pt-4">
          {results.length > 0 ? (
            <SearchResults results={results} />
          ) : (
            <div className="text-center my-12">Search for any assets!</div>
          )}
        </div>
      )}
    </div>
  );
}
