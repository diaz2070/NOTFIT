'use client';

import type React from 'react';
import type {
  RoutineWithExercises,
  WorkoutLogWithEntries,
} from '@/types/routine';
import { ApiResponse } from '@/actions/workoutLog';
import useWorkoutLog from '@/hooks/useWorkoutLog';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';

import { useRouter } from 'next/navigation';
import SelectRoutine from './SelectRoutine';
import WorkoutExerciseList from './WorkoutExerciseList';
import WorkoutProgressBar from './WorkoutProgressBar';
import PausedWarningCard from './PausedWarningCard';
import WorkoutNotesCard from './WorkoutNotesCard';
import WorkoutActionButtons from './WorkoutActionButtons';

interface LogWorkoutProps {
  routines: RoutineWithExercises[];
  restoredLog?: ApiResponse<WorkoutLogWithEntries | null> | null;
}

export default function WorkoutLogPage({
  routines,
  restoredLog = null,
}: Readonly<LogWorkoutProps>) {
  const router = useRouter();
  const isEditMode = !!restoredLog?.data;

  const {
    workoutState,
    controller,
    handlers,
    isBusy,
    availableRoutines,
    handleRoutineSelect,
  } = useWorkoutLog(routines, restoredLog);

  const {
    selectedRoutine,
    workoutStatus,
    pausedAt,
    startTime,
    workoutData,
    generalNotes,
    isSaving,
    isDeleting,
    isDiscardingRoutine,
    isResuming,
    isPausing,
  } = workoutState;

  const {
    updateSet,
    toggleSetComplete,
    getCompletedSets,
    getTotalCompletedSets,
    getTotalSets,
  } = controller;

  const {
    handleSubmitLog,
    handleChangeRoutine,
    handleDiscard,
    handlePauseWorkout,
    handleResumeWorkout,
  } = handlers;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-0 md:px-4 py-8">
        <div className="mb-8">
          <Button
            variant="link"
            asChild
            className="mb-4"
            onClick={() => router.push(isEditMode ? '/history' : '/routines')}
          >
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4" />
              <p> Back to {isEditMode ? 'History' : 'Routines'}</p>
            </div>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-lemon)]">
            {isEditMode ? 'Edit Workout' : 'Log a New Workout'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Modify the data of your past session'
              : 'Log all your session data'}
          </p>
        </div>

        {!selectedRoutine ? (
          <SelectRoutine
            handleRoutineSelect={handleRoutineSelect}
            availableRoutines={availableRoutines}
          />
        ) : (
          <form onSubmit={handleSubmitLog} className="space-y-6">
            {!isEditMode && (
              <>
                <Card>
                  <CardHeader>
                    <WorkoutProgressBar
                      status={workoutStatus}
                      startTime={startTime}
                      totalCompletedSets={getTotalCompletedSets()}
                      totalSets={getTotalSets()}
                      pausedAt={pausedAt}
                      onPause={handlePauseWorkout}
                      onResume={handleResumeWorkout}
                      isPausing={isPausing}
                      isResuming={isResuming}
                    />
                  </CardHeader>
                </Card>

                <PausedWarningCard
                  isPausing={isPausing}
                  isResuming={isResuming}
                  pausedAt={pausedAt}
                  visible={workoutStatus === 'PAUSED'}
                />
              </>
            )}

            <WorkoutExerciseList
              exercises={workoutData}
              updateSet={updateSet}
              toggleSetComplete={toggleSetComplete}
              getCompletedSets={getCompletedSets}
            />

            <WorkoutNotesCard
              notes={generalNotes}
              onChange={(note) => controller.setGeneralNotes(note)}
            />

            <WorkoutActionButtons
              isBusy={isBusy}
              isSaving={isSaving}
              isDeleting={isDeleting}
              isDiscarding={isDiscardingRoutine}
              onDiscard={() => {
                if (isEditMode) {
                  router.push('/history');
                } else {
                  handleDiscard();
                }
              }}
              {...(!isEditMode && {
                onChangeRoutine: () => {
                  handleChangeRoutine();
                },
              })}
              discardLabel={isEditMode ? 'Cancel' : undefined}
            />
          </form>
        )}
      </main>
    </div>
  );
}
