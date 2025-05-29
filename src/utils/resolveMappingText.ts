import type { DataSource } from '@types';

// Constructs a string that describes the mapping of a field in a form
// from a source field, including the original title of the source and the field label.
export async function resolveMappingText(
  originalTitle: string,
  mapping: { formId: string; fieldId: string },
  sources: DataSource[]
): Promise<string> {
  const { formId, fieldId } = mapping;
  const src = sources.find((s) => s.id === formId);

  let label = fieldId;
  if (src) {
    const fields = await src.getFields();
    const field = fields.find((f) => f.id === fieldId);
    label = field?.name || fieldId;
  }

  return `${originalTitle}: ${src?.label}.${label}`;
}
