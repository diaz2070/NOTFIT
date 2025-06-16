'use client';

import { Routine, RoutineExercise, Exercise, DayOfWeek } from '@prisma/client';
import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Edit, Trash2, Target, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Link from 'next/link';
import useRoutines from '@/hooks/useRoutines';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

import DeleteRoutineModal from '@/components/routines/[id]/delete/DeleteRoutineModal';
import useDeleteRoutine from '@/hooks/useDeleteRoutine';
import PaginationControls from '../Exercise/Pagination';

type RoutineWithExercises = Routine & {
  exercises: (RoutineExercise & {
    exercise: Exercise;
  })[];
};

const ITEMS_PER_PAGE = 6;

export default function RoutinesPage({ userId }: { userId: string }) {
  const { routines, isPending, setRoutines } = useRoutines(userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState<'all' | DayOfWeek>('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoutine, setSelectedRoutine] =
    useState<RoutineWithExercises | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const openDeleteModal = (routine: RoutineWithExercises) => {
    setSelectedRoutine(routine);
    setModalOpen(true);
  };

  const { deleteRoutine } = useDeleteRoutine(() => {
    setModalOpen(false);
    setSelectedRoutine(null);
    setModalOpen(false);
    setSelectedRoutine(null);
    setRoutines((prev) => prev.filter((r) => r.id !== selectedRoutine?.id));
  });

  const filteredAndSortedRoutines = useMemo(() => {
    const filtered = routines.filter((routine: RoutineWithExercises) => {
      const matchesSearch = routine.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDay =
        filterDay === 'all' || routine.daysOfWeek.includes(filterDay);
      return matchesSearch && matchesDay;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'exercises')
        return b.exercises.length - a.exercises.length;
      return 0;
    });

    return filtered;
  }, [routines, searchTerm, filterDay, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedRoutines.length / ITEMS_PER_PAGE,
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRoutines = filteredAndSortedRoutines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleFilterChange =
    (setter: (value: DayOfWeek | 'all') => void) => (value: string) => {
      setter(value as DayOfWeek | 'all');
      setCurrentPage(1);
    };

  const emptyMessage =
    routines.length === 0 ? 'You have no routines yet' : 'No routines found';

  let content;
  if (isPending) {
    content = <p className="text-center">Loading routines...</p>;
  } else if (filteredAndSortedRoutines.length === 0) {
    content = (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mb-4">
            <Target className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
          <p className="text-gray-500 mb-4">Try adjusting the search filters</p>
          <Button asChild variant="default">
            <Link href="/routines/new" className="text-white flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  } else {
    content = (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedRoutines.map((routine) => (
            <Card
              key={routine.id}
              className="flex flex-col justify-between flex-grow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{routine.name}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {routine.daysOfWeek.map((day) => (
                        <Badge
                          key={day}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Calendar className="h-3 w-3" />
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/routines/${routine.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal(routine)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <div className="space-y-4 mt-auto">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {routine.exercises.length} exercises
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/routines/${routine.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" className="flex-1 text-white" asChild>
                      <Link href={`/workout/log?routine=${routine.id}`}>
                        Use Routine
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <PaginationControls
          page={currentPage}
          totalPages={totalPages}
          nextPage={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          prevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-9 xl:px-8">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Routines
            </h1>
            <p className="text-muted-foreground">
              Manage your workout routines
            </p>
          </div>
          <Button className="text-white" asChild>
            <Link href="/routines/new">
              <Plus className="h-4 w-4 mr-2" />
              New Routine
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search routine</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-day">Day of the week</Label>
                <Select
                  value={filterDay}
                  onValueChange={handleFilterChange(setFilterDay)}
                >
                  <SelectTrigger id="filter-day" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All days</SelectItem>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="exercises">
                      Number of exercises
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Results</Label>
                <div className="text-sm text-muted-foreground pt-2">
                  {filteredAndSortedRoutines.length} routine(s) found
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <DeleteRoutineModal
          isOpen={isModalOpen}
          routine={
            selectedRoutine
              ? {
                  id: selectedRoutine.id,
                  name: selectedRoutine.name,
                  days: selectedRoutine.daysOfWeek,
                  exercises: selectedRoutine.exercises.length,
                }
              : null
          }
          onConfirm={() => {
            if (selectedRoutine) deleteRoutine(selectedRoutine.id, userId);
          }}
          onCancel={() => setModalOpen(false)}
        />

        {content}
      </main>
    </div>
  );
}
