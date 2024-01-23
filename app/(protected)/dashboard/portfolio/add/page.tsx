"use client";
import { useEffect, useState } from "react";
import SearchResults from "@/components/searchResults";
import SearchField from "@/components/searchField";

export default function AddAssetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<any>>([]);

  // Function to handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Function to handle search
  const handleSearch = async () => {
    // search API endpoint
    const url = `https://yh-finance.p.rapidapi.com/auto-complete?q=${searchQuery}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY!,
        "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
      },
    };

    const res = await fetch(url, options);
    const { quotes: results } = await res.json();
    setResults(results);
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
    <div className="flex min-h-screen w-full flex-col py-10 px-12">
      <div className="py-10">
        <h1 className="text-5xl font-bold">My Assets</h1>
        <p className="text-muted-foreground pt-1">Manage all of your assets</p>
      </div>
      {/* Search Field */}
      <SearchField
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />

      {/* Results Table */}
      <div className="py-12">
        {results && <SearchResults results={results} />}
      </div>
    </div>
  );
}
