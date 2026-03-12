import { memo } from "react";
import { Button } from "../ui";

export type FilterType = "Today" | "Yesterday";

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterButtons = memo(function FilterButtons({
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "Today", label: "Today" },
    { key: "Yesterday", label: "Yesterday" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
      {filters.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeFilter === key ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(key)}
          className={
            activeFilter === key
              ? "shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          {label}
        </Button>
      ))}
    </div>
  );
});