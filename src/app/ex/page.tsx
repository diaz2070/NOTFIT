'use client';

import Modal from '@/components/Exercise/ExerciseModal';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Exercise } from '@prisma/client';
import { Plus } from 'lucide-react';

function Ex() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const onExerciseSelect = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      if (prev.find((e) => e.id === exercise.id)) return prev;
      return [...prev, exercise];
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg mb-4">
        Selected Exercise:{' '}
        {selectedExercises.length > 0
          ? selectedExercises.map((e) => e.name).join(', ')
          : 'None selected'}
      </p>
      <Modal onExerciseSelect={onExerciseSelect}>
        <Button
          type="button"
          variant="default"
          className="font-[family-name:var(--font-lemon)]"
        >
          <Plus />
          Add Exercise
        </Button>
      </Modal>
    </div>
  );
}

export default Ex;
