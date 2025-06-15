import { renderHook, act } from '@testing-library/react';
import useWorkoutLog from '@/hooks/useWorkoutLog';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { RoutineWithExercises } from '@/types/routine';
import {
  pauseWorkoutLog,
  resumeWorkoutLog,
  deleteWorkoutLog,
  saveWorkoutLog,
} from '@/actions/workoutLog';
import isWorkoutValid from '@/utils/validators/workout';

jest.mock('js-cookie');
jest.mock('sonner');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/utils/validators/workout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

let mockWorkoutStatus = 'IN_PROGRESS';
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockDiscard = jest.fn();
const mockDelete = jest.fn();
const mockSave = jest.fn();
let callCounter = 0;

jest.mock('@/hooks/useLogAPIResponse', () => {
  return {
    __esModule: true,
    default: (fn: unknown) => {
      switch (fn) {
        case pauseWorkoutLog:
          return { isPending: false, mutate: mockPause };
        case resumeWorkoutLog:
          return { isPending: false, mutate: mockResume };
        case saveWorkoutLog:
          return { isPending: false, mutate: mockSave };
        case deleteWorkoutLog:
          callCounter += 1;
          return callCounter - 1 === 0
            ? { isPending: false, mutate: mockDiscard }
            : { isPending: false, mutate: mockDelete };
        default:
          return { isPending: false, mutate: jest.fn() };
      }
    },
  };
});

jest.mock('@/hooks/useWorkoutLogState', () => () => ({
  workoutStatus: mockWorkoutStatus,
  pausedAt: null,
  logId: 'log123',
  selectedRoutine: 'routine1',
  startTime: new Date('2023-01-01T10:00:00Z'),
  generalNotes: 'note',
  workoutData: [{ dummy: true }],
  setWorkoutStatus: jest.fn(),
  setPausedAt: jest.fn(),
  setLogId: jest.fn(),
  setSelectedRoutine: jest.fn(),
  setStartTime: jest.fn(),
  setGeneralNotes: jest.fn(),
  setWorkoutData: jest.fn(),
  resetLogState: jest.fn(),
}));

jest.mock('@/hooks/useWorkoutLogController', () => () => ({
  updateSet: jest.fn(),
  toggleSetComplete: jest.fn(),
  getCompletedSets: jest.fn(),
  getTotalCompletedSets: jest.fn(),
  getTotalSets: jest.fn(),
}));

jest.mock('@/hooks/useRoutineSelection', () => () => ({
  handleRoutineSelect: jest.fn(),
}));

jest.mock('@/hooks/useHandleRestoredLog', () => jest.fn());
jest.mock('@/hooks/useIsBusy', () => jest.fn(() => false));

describe('useWorkoutLog full test', () => {
  const mockRoutines: RoutineWithExercises[] = [
    {
      id: 'routine-1',
      name: 'Push Day',
      daysOfWeek: ['Monday', 'Thursday'],
      exercises: [],
      userId: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      description: 'Chest, shoulders and triceps',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (isWorkoutValid as jest.Mock).mockReturnValue(true);
    mockWorkoutStatus = 'IN_PROGRESS';
    callCounter = 0;
  });

  it('calls handlePauseWorkout and updates state', async () => {
    mockPause.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handlePauseWorkout({
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.MouseEvent);
    });

    expect(mockPause).toHaveBeenCalled();
  });

  it('calls handleResumeWorkout and updates status', async () => {
    mockResume.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleResumeWorkout({
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.MouseEvent);
    });

    expect(mockResume).toHaveBeenCalledWith('log123');
  });

  it('calls handleChangeRoutine and resets log', async () => {
    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleChangeRoutine();
    });

    expect(Cookies.remove).toHaveBeenCalledWith('activeWorkoutLogId');
    expect(mockDiscard).toHaveBeenCalledWith('log123');
  });

  it('calls handleDiscard and deletes log', async () => {
    mockDelete.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleDiscard();
    });

    expect(Cookies.remove).toHaveBeenCalledWith('activeWorkoutLogId');
    expect(mockDelete).toHaveBeenCalledWith('log123');
  });

  it('submits valid workout and navigates on success', async () => {
    mockSave.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() =>
      useWorkoutLog(mockRoutines, {
        status: 200,
        errorMessage: '',
        data: null,
      }),
    );
    await act(async () => {
      await result.current.handlers.handleSubmitLog({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(mockSave).toHaveBeenCalled();
    expect(Cookies.remove).toHaveBeenCalledWith('activeWorkoutLogId');
  });

  it('shows warning if workout is paused', async () => {
    mockWorkoutStatus = 'PAUSED';

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleSubmitLog({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(toast.warning).toHaveBeenCalledWith(
      'Cannot finish a paused workout. Resume it first.',
    );
  });

  it('shows error if workout is invalid', async () => {
    (isWorkoutValid as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleSubmitLog({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Please complete all sets with valid reps and weight.',
    );
  });

  it('shows error toast on save failure', async () => {
    mockSave.mockResolvedValue({
      status: 500,
      errorMessage: 'DB down',
      data: null,
    });

    const { result } = renderHook(() => useWorkoutLog(mockRoutines, null));
    await act(async () => {
      await result.current.handlers.handleSubmitLog({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to save log: DB down');
  });
});
