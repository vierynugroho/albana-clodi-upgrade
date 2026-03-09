import { memo } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "../ui";
import { Calendar, Filter } from "lucide-react";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/constants";

interface FilterSectionProps {
  filterPreset: string;
  onFilterPresetChange: (preset: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  filterInfo: string;
  onApplyFilter: () => void;
}

const FILTER_PRESETS = [
  { label: "Semua Waktu", value: "all" },
  { label: "Hari Ini", value: "today" },
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun Ini", value: "year" },
  { label: "Custom", value: "custom" },
];

export const FilterSection = memo(function FilterSection({
  filterPreset,
  onFilterPresetChange,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  filterInfo,
  onApplyFilter,
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Filter Laporan</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Presets */}
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant={filterPreset === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterPresetChange(preset.value)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Month/Year Selectors - Always show except for custom */}
        {filterPreset !== "custom" && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Bulan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {MONTH_OPTIONS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.value === "" ? "Semua" : month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Tahun:</label>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.value === "" ? "Semua" : year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Custom Date Range */}
        {filterPreset === "custom" && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm text-muted-foreground">Dari:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-9 w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Sampai:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-9 w-40"
              />
            </div>
          </div>
        )}

        {/* Current Filter Info and Apply Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t">
          <p className="text-sm text-muted-foreground mt-2">
            Menampilkan data: <span className="font-medium text-foreground">{filterInfo || "Semua data"}</span>
          </p>
          <Button onClick={onApplyFilter} className="w-full sm:w-auto mt-2">
            Terapkan Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});