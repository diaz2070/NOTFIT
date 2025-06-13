import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Exercise } from '@prisma/client';
import { Eye } from 'lucide-react';
import formatLabel from '@/utils/formatLabel';
import ExerciseBadge from './ExerciseBadge';

interface ExerciseDetailProps {
  exercise: Exercise | null;
  onSelectConfirm: () => void;
}

export default function ExerciseDetail({
  exercise,
  onSelectConfirm,
}: Readonly<ExerciseDetailProps>) {
  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Select an exercise to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4 space-y-4">
      <div className="mb-2">
        <Image
          src={exercise.imageUrl || '/placeholder.svg'}
          // src="/placeholder.png"
          alt={exercise.name}
          width={300}
          height={200}
          className="w-full rounded-lg object-cover shadow-gray-500 shadow-md"
        />
      </div>

      <div className="">
        <h3 className="text-xl font-bold">
          {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
        </h3>
        <p className="text-muted-foreground mt-1">{exercise.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <ExerciseBadge label={exercise.category} colorCategory />
      </div>

      <div className="mb-2">
        <h4 className="font-semibold mb-2">Target Muscle</h4>
        <div className="flex flex-wrap gap-1">
          {exercise.primaryMuscles.map((muscle) => (
            <ExerciseBadge
              key={muscle}
              label={formatLabel(muscle)}
              variant="secondary"
              colorCategory
            />
          ))}
        </div>
      </div>

      {exercise.secondaryMuscles.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Secondary Muscles</h4>
          <div className="flex flex-wrap gap-1">
            {exercise.secondaryMuscles.map((muscle) => (
              <ExerciseBadge
                key={muscle}
                label={formatLabel(
                  muscle.charAt(0).toUpperCase() + muscle.slice(1),
                )}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2">Instrucciones</h4>
        <ol className="space-y-3 text-sm">
          {exercise.instructions.map((instruction, i) => (
            <li key={instruction} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-lighter text-white rounded-full flex justify-center items-center text-sm font-medium">
                {i + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="pt-4">
        <Button onClick={onSelectConfirm} className="w-full">
          Select exercise
        </Button>
      </div>
    </ScrollArea>
  );
}
