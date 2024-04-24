import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import SearchField from "../searchField";
import { searchAssetsFromApi } from "@/services/thirdParty/twelveData";
import { searchResultsFromExistingAssetsInDatabaseAction } from "@/app/(protected)/dashboard/actions";
import LoadingSpinner from "../ui/loading-spinner";
import SearchResults from "../searchResults";
import { TTwelveDataResult, TUserManualCategory } from "@/types/types";
import { Shapes } from "lucide-react";
import ManualTransactionForm from "../manualTransactionForm";

function ManualForm({
  defaultCurrency,
  usersManualCategories,
}: {
  defaultCurrency: string;
  usersManualCategories: TUserManualCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TTwelveDataResult[]>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [showManualTransactionForm, setShowManualTransactionForm] =
    useState(false);

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
  };

  const handleManualTransaction = () => {
    setShowManualTransactionForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex-col lg:flex-row h-24 px-6 items-center gap-4"
        >
          <Shapes height={24} width={24} fill="white" />
          Manual
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="md:flex md:gap-2">
          <DialogTitle>Add Transaction for Manual Assets</DialogTitle>
        </div>
        <div className="flex w-full flex-col pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 items-center">
            <SearchField
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
            <div className="flex gap-6 items-center">
              <p>or</p>
              <Button
                onClick={() => handleManualTransaction()}
                className="w-full text-muted-foreground text-center"
                variant="outline"
              >
                + add manually
              </Button>
            </div>
          </div>
          {loadingAsset ? (
            <div className="my-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="pt-4">
              {!showManualTransactionForm && results.length > 0 ? (
                <SearchResults
                  source="twelvedata"
                  results={results}
                  handleModalState={setOpen}
                  defaultCurrency={defaultCurrency}
                />
              ) : showManualTransactionForm ? (
                <ManualTransactionForm
                  usersManualCategories={usersManualCategories}
                  modalOpen={setOpen}
                  defaultCurrency={defaultCurrency}
                />
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

export default ManualForm;
