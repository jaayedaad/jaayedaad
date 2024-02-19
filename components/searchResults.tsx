"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import TransactionForm from "./transactionForm";
import ManualTransactionForm from "./manualTransactionForm";

type searchResultProps = {
  results: Array<any>;
  handleModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchResults = ({ results, handleModalState }: searchResultProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{
    shortname: string;
    symbol: string;
    quoteType: string;
    exchange: string;
  }>();

  const handleAddClick = async (
    shortname: string,
    symbol: string,
    quoteType: string,
    exchange: string
  ) => {
    setShowForm((prevState) => !prevState);
    setSelectedAsset({ shortname, symbol, quoteType, exchange });
  };

  const handleManualTransaction = async () => {
    setShowForm(true);
  };

  return (
    results.length > 0 &&
    (!showForm ? (
      <>
        <ScrollArea className="h-[50vh]">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px] text-right">Exchange</TableHead>
                <TableHead className="w-[100px] text-right">Symbol</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-hidden">
              {results.map((result, index) => {
                return (
                  result.shortname && (
                    <TableRow key={index}>
                      <TableCell>{result?.shortname}</TableCell>
                      <TableCell className="text-right">
                        {result?.exchange}
                      </TableCell>
                      <TableCell className="text-right">
                        {result?.symbol}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleAddClick(
                              result.shortname,
                              result.symbol,
                              result.quoteType,
                              result.exchange
                            )
                          }
                          className="w-full"
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="text-center mt-2">
          <Button
            onClick={() => handleManualTransaction()}
            className="text-muted-foreground text-center"
            variant="ghost"
          >
            + or add it manually
          </Button>
        </div>
      </>
    ) : selectedAsset ? (
      <TransactionForm
        selectedAsset={selectedAsset}
        modalOpen={handleModalState}
      />
    ) : (
      <ManualTransactionForm modalOpen={handleModalState} />
    ))
  );
};

export default SearchResults;
