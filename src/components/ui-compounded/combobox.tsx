"use client";

// import * as React from "react";
import {
  Calculator,
  Calendar,
  Check,
  ChevronsUpDown,
  Smile,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";

type ComboboxProps = {
  placeholder?: string;
  placeholderOnSearch?: string;
  emptyLabel?: string;
  emptyNode?: React.ReactNode;
  data: { value: string; label: string }[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};
export function Combobox({
  placeholder,
  placeholderOnSearch,
  emptyLabel,
  emptyNode,
  data,
  value,
  setValue,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  //   const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? data.find((val) => val.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholderOnSearch} />
          <CommandList>
            {/* TODO: Poder meter elementos */}
            <CommandEmpty>{emptyNode ? emptyNode : emptyLabel}</CommandEmpty>
            <CommandGroup>
              {data.map((val) => (
                <CommandItem
                  key={val.value}
                  value={val.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === val.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {val.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
