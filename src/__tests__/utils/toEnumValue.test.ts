import toEnumValue from '@/utils/enum';

const TestColorValues = {
  Red: 'red',
  Green: 'green',
  Blue: 'blue',
} as const;

describe('toEnumValue', () => {
  it('returns the correct enum value when valid', () => {
    expect(toEnumValue('red', TestColorValues)).toBe('red');
    expect(toEnumValue('green', TestColorValues)).toBe('green');
    expect(toEnumValue('blue', TestColorValues)).toBe('blue');
  });

  it('returns undefined for invalid values', () => {
    expect(toEnumValue('yellow', TestColorValues)).toBeUndefined();
    expect(toEnumValue('', TestColorValues)).toBeUndefined();
    expect(toEnumValue('Red', TestColorValues)).toBeUndefined(); // case-sensitive
  });
});
