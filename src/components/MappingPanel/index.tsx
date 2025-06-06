import { useState } from 'react';
import type { FormNode, RawForm, Edge, DataSource } from '@types';
import { useAccordionSources } from '@hooks';
import { sortSources } from '@utils';
import './MappingPanel.css';

interface MappingModalProps {
  open: boolean;
  targetNode: FormNode;
  targetFieldTitle: string;
  targetFieldAvantosType: string;
  targetFieldItems?: { type: string; enum?: any[] };
  nodes: FormNode[];
  forms: RawForm[];
  edges: Edge[];
  globalSources: DataSource[];
  onClose: () => void;
  onSelectMapping: (sourceFormId: string, sourceFieldId: string) => void;
}

/**
 * MappingPanel Component
 * Displays a modal for mapping a target field to a source field.
 * This component allows users to select a source field from available data sources
 *
 * @param {boolean} open - Whether the modal is open.
 * @param {FormNode} targetNode - The node containing the target field.
 * @param {string} targetFieldTitle - The title of the target field.
 * @param {string} targetFieldAvantosType - The Avantos type of the target field.
 * @param {Object} targetFieldItems - Optional items definition for array types.
 * @param {FormNode[]} nodes - All form nodes in the graph.
 * @param {RawForm[]} forms - All available forms with metadata.
 * @param {Edge[]} edges - All edges in the graph.
 * @param {DataSource[]} globalSources - Global data sources available for mapping.
 * @param {function} onClose - Callback to close the modal.
 * @param {function} onSelectMapping - Callback when a source field is selected.
 */
export default function MappingModal({
  open,
  targetNode,
  targetFieldTitle,
  targetFieldAvantosType,
  targetFieldItems,
  nodes,
  forms,
  edges,
  globalSources,
  onClose,
  onSelectMapping,
}: MappingModalProps) {
  // States for which item is selected in the list
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const handleClose = () => {
    setSelectedSource(null);
    setSelectedField(null);
    closeAllSections();
    onClose();
  };

  // Pull out sources, expanded flags, cached fields, and toggle function
  const {
    sources,
    expanded,
    fieldsCache,
    toggleSection,
    closeAllSections,
  } = useAccordionSources(
    targetNode,
    nodes,
    edges,
    forms,
    globalSources
  );

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="mapping-modal__overlay" onClick={handleClose} />

      {/* Side panel */}
      <div className={'mapping-modal__panel open'} >
        <div className="mapping-modal__content">
          <h2 style={{ marginTop: 0 }}>Map “{targetFieldTitle}”</h2>
          <h4 style={{ margin: '8px 0' }}>Available Data</h4>

          {sources.sort(sortSources).map((src) => {
            const isOpen = !!expanded[src.id];
            const options = fieldsCache[src.id] || [];
            
            return (
              <div key={src.id} style={{ marginBottom: 12 }}>
                {/* Accordion header */}
                <div
                  onClick={() => toggleSection(src.id)}
                  className={`accordion-header ${isOpen ? 'open' : ''}`}
                >
                  <span>{src.label}</span>
                  <span className="arrow" />
                </div>
                {/* Accordion content */}
                {isOpen && (
                  <ul className="mapping-modal__accordion-list">
                    {options
                      .filter((f) => {
                        if (f.avantos_type !== targetFieldAvantosType) return false;
                        if (targetFieldAvantosType === 'array') {
                          const fi = f.items, ti = targetFieldItems;
                          if (!fi || !ti) return false;
                          if (fi.type !== ti.type) return false;
                          const a = Array.isArray(fi.enum)
                            ? JSON.stringify([...fi.enum].sort())
                            : '';
                          const b = Array.isArray(ti.enum)
                            ? JSON.stringify([...ti.enum].sort())
                            : '';
                          if (a !== b) return false;
                        }
                        return true;
                      })
                      .map((f) => {
                        const isSel =
                          src.id === selectedSource &&
                          f.id === selectedField;
                        return (
                          <li
                            key={`${src.id}-${f.id}`}
                            className="mapping-modal__accordion-item"
                          >
                            <button
                              onClick={() => {
                                setSelectedSource(src.id);
                                setSelectedField(f.id);
                              }}
                              className={`mapping-modal__accordion-button ${
                                isSel
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              {f.name}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mapping-modal__footer">
          <button
            onClick={handleClose}
            className="mapping-modal__button mapping-modal__button--cancel"
          >
            Cancel
          </button>
          <button
            disabled={!selectedSource || !selectedField}
            onClick={() => {
              if (selectedSource && selectedField) {
                onSelectMapping(selectedSource, selectedField);
                handleClose();
              }
            }}
            className="mapping-modal__button mapping-modal__button--select"
          >
            Select
          </button>
        </div>
      </div>
    </>
  );
}
