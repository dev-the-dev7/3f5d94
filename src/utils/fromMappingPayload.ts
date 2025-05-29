import type { MappingEntry } from '@types';

// Converts a flat array of mapping entries into a structured object
// where each target node ID maps to its fields and their source form/field IDs.
export function fromMappingPayload(payload: MappingEntry[]) {
  const structured: Record<string, Record<string, { formId: string; fieldId: string } | null>> = {};
  for (const entry of payload) {
    if (!structured[entry.targetNodeId]) {
      structured[entry.targetNodeId] = {};
    }
    structured[entry.targetNodeId][entry.targetFieldId] = {
      formId: entry.sourceFormId,
      fieldId: entry.sourceFieldId,
    };
  }
  return structured;
}
