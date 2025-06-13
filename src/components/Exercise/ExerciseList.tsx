import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Exercise } from '@prisma/client';
import getCategoryColor from '@/utils/getCategoryColor';
import formatLabel from '@/utils/formatLabel';
import PaginationControls from './Pagination';

interface ExerciseListProps {
  exercises: Exercise[];
  selectedExercises: Exercise[];
  onToggleSelect: (exercise: Exercise) => void;
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}

export default function ExerciseList({
  exercises,
  selectedExercises,
  onToggleSelect,
  page,
  totalPages,
  nextPage,
  prevPage,
}: Readonly<ExerciseListProps>) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-2">
        {exercises.map((exercise) => {
          const isSelected = selectedExercises.some(
            (e) => e.id === exercise.id,
          );
          return (
            <Card
              key={exercise.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-3 ring-primary' : ''
              } `}
              onClick={() => onToggleSelect(exercise)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Image
                    src={exercise.imageUrl || '/placeholder.png'}
                    alt={exercise.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {exercise.name.charAt(0).toUpperCase() +
                        exercise.name.slice(1)}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {exercise.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getCategoryColor(exercise.category)}`}
                      >
                        {formatLabel(exercise.category)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex md:hidden justify-center p-3 py-4">
        <PaginationControls
          page={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
    </ScrollArea>
  );
}
