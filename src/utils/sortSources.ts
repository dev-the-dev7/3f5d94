import type { SourceTypes } from "@types";

// Define the sorting priority
const sourceTypePriority: Record<SourceTypes, number> = {
  Global: 0,
  Transitive: 1,
  Direct: 2,
};

// Sort sources based on SourceType priority and label
export function sortSources<T extends { label: string; SourceType?: SourceTypes }>(
  a: T,
  b: T
): number {
  // Compare by source type priority first
  const typeOrderA = a.SourceType ? sourceTypePriority[a.SourceType] : Infinity;
  const typeOrderB = b.SourceType ? sourceTypePriority[b.SourceType] : Infinity;

  if (typeOrderA !== typeOrderB) {
    return typeOrderA - typeOrderB;
  }

  // If source types are the same, sort alphabetically by label
  return a.label.localeCompare(b.label);
}
