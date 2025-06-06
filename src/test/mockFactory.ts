import type { FormField, FormNode, RawForm, Edge, DataSource, SourceTypes } from '@types';

export function createFormNode(
  id = 'node-a',
  name = 'Form A',
  component_id = 'form-a'
): FormNode {
  return {
    id,
    type: 'form',
    data: {
      component_id,
      name,
    },
  };
}

export function createRawForm(
  id = 'form-a',
  name = 'Form A',
  fields: Record<string, any> = {
    email: {
      title: 'Email',
      type: 'string',
      avantos_type: 'short-text',
    },
  }
): RawForm {
  return {
    id,
    name: name,
    description: '',
    is_reusable: false,
    field_schema: {
      properties: fields,
    },
    ui_schema: {
      elements: Object.keys(fields).map((key) => ({
        type: 'Control',
        scope: `#/properties/${key}`,
        label: fields[key].title || key,
      })),
    },
  };
}

export function createEdge(source = 'form-a', target = 'form-b'): Edge {
  return { source, target };
}

export function createFormField(id = 'global-1', name = 'Global Field', type = 'string', avantos_type = 'short-text', format = ''): FormField {
  return {
    id,
    name,
    type,
    avantos_type,
    format
  };
}

export function createDataSource(
  id: string,
  label: string,
  SourceType: SourceTypes,
  getFields: () => Promise<FormField[]> = async () => []
): DataSource {
  return {
    id,
    label,
    SourceType,
    getFields,
  };
}
