import React from 'react';
import { Button } from '../ui/button';
import Spinner from '../ui/spinner';

interface WorkoutActionButtonsProps {
  isBusy: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isDiscarding: boolean;
  onChangeRoutine: () => void;
  onDiscard: () => void;
}

function WorkoutActionButtons({
  isBusy,
  isSaving,
  isDeleting,
  isDiscarding,
  onChangeRoutine,
  onDiscard,
}: Readonly<WorkoutActionButtonsProps>) {
  return (
    <div className="flex gap-4 items-center justify-between flex-wrap-reverse">
      <Button
        type="submit"
        className="flex-1 font-[family-name:var(--font-lemon)]"
        disabled={isBusy}
      >
        {isSaving && <Spinner size={16} />}
        Finish Workout
      </Button>
      <div className="flex-1 flex gap-4 ">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onChangeRoutine}
          disabled={isBusy}
        >
          {isDiscarding && <Spinner size={16} />}
          Change Routine
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1"
          onClick={onDiscard}
          disabled={isBusy}
        >
          {isDeleting && <Spinner size={16} />}
          Discard
        </Button>
      </div>
    </div>
  );
}

export default WorkoutActionButtons;
