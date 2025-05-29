import { useState, useEffect } from 'react';
import type { FormNode, RawForm, Edge, DataSource } from '@types';
import { resolveMappingText } from '@utils/resolveMappingText';
import MappingPanel from '@components/MappingPanel';
import { useAccordionSources } from '@hooks/useAccordionSources';
import './MappingPill.css';

interface Props {
  node: FormNode;
  nodes: FormNode[];
  forms: RawForm[];
  edges: Edge[];
  globalSources: DataSource[];
  fieldId: string;
  currentMapping: { formId: string; fieldId: string } | null;
  onUpdateMapping: (
    targetFormId: string,
    targetFieldId: string,
    sourceFormId: string,
    sourceFieldId: string
  ) => void;
  onClearMapping: (targetFormId: string, targetFieldId: string) => void;
}

/**
 * MappingPill Component
 * Displays a mapping pill for a specific field in a form node.
 * Allows users to view and update field mappings to data sources.
 * 
 * @param {FormNode} node - The current form node containing the field.
 * @param {FormNode[]} nodes - All form nodes in the graph.
 * @param {RawForm[]} forms - All available forms with metadata.
 * @param {Edge[]} edges - All edges in the graph.
 * @param {DataSource[]} globalSources - Global data sources available for mapping.
 * @param {string} fieldId - The ID of the field being mapped.
 * @param {Object} currentMapping - The current mapping for the field, if any.
 * @param {function} onUpdateMapping - Callback to update the field mapping.
 * @param {function} onClearMapping - Callback to clear the field mapping.
 */
export default function MappingPill({
  node,
  nodes,
  forms,
  edges,
  globalSources,
  fieldId,
  currentMapping,
  onUpdateMapping,
  onClearMapping,
}: Props) {
  const [open, setOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const rawForm = forms.find((f) => f.id === node.data.component_id);
  if (!rawForm) return null;

  const schema = rawForm.field_schema.properties[fieldId];
  if (!schema) return null;

  const originalTitle = schema.title || fieldId;
  const targetAvType = (schema as any).avantos_type;
  const targetItems = (schema as any).items;
  const { sources } = useAccordionSources(node, nodes, edges, forms, globalSources);

  useEffect(() => {
    if (currentMapping) {
      resolveMappingText(originalTitle, currentMapping, sources)
        .then((text) => setDisplayText(text));
    } else {
      setDisplayText(originalTitle);
    }
  }, [currentMapping, sources, originalTitle, forms]);

  const pillClass = [
    'field-mapping__pill',
    currentMapping ? 'mapped' : 'unmapped'
  ].join(' ');

  return (
    <>
      <div className="field-mapping">
        <span onClick={() => !currentMapping && setOpen(true)} className={pillClass}>
          {displayText}
        </span>

        {currentMapping && (
          <button onClick={() => onClearMapping(node.id, fieldId)} className="field-mapping__clear">
            ×
          </button>
        )}
      </div>

      <MappingPanel
        open={open}
        targetNode={node}
        targetFieldTitle={originalTitle}
        targetFieldAvantosType={targetAvType}
        targetFieldItems={targetItems}
        nodes={nodes}
        forms={forms}
        edges={edges}
        globalSources={globalSources}
        onClose={() => setOpen(false)}
        onSelectMapping={(srcId, srcFieldId) => {
          onUpdateMapping(node.id, fieldId, srcId, srcFieldId);
          setOpen(false);
        }}
      />
    </>
  );
}
