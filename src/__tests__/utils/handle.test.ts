import handleError from '@/utils/handle';

describe('handleError', () => {
  it('returns message from Error instance', () => {
    const error = new Error('Something failed');
    const result = handleError(error);

    expect(result.status).toBe(500);
    expect(result.errorMessage).toBe('Something failed');
  });

  it('returns default message for non-Error values', () => {
    const result1 = handleError('just a string');
    const result2 = handleError(404);
    const result3 = handleError(null);
    const result4 = handleError(undefined);

    const defaultMsg = 'An unexpected error occurred';

    [result1, result2, result3, result4].forEach((res) => {
      expect(res.status).toBe(500);
      expect(res.errorMessage).toBe(defaultMsg);
    });
  });
});
