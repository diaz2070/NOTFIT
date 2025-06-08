const handleError = (
  error: unknown,
): { status: number; errorMessage: string } => {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  return { status: 500, errorMessage: message };
};

export default handleError;
