import { useEffect, useState } from 'react';
import type { FormNode, Edge, RawForm, MappingEntry, DataSource } from '@types';
import { fetchPackage, fetchGlobalSources, fetchMappings, saveMappings } from '@api';
import { fromMappingPayload } from '@utils';
import FormSidebar from '@components/FormSidebar';
import FormView from '@components/FormView';
import './App.css';

/**
 * App Component
 * This is the main entry point for the form editor application.
 * It fetches the initial package data, global sources, and saved mappings,
 * and manages the state of nodes, edges, forms, and mappings.
 */
export default function App() {
  const [nodes, setNodes] = useState<FormNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [forms, setForms] = useState<RawForm[]>([]);
  const [globalSources, setGlobalSources] = useState<DataSource[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mapping, setMapping] = useState<
    Record<string, Record<string, { formId: string; fieldId: string } | null>>
  >({});

  // Load package + globals
  useEffect(() => {
    (async () => {
      try {
        const [{ nodes, edges, forms }, globals, savedMappings] = await Promise.all([
          fetchPackage(),
          fetchGlobalSources(),
          fetchMappings(),
        ]);
        const sorted = nodes.slice().sort((a, b) =>
          a.data.name.localeCompare(b.data.name)
        );

        setNodes(sorted);
        setEdges(edges);
        setForms(forms);
        setGlobalSources(globals);
        setSelectedNodeId(sorted[0]?.id);

        // Build initial mapping from saved data
        const restoredMapping = fromMappingPayload(savedMappings);
        setMapping(restoredMapping);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Save mapping entries to the backend
  const handleSaveMappings = async () => {
    const confirm = window.confirm(
      'Are you sure you want to overwrite the current mappings?'
    );
    if (!confirm) return;

    const payload: MappingEntry[] = Object.entries(mapping).flatMap(
      ([targetNodeId, fields]) =>
        Object.entries(fields)
          .filter(([, val]) => val !== null)
          .map(([targetFieldId, val]) => ({
            targetNodeId,
            targetFieldId,
            sourceFormId: val!.formId,
            sourceFieldId: val!.fieldId,
          }))
    );

    try {
      await saveMappings(payload);
      alert('Mappings saved to server!');
    } catch (error) {
      console.error('Error saving mappings:', error);
      alert('Failed to save mappings');
    }
  };

  if (!nodes.length || !selectedNodeId) return <div className="loading">Loading…</div>;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)!;

  return (
    <div className="app-container">
      <FormSidebar
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelect={setSelectedNodeId}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <FormView
          node={selectedNode}
          nodes={nodes}
          forms={forms}
          edges={edges}
          globalSources={globalSources}
          mapping={mapping[selectedNode.id] || {}}
          onUpdateMapping={(
            tgtNodeId, tgtFieldId, srcFormId, srcFieldId
          ) =>
            setMapping((m) => ({
              ...m,
              [tgtNodeId]: {
                ...m[tgtNodeId],
                [tgtFieldId]: { formId: srcFormId, fieldId: srcFieldId },
              },
            }))
          }
          onClearMapping={(tgtNodeId, tgtFieldId) =>
            setMapping((m) => ({
              ...m,
              [tgtNodeId]: {
                ...m[tgtNodeId],
                [tgtFieldId]: null,
              },
            }))
          }
        />
        <button onClick={handleSaveMappings} className="save-mappings-button">Save Mappings</button>
      </div>
    </div>
  );
}
