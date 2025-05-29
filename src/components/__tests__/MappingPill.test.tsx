import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MappingPill from '@components/MappingPill';
import { createEdge, createFormNode, createRawForm } from '@test/mockFactory';

describe('FieldMapping', () => {
    // Test: Unmapped field displays its original title
    it('renders unmapped field correctly', () => {
        const node = createFormNode('node-a' , 'Form A', 'form-a');
        const forms = [createRawForm('form-a')];

        render(
        <MappingPill
            node={node}
            nodes={[node]}
            forms={forms}
            edges={[]}
            globalSources={[]}
            fieldId="email"
            currentMapping={null}
            onUpdateMapping={vi.fn()}
            onClearMapping={vi.fn()}
        />
        );

        expect(screen.getByText('Email')).to.exist;
    });

    // Test: Mapped field displays correct label
    it('renders resolved mapping text correctly when mapped', async () => {
        const node = createFormNode('node-d', 'Form D', 'form-d');
        const forms = [createRawForm('form-a'), createRawForm('form-d')];

        render(
            <MappingPill
                node={node}
                nodes={[node, createFormNode('node-a', 'Form A', 'form-a')]}
                forms={forms}
                edges={[createEdge('node-a', 'node-d')]}
                globalSources={[]}
                fieldId="email"
                currentMapping={{ formId: 'node-a', fieldId: 'email' }}
                onUpdateMapping={vi.fn()}
                onClearMapping={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Email: Form A.Email')).toBeInTheDocument();
        });
    });
});
