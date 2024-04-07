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
import { cn } from "@/lib/helper";

const reverseAssetTypeMappings: Record<string, string> = {
  "Common Stock": "Stocks",
  "Digital Currency": "Crypto",
};

type searchResultProps = {
  results: Array<any>;
  handleModalState: React.Dispatch<React.SetStateAction<boolean>>;
  defaultCurrency: string;
};

const SearchResults = ({
  results,
  handleModalState,
  defaultCurrency,
}: searchResultProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{
    instrument_name: string;
    symbol: string;
    instrument_type: string;
    exchange: string;
  }>();

  const handleAddClick = async (
    instrument_name: string,
    symbol: string,
    instrument_type: string,
    exchange: string
  ) => {
    setShowForm(true);
    setSelectedAsset({ instrument_name, symbol, instrument_type, exchange });
  };

  return results.length > 0 && !showForm ? (
    <ScrollArea className={cn("mb-4", showForm ? "h-[16vh]" : "h-[24vh]")}>
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
              result.instrument_name && (
                <TableRow key={index}>
                  <TableCell>{result?.instrument_name}</TableCell>
                  <TableCell className="text-right">
                    {result?.exchange}
                  </TableCell>
                  <TableCell className="text-right">{result?.symbol}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleAddClick(
                          result.instrument_name,
                          result.symbol,
                          result.instrument_type,
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
  ) : (
    selectedAsset && (
      <>
        <div className="grid grid-cols-5 gap-4 grid-rows-1 bg-secondary py-2">
          <div className="col-span-2">{selectedAsset.instrument_name}</div>
          <div className="text-right">{selectedAsset.symbol}</div>
          <div className="text-right">{selectedAsset.exchange}</div>
          <div className="text-right">
            {reverseAssetTypeMappings[selectedAsset.instrument_type] ||
              selectedAsset.instrument_type}
          </div>
        </div>
        <TransactionForm
          selectedAsset={selectedAsset}
          modalOpen={handleModalState}
          defaultCurrency={defaultCurrency}
        />
      </>
    )
  );
};

export default SearchResults;
