"use client";

import { Check, ChevronsUpDown, ListFilter, X } from "lucide-react";
import { useState } from "react";
import type { Column } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared shell                                                       */
/* ------------------------------------------------------------------ */

type FilterDropdownProps = {
  isFiltered: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

function FilterDropdown({
  isFiltered,
  isOpen,
  onOpenChange,
  children,
  className,
}: FilterDropdownProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-5 w-5",
            isFiltered ? "text-primary" : "text-muted-foreground",
            className
          )}
          aria-label="Filter column"
        >
          <ListFilter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-3">
        {children}
      </PopoverContent>
    </Popover>
  );
}

type FilterActionsProps = {
  onClear: () => void;
  onApply: () => void;
  isApplyDisabled?: boolean;
  isClearDisabled?: boolean;
};

function FilterActions({
  onClear,
  onApply,
  isApplyDisabled,
  isClearDisabled,
}: FilterActionsProps) {
  return (
    <>
      <Separator className="my-3" />
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          disabled={isClearDisabled}
          onClick={onClear}
          className="h-7 text-xs"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear
        </Button>
        <Button
          size="sm"
          disabled={isApplyDisabled}
          onClick={onApply}
          className="h-7 text-xs"
        >
          Apply
        </Button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Text filter                                                        */
/* ------------------------------------------------------------------ */

type DataTableTextFilterProps<TData> = {
  column: Column<TData>;
  placeholder?: string;
};

export function DataTableTextFilter<TData>({
  column,
  placeholder = "Filter...",
}: DataTableTextFilterProps<TData>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    (column.getFilterValue() as string | undefined) ?? ""
  );

  const apply = () => {
    column.setFilterValue(value.trim() || undefined);
    setOpen(false);
  };

  const clear = () => {
    setValue("");
    column.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <FilterDropdown
      isFiltered={Boolean(column.getFilterValue())}
      isOpen={open}
      onOpenChange={setOpen}
    >
      <Input
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") apply();
          if (e.key === "Escape") setOpen(false);
        }}
      />
      <FilterActions
        onApply={apply}
        onClear={clear}
        isClearDisabled={!value && !column.getFilterValue()}
      />
    </FilterDropdown>
  );
}

/* ------------------------------------------------------------------ */
/*  Select filter                                                      */
/* ------------------------------------------------------------------ */

type SelectOption = { label: string; value: string };

type DataTableSelectFilterProps<TData> = {
  column: Column<TData>;
  options: SelectOption[];
  placeholder?: string;
  /** Allow selecting multiple values */
  multiple?: boolean;
};

export function DataTableSelectFilter<TData>({
  column,
  options,
  placeholder = "Select...",
  multiple = false,
}: DataTableSelectFilterProps<TData>) {
  const [open, setOpen] = useState(false);

  const rawValue = column.getFilterValue();
  const selected: string[] = multiple
    ? Array.isArray(rawValue)
      ? rawValue
      : []
    : typeof rawValue === "string"
      ? [rawValue]
      : [];

  const toggle = (value: string) => {
    if (multiple) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      column.setFilterValue(next.length ? next : undefined);
    } else {
      column.setFilterValue(selected[0] === value ? undefined : value);
      setOpen(false);
    }
  };

  const clear = () => {
    column.setFilterValue(undefined);
    setOpen(false);
  };

  const label =
    selected.length === 0
      ? placeholder
      : multiple
        ? `${selected.length} selected`
        : (options.find((o) => o.value === selected[0])?.label ?? selected[0]);

  return (
    <FilterDropdown
      isFiltered={selected.length > 0}
      isOpen={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between text-xs font-normal"
      >
        <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
          {label}
        </span>
        <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
      </Button>

      {multiple && selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((value) => {
            const opt = options.find((o) => o.value === value);
            return (
              <Badge key={value} variant="outline" className="text-[10px]">
                {opt?.label ?? value}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(value);
                  }}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${opt?.label ?? value}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <Command className="mt-2 rounded-md border">
        <CommandInput placeholder="Search..." className="h-8 text-xs" />
        <CommandList>
          <CommandEmpty className="py-4 text-xs">No results</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggle(option.value)}
                  className="text-xs"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-3.5 w-3.5",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>

      <FilterActions
        onApply={() => setOpen(false)}
        onClear={clear}
        isClearDisabled={selected.length === 0}
      />
    </FilterDropdown>
  );
}

/* ------------------------------------------------------------------ */
/*  Number range filter                                                */
/* ------------------------------------------------------------------ */

type DataTableNumberRangeFilterProps<TData> = {
  column: Column<TData>;
  /** Label for the min input, e.g. "Min score" */
  minLabel?: string;
  maxLabel?: string;
};

export function DataTableNumberRangeFilter<TData>({
  column,
  minLabel = "Min",
  maxLabel = "Max",
}: DataTableNumberRangeFilterProps<TData>) {
  const [open, setOpen] = useState(false);
  const raw = column.getFilterValue() as [number, number] | undefined;

  const [min, setMin] = useState<string>(raw?.[0]?.toString() ?? "");
  const [max, setMax] = useState<string>(raw?.[1]?.toString() ?? "");

  const apply = () => {
    const minNum = min === "" ? undefined : Number(min);
    const maxNum = max === "" ? undefined : Number(max);
    if (minNum === undefined && maxNum === undefined) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue([
        minNum ?? Number.NEGATIVE_INFINITY,
        maxNum ?? Number.POSITIVE_INFINITY,
      ]);
    }
    setOpen(false);
  };

  const clear = () => {
    setMin("");
    setMax("");
    column.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <FilterDropdown
      isFiltered={Boolean(column.getFilterValue())}
      isOpen={open}
      onOpenChange={setOpen}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] uppercase text-muted-foreground">
            {minLabel}
          </label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase text-muted-foreground">
            {maxLabel}
          </label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            className="h-8"
          />
        </div>
      </div>
      <FilterActions
        onApply={apply}
        onClear={clear}
        isClearDisabled={!min && !max && !column.getFilterValue()}
      />
    </FilterDropdown>
  );
}

/* ------------------------------------------------------------------ */
/*  Single date filter                                                 */
/* ------------------------------------------------------------------ */

type DataTableDateFilterProps<TData> = {
  column: Column<TData>;
  /** Whether the filter matches "on or after" the date (default), or "on or before" */
  mode?: "after" | "before";
};

export function DataTableDateFilter<TData>({
  column,
  mode = "after",
}: DataTableDateFilterProps<TData>) {
  const [open, setOpen] = useState(false);
  const value = column.getFilterValue() as string | undefined;

  const apply = (date: string) => {
    column.setFilterValue(date);
    setOpen(false);
  };

  const clear = () => {
    column.setFilterValue(undefined);
    setOpen(false);
  };

  return (
    <FilterDropdown
      isFiltered={Boolean(value)}
      isOpen={open}
      onOpenChange={setOpen}
    >
      <label className="mb-2 block text-[10px] uppercase text-muted-foreground">
        {mode === "after" ? "On or after" : "On or before"}
      </label>
      <Input
        type="date"
        defaultValue={value ?? ""}
        onChange={(e) => apply(e.target.value)}
        className="h-8"
      />
      <FilterActions
        onApply={() => setOpen(false)}
        onClear={clear}
        isClearDisabled={!value}
      />
    </FilterDropdown>
  );
}

/* ------------------------------------------------------------------ */
/*  Display names                                                      */
/* ------------------------------------------------------------------ */

DataTableTextFilter.displayName = "DataTableTextFilter";
DataTableSelectFilter.displayName = "DataTableSelectFilter";
DataTableNumberRangeFilter.displayName = "DataTableNumberRangeFilter";
DataTableDateFilter.displayName = "DataTableDateFilter";