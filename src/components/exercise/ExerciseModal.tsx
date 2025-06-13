'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useFilteredExercises from '@/hooks/useFilteredExercises';
import { Exercise } from '@prisma/client';
import {
  ExerciseCategoryEnum,
  MuscleTargetEnum,
} from '@/utils/validators/filteredExerciseSchema';
import { Loader2, CircleX } from 'lucide-react';
import ExerciseFiltersPanel from './ExerciseFiltersPanel';
import ExerciseList from './ExerciseList';
import ExerciseDetail from './ExerciseDetail';
import { ScrollArea } from '../ui/scroll-area';

interface ExerciseBrowserModalProps {
  children: React.ReactNode;
  onExerciseSelect?: (exercise: Exercise) => void;
}

export default function ExerciseModal({
  children,
  onExerciseSelect,
}: Readonly<ExerciseBrowserModalProps>) {
  const [open, setOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const categoryOptions = ExerciseCategoryEnum.options;
  const muscleOptions = MuscleTargetEnum.options;
  const {
    exercises,
    filters,
    updateFilter,
    clearFilters,
    isPending,
    totalPages,
    nextPage,
    prevPage,
  } = useFilteredExercises(open);

  const toggleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const alreadySelected = prev.find((e) => e.id === exercise.id);
      if (alreadySelected) {
        return prev.filter((e) => e.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      clearFilters();
      setSelectedExercises([]);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1152px] max-h-[85vh] p-3 xs:p-0 overflow-hidden">
        <ScrollArea>
          <DialogHeader className="p-6 pb-3 border-b-3 border-primary">
            <DialogTitle className="text-2xl">Explore exercises</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row h-full max-h-[70vh]">
            <ExerciseFiltersPanel
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              categoryOptions={categoryOptions}
              muscleOptions={muscleOptions}
              page={filters.page}
              totalPages={totalPages}
              nextPage={nextPage}
              prevPage={prevPage}
            />

            {isPending && (
              <div className="flex-1 flex justify-center items-center py-5 sm:p-0">
                <div className="flex flex-col items-center  justify-center h-full">
                  <Loader2
                    size={30}
                    data-testid="loader-icon"
                    className="animate-spin"
                  />
                  <p className="text-2xl">Loading exercises...</p>
                </div>
              </div>
            )}

            {exercises.length === 0 && !isPending && (
              <div className="flex-1 flex justify-center items-center py-5 sm:p-0">
                <div className="flex flex-col items-center  justify-center h-full gap-2">
                  <CircleX size={50} />
                  <p className="text-lg text-muted-foreground">
                    No exercises found
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Please try again later or adjust your filters.
                  </p>
                </div>
              </div>
            )}

            {!isPending && exercises && exercises.length > 0 && (
              <div className="flex-1 flex flex-col lg:flex-row">
                {/* // <div className="flex-1 grid grid-cols-1 lg:grid-cols-2"> */}
                <div className="lg:w-1/2 p-2 sm:p-4">
                  <ExerciseList
                    exercises={exercises}
                    selectedExercises={selectedExercises}
                    onToggleSelect={toggleExerciseSelection}
                    page={filters.page}
                    totalPages={totalPages}
                    nextPage={nextPage}
                    prevPage={prevPage}
                  />
                </div>

                <div className="lg:w-1/2 p-4 border-t-2 sm:border-l border-border">
                  <ExerciseDetail
                    exercise={
                      selectedExercises[selectedExercises.length - 1] ?? null
                    }
                    onSelectConfirm={() => {
                      if (selectedExercises.length) {
                        selectedExercises.forEach((exercise) =>
                          onExerciseSelect?.(exercise),
                        );
                        setOpen(false);
                        setSelectedExercises([]);
                      }
                    }}
                    selectedExercisesCount={selectedExercises.length}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
