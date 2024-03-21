"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type searchFieldProps = {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
};

function SearchField({ searchQuery, handleSearchChange }: searchFieldProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-sm md:text-base">Search:</div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchField;
