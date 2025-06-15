import { act, renderHook } from '@testing-library/react';
import useLogResponse from '@/hooks/useLogAPIResponse';
import { toast } from 'sonner';
import type { ApiResponse } from '@/actions/workoutLog';

// Mock de toast de 'sonner'
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSuccessResponse: ApiResponse<{ message: string }> = {
  status: 200,
  errorMessage: '',
  data: { message: 'worked' },
};

const mockErrorResponse: ApiResponse<null> = {
  status: 500,
  errorMessage: 'Server failed',
  data: null,
};

describe('useLogResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls toast.success and resolves result on success', async () => {
    const mockAction = jest
      .fn()
      .mockResolvedValue(mockSuccessResponse) as jest.MockedFunction<
      () => Promise<ApiResponse<{ message: string }>>
    >;

    const { result } = renderHook(() =>
      useLogResponse(mockAction, { success: 'Saved successfully' }),
    );

    let resolved;
    await act(async () => {
      resolved = await result.current.mutate();
    });

    expect(mockAction).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Saved successfully', {
      duration: 6000,
    });
    expect(resolved).toEqual(mockSuccessResponse);
  });

  it('calls toast.error with default message on failure', async () => {
    const mockAction = jest
      .fn()
      .mockResolvedValue(mockErrorResponse) as jest.MockedFunction<
      () => Promise<ApiResponse<null>>
    >;

    const { result } = renderHook(() => useLogResponse(mockAction));

    await act(async () => {
      await result.current.mutate();
    });

    expect(mockAction).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Error', {
      description: 'Server failed',
      duration: 6000,
    });
  });

  it('executes mutation with delay (without isPending check)', async () => {
    const delayedResolve = (
      resolve: (value: ApiResponse<{ message: string }>) => void,
    ) => {
      setTimeout(() => {
        resolve(mockSuccessResponse);
      }, 10);
    };

    const mockAction = jest.fn(
      () => new Promise<ApiResponse<{ message: string }>>(delayedResolve),
    ) as jest.MockedFunction<() => Promise<ApiResponse<{ message: string }>>>;

    const { result } = renderHook(() =>
      useLogResponse(mockAction, { success: 'Success' }),
    );

    const trigger = async () => {
      await result.current.mutate();
    };

    await act(trigger);

    expect(mockAction).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });
});
