import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

import formatLabel from '@/utils/formatLabel';
import PaginationControls from './Pagination';

interface ExerciseFiltersPanelProps {
  filters: {
    search: string;
    sort: string;
    category: string;
    muscle: string;
  };
  updateFilter: (
    key: keyof ExerciseFiltersPanelProps['filters'],
    value: string,
  ) => void;
  clearFilters: () => void;
  categoryOptions: string[];
  muscleOptions: string[];
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}

export default function ExerciseFiltersPanel({
  filters,
  updateFilter,
  clearFilters,
  categoryOptions,
  muscleOptions,
  page,
  totalPages,
  nextPage,
  prevPage,
}: Readonly<ExerciseFiltersPanelProps>) {
  return (
    <div className="w-full lg:w-80 p-6 pb-2 rounded-md sm:border-r border-border bg-muted/30 space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filter</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="flex items-center justify-center"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort by</Label>
          <Select
            value={filters.sort}
            onValueChange={(val) => updateFilter('sort', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(val) => updateFilter('category', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Muscle</Label>
          <Select
            value={filters.muscle}
            onValueChange={(val) => updateFilter('muscle', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {muscleOptions.map((muscle) => (
                <SelectItem key={muscle} value={muscle}>
                  {formatLabel(muscle)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="hidden md:flex w-full justify-center mt-4">
        <PaginationControls
          page={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
    </div>
  );
}
