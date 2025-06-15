import useIsBusy from '@/hooks/useIsBusy';

describe('useIsBusy', () => {
  it('returns false when no flags are true', () => {
    expect(useIsBusy(false, false, false)).toBe(false);
  });

  it('returns true when at least one flag is true', () => {
    expect(useIsBusy(false, true, false)).toBe(true);
  });

  it('returns true when all flags are true', () => {
    expect(useIsBusy(true, true)).toBe(true);
  });

  it('returns false when called with no arguments', () => {
    expect(useIsBusy()).toBe(false);
  });

  it('returns true when called with only one true', () => {
    expect(useIsBusy(true)).toBe(true);
  });
});
