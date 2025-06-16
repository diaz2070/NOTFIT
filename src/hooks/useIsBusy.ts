export default function useIsBusy(...flags: boolean[]) {
  return flags.some(Boolean);
}
