"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type Interval = "1d" | "1w" | "1m" | "1y" | "All";
interface ChildProps {
  onChange: (value: Interval) => void;
}

function ChangeInterval({ onChange }: ChildProps) {
  const [activeInterval, setActiveInterval] = useState<Interval>("All");
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
        variant={activeInterval === "1w" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => {
          setActiveInterval("1w");
          onChange("1w");
        }}
      >
        1w
      </Button>
      <Button
        variant={activeInterval === "1m" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => {
          setActiveInterval("1m");
          onChange("1m");
        }}
      >
        1m
      </Button>
      <Button
        variant={activeInterval === "1y" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => {
          setActiveInterval("1y");
          onChange("1y");
        }}
      >
        1y
      </Button>
      <Button
        variant={activeInterval === "All" ? "secondary" : "ghost"}
        size="icon"
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
