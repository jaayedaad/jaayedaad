"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

type DatePickerProps = {
  onSelect: (selectedDate: Date) => void;
  defaultDate?: Date;
};

export function DatePicker({ onSelect, defaultDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    if (defaultDate) {
      let d = new Date(defaultDate);
      const correctedDate = d.setDate(d.getDate() - 1);
      setDate(new Date(correctedDate));
    } else {
      setDate(new Date());
    }
  }, []);

  useEffect(() => {
    if (date) {
      // Notify parent component about the selected date
      onSelect(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={setDate}
          fromYear={1990}
          toYear={new Date().getFullYear()}
          // initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
