import { MoveUpRight } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function ClaimUsername() {
  return (
    <div className="text-primary-foreground lg:px-4">
      <h2 className="text-lg lg:text-2xl">Claim your username</h2>
      <div className="flex mt-2">
        <Button variant="secondary" className="text-lg rounded-l-full">
          jaayedaad.com/
        </Button>
        <Input
          placeholder="ShubhamPalriwala"
          className="rounded-l-none text-lg rounded-r-full w-1/3 md:w-1/4 bg-primary focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          variant="secondary"
          className="text-primary rounded-full ml-2"
          size="icon"
        >
          <MoveUpRight />
        </Button>
      </div>
    </div>
  );
}

export default ClaimUsername;
