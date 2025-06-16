import { RoutineExerciseDraft } from '@/types/routine';
import isRoutineValid from '@/utils/validators/routine';

const validExercises: RoutineExerciseDraft[] = [
  {
    id: '1',
    name: 'Squat',
    sets: 3,
    reps: 12,
    weight: 100,
    notes: 'Keep back straight',
  },
];

describe('isRoutineValid', () => {
  it('returns true for valid routine data', () => {
    const result = isRoutineValid('Leg Day', ['Monday'], validExercises);
    expect(result).toBe(true);
  });

  it('returns false for empty routine name', () => {
    const result = isRoutineValid('', ['Monday'], validExercises);
    expect(result).toBe(false);
  });

  it('returns false for empty selected days', () => {
    const result = isRoutineValid('Leg Day', [], validExercises);
    expect(result).toBe(false);
  });

  it('returns false for empty exercises array', () => {
    const result = isRoutineValid('Leg Day', ['Monday'], []);
    expect(result).toBe(false);
  });

  it('returns false if exercise has invalid sets', () => {
    const invalid = [{ ...validExercises[0], sets: 0 }];
    expect(isRoutineValid('Routine', ['Monday'], invalid)).toBe(false);
  });

  it('returns false if exercise has negative weight', () => {
    const invalid = [{ ...validExercises[0], weight: -5 }];
    expect(isRoutineValid('Routine', ['Monday'], invalid)).toBe(false);
  });

  it('returns false if notes exceed 300 characters', () => {
    const invalid = [{ ...validExercises[0], notes: 'a'.repeat(301) }];
    expect(isRoutineValid('Routine', ['Monday'], invalid)).toBe(false);
  });
});
