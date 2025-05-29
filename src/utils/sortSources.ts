// Sort sources based on their label and global status,
// ensuring global sources appear first.
export function sortSources<
  T extends { label: string; isGlobal?: boolean }
>(a: T, b: T): number {
  if (a.isGlobal && !b.isGlobal) return -1;
  if (!a.isGlobal && b.isGlobal) return 1;
  return a.label.localeCompare(b.label);
}
