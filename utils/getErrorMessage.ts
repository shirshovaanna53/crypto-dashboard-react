export function getErrorMessage(err: unknown): string {
  const data = (err as { data?: { error?: string } })?.data;
  return data?.error ?? 'Something went wrong. Please try again.';
}
