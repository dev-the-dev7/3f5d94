import { useMemo } from 'react';
import type { FormNode, RawForm, Edge, DataSource } from '@types';
import MappingPill from '@components/MappingPill';
import './FormView.css';

interface Props {
  node: FormNode;
  nodes: FormNode[];
  forms: RawForm[];
  edges: Edge[];
  globalSources: DataSource[];
  mapping: Record<string, { formId: string; fieldId: string } | null>;
  onUpdateMapping: (
    tgtNodeId: string,
    tgtFieldId: string,
    srcFormId: string,
    srcFieldId: string
  ) => void;
  onClearMapping: (tgtNodeId: string, tgtFieldId: string) => void;
}

/**
 * FormView Component
 * Displays a form's fields and allows mapping to data sources.
 * This component renders a list of fields from the selected form node,
 * 
 * @param {FormNode} node - The current form node being viewed.
 * @param {FormNode[]} nodes - All form nodes in the graph.
 * @param {RawForm[]} forms - All available forms with metadata.
 * @param {Edge[]} edges - All edges in the graph.
 * @param {DataSource[]} globalSources - Global data sources available for mapping.
 * @param {Record<string, { formId: string; fieldId: string } | null>} mapping - Current field mappings.
 * @param {function} onUpdateMapping - Callback to update a field mapping.
 * @param {function} onClearMapping - Callback to clear a field mapping.
 */
export default function FormView({
  node,
  nodes,
  forms,
  edges,
  globalSources,
  mapping,
  onUpdateMapping,
  onClearMapping,
}: Props) {
  // Find full RawForm metadata by matching component_id
  const formMeta = useMemo(
    () => forms.find((f) => f.id === node.data.component_id),
    [forms, node.data.component_id]
  );
  if (!formMeta) return <div className="editor">Form metadata not found.</div>;

  // Build ordered fields list
  const orderedFields = useMemo(() => {
    // flat list
    const flat = Object.entries(formMeta.field_schema.properties).map(
      ([id, schema]) => ({ id, title: schema.title || id, type: schema.type })
    );
    // order by ui_schema.elements
    return formMeta.ui_schema.elements
      .filter((el) => el.type === 'Control' && el.scope)
      .map((el) => {
        const fid = el.scope.replace('#/properties/', '');
        return flat.find((f) => f.id === fid)!;
      })
      .filter(Boolean);
  }, [formMeta]);

  return (
    <div className="editor">
      <h1>Prefill Mapper</h1>
      <div>
        <h3>{formMeta.name}</h3>
        {orderedFields.map((field) => (
          <MappingPill
            key={field.id}
            node={node}
            nodes={nodes}
            forms={forms}
            edges={edges}
            globalSources={globalSources}
            fieldId={field.id}
            currentMapping={mapping[field.id] || null}
            onUpdateMapping={onUpdateMapping}
            onClearMapping={onClearMapping}
          />
        ))}
      </div>
    </div>
  );
}
