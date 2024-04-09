"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TInterval } from "@/lib/types";
import { cn } from "@/lib/helper";

interface ChildProps {
  onChange: (value: TInterval) => void;
}

function ChangeInterval({ onChange }: ChildProps) {
  const [activeInterval, setActiveInterval] = useState<TInterval>("All");
  useEffect(() => {
    onChange(activeInterval);
  }, []);

  return (
    <div className="flex gap-1 justify-center items-center">
      {/* <Button
        variant={activeInterval === "1d" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => {
          setActiveInterval("1d");
          onChange("1d");
        }}
      >
        1d
      </Button> */}
      <Button
        className={cn(
          "hover:bg-primary/10 bg-background",
          activeInterval === "1w" &&
            "bg-[#171326]/70 border hover:bg-primary/50"
        )}
        size="icon"
        onClick={() => {
          setActiveInterval("1w");
          onChange("1w");
        }}
      >
        1w
      </Button>
      <Button
        className={cn(
          "hover:bg-primary/10 bg-background",
          activeInterval === "1m" &&
            "bg-[#171326]/70 border hover:bg-primary/50"
        )}
        size="icon"
        onClick={() => {
          setActiveInterval("1m");
          onChange("1m");
        }}
      >
        1m
      </Button>
      <Button
        className={cn(
          "hover:bg-primary/10 bg-background",
          activeInterval === "1y" &&
            "bg-[#171326]/70 border hover:bg-primary/50"
        )}
        size="icon"
        onClick={() => {
          setActiveInterval("1y");
          onChange("1y");
        }}
      >
        1y
      </Button>
      <Button
        size="icon"
        className={cn(
          "hover:bg-primary/10 bg-background",
          activeInterval === "All" &&
            "bg-[#171326]/70 border hover:bg-primary/50"
        )}
        onClick={() => {
          setActiveInterval("All");
          onChange("All");
        }}
      >
        All
      </Button>
    </div>
  );
}

export default ChangeInterval;
