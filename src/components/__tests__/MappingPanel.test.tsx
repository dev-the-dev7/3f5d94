import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MappingPanel from '@components/MappingPanel';
import { createFormNode, createRawForm, createEdge, createFormField } from '@test/mockFactory';

const baseProps = {
  open: true,
  targetNode: createFormNode(),
  targetFieldTitle: 'email',
  targetFieldAvantosType: 'short-text',
  nodes: [createFormNode('A'), createFormNode('B')],
  forms: [createRawForm('A'), createRawForm('B')],
  edges: [createEdge('A', 'B')],
  globalFields: [createFormField('global-field-1', 'Global Email', 'short-text')],
  onClose: vi.fn(),
  onSelectMapping: vi.fn(),
};

describe('MappingPanel', () => {
  // Test: Rendering and header display
  it('renders the mapping panel and displays the title', () => {
    render(<MappingPanel globalSources={[]} {...baseProps} />);
    expect(screen.getByText('Map “email”')).toBeInTheDocument();
  });

  // Test: Cancelling the panel calls onClose
  it('calls onClose when cancel button is clicked', () => {
    render(<MappingPanel globalSources={[]} {...baseProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  // Test: Select button is disabled when nothing is selected
  it('disables the select button if no field is selected', () => {
    render(<MappingPanel globalSources={[]} {...baseProps} />);
    expect(screen.getByText('Select')).toBeDisabled();
  });
});
