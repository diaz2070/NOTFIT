export default function Spinner({ size = 20 }: Readonly<{ size?: number }>) {
  return (
    <div
      data-testid="spinner"
      className="animate-spin rounded-full border-2 border-muted border-t-primary"
      style={{
        width: size,
        height: size,
        borderTopColor: 'currentColor',
      }}
    />
  );
}
