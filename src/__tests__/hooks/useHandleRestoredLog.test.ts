import { renderHook } from '@testing-library/react';
import useHandleRestoredLog from '@/hooks/useHandleRestoredLog';
import transformWorkoutLogToExercises from '@/utils/transformWorkoutEntries';
import type { ApiResponse } from '@/actions/workoutLog';
import type { WorkoutLogWithEntries } from '@/types/routine';

jest.mock('@/utils/transformWorkoutEntries', () => jest.fn());

const mockSetters = {
  setWorkoutData: jest.fn(),
  setLogId: jest.fn(),
  setSelectedRoutine: jest.fn(),
  setStatus: jest.fn(),
  setPausedAt: jest.fn(),
  setNotes: jest.fn(),
  setStartTime: jest.fn(),
};

const mockLog: WorkoutLogWithEntries = {
  id: 'log1',
  userId: 'user1',
  routineId: 'routine123',
  createdAt: new Date(),
  updatedAt: new Date(),
  date: new Date(),
  startTime: new Date('2023-01-01T10:00:00Z'),
  endTime: new Date(),
  status: 'PAUSED',
  comment: 'restored',
  pausedAt: new Date('2023-01-01T10:10:00Z'),
  totalVolume: null,
  totalPaused: 0,
  entries: [],
};

describe('useHandleRestoredLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not call any setter if restoredLog is null', () => {
    renderHook(() =>
      useHandleRestoredLog({ restoredLog: null, setters: mockSetters }),
    );

    Object.values(mockSetters).forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('should call all setters with correct values if restoredLog is present', () => {
    (transformWorkoutLogToExercises as jest.Mock).mockReturnValue(['mock']);

    const restoredLog: ApiResponse<WorkoutLogWithEntries> = {
      status: 200,
      errorMessage: '',
      data: mockLog,
    };

    renderHook(() =>
      useHandleRestoredLog({ restoredLog, setters: mockSetters }),
    );

    expect(mockSetters.setLogId).toHaveBeenCalledWith('log1');
    expect(mockSetters.setSelectedRoutine).toHaveBeenCalledWith('routine123');
    expect(mockSetters.setStatus).toHaveBeenCalledWith('PAUSED');
    expect(mockSetters.setPausedAt).toHaveBeenCalledWith(
      new Date(mockLog.pausedAt!),
    );
    expect(mockSetters.setNotes).toHaveBeenCalledWith('restored');
    expect(mockSetters.setStartTime).toHaveBeenCalledWith(
      new Date('2023-01-01T10:00:00Z'),
    );
    expect(mockSetters.setWorkoutData).toHaveBeenCalledWith(['mock']);
  });

  it('should handle null pausedAt and comment', () => {
    const partialLog = { ...mockLog, pausedAt: null, comment: null };
    (transformWorkoutLogToExercises as jest.Mock).mockReturnValue([]);

    const restoredLog: ApiResponse<WorkoutLogWithEntries> = {
      status: 200,
      errorMessage: '',
      data: partialLog,
    };

    renderHook(() =>
      useHandleRestoredLog({ restoredLog, setters: mockSetters }),
    );

    expect(mockSetters.setPausedAt).toHaveBeenCalledWith(null);
    expect(mockSetters.setNotes).toHaveBeenCalledWith('');
  });
});
