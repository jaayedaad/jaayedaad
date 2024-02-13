"use client";
import { useEffect, useState } from "react";
import SearchResults from "@/components/searchResults";
import SearchField from "@/components/searchField";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function AddAssetPage() {
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
    <div className="flex min-h-screen w-full flex-col py-6 px-6">
      <div className="pb-6">
        <h1 className="text-5xl font-bold">Add transaction</h1>
      </div>
      {/* Search Field */}
      <SearchField
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      {/* Results Table */}
      {loadingAsset ? (
        <LoadingSpinner />
      ) : (
        <div className="py-12">
          {results.length > 0 ? (
            <SearchResults results={results} />
          ) : (
            <div className="text-center mt-24">Search for any assets!</div>
          )}
        </div>
      )}
    </div>
  );
}
