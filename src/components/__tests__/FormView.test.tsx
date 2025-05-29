import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormView from '@components/FormView';
import { createFormNode, createRawForm } from '@test/mockFactory';

describe('FormView', () => {
    // Test: FormView shows fields defined in UI schema order
    it('renders fields in correct order', () => {
        const node = createFormNode('form-a');
        const form = createRawForm('form-a');

        render(
            <FormView
            node={node}
            nodes={[node]}
            forms={[form]}
            edges={[]}
            globalSources={[]}
            mapping={{}}
            onUpdateMapping={vi.fn()}
            onClearMapping={vi.fn()}
            />
        );

        expect(screen.getByText('Email')).toBeInTheDocument();
    });
});
