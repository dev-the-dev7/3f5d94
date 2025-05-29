export interface FormField {
  id: string;
  name: string;
  type: string;
  avantos_type: string;
  format?: string;
  items?: {
    type: string;
    enum?: any[];
  };
}

export interface RawForm {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: {
    properties: Record<
      string,
      { type: string; title?: string; avantos_type?: string; format?: string }
    >;
  };
  ui_schema: {
    elements: Array<{ type: string; scope: string; label?: string }>;
  };
}

export interface DataSource {
  id: string;
  label: string;
  isGlobal: boolean;
  getFields: () => Promise<FormField[]>;
}

export interface MappingEntry {
  targetNodeId: string;
  targetFieldId: string;
  sourceFormId: string;
  sourceFieldId: string;
}
