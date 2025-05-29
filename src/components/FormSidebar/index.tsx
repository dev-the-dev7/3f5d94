import type { FormNode } from '@types';
import './FormSidebar.css';

interface Props {
  nodes: FormNode[];
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * FormSidebar Component
 * Displays a sidebar with a list of form nodes.
 * Highlights the selected node and allows selection via `onSelect`.
 *
 * @param {FormNode[]} nodes - Array of form nodes to display.
 * @param {string | null} selectedNodeId - The currently selected node's ID.
 * @param {function} onSelect - Function to handle node selection.
 */
export default function FormSidebar({ nodes, selectedNodeId, onSelect }: Props) {
  return (
    <div className="sidebar">
      <h1>Forms</h1>
      {nodes
      .slice()
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((n) => (
        <div
          key={n.id}
          className={n.id === selectedNodeId ? 'item selected' : 'item'}
          onClick={() => onSelect(n.id)}
        >
          {n.data.name}
        </div>
      ))}
    </div>
  );
}
