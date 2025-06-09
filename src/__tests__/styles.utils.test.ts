import shadow from '@/styles/utils';

describe('shadow constant', () => {
  it('should match the expected glow shadow style', () => {
    const glowColor = 'rgba(83, 29, 165, 0.35)';
    const expectedShadow = `0 0 5px ${glowColor}, 0 0 10px ${glowColor}, 0 0 15px ${glowColor}, 0 0 20px ${glowColor}`;

    expect(shadow).toBe(expectedShadow);
  });

  it('should include the correct rgba color value', () => {
    expect(shadow).toContain('rgba(83, 29, 165, 0.35)');
  });

  it('should contain 4 glow layers', () => {
    const parts = shadow.split(/,(?= 0)/);
    expect(parts).toHaveLength(8);
  });
});
