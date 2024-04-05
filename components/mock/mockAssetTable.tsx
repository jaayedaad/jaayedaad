import React from "react";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

function MockAssetTable() {
  return (
    <div className="h-64 flex flex-col justify-center ">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right lg:w-16 xl:w-auto">
              <Button variant="ghost">
                Invested Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost">
                Current Value
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost">
                Profit/Loss %
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <div className="m-auto">You don&apos;t own any assets yet</div>
    </div>
  );
}

export default MockAssetTable;
