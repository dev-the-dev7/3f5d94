import { describe, it, expect } from 'vitest';
import { resolveMappingText } from '@utils/resolveMappingText';
import { createFormField, createDataSource } from '@test/mockFactory';

describe('resolveMappingText', () => {
  // Test: the function returns correctly formatted text for form-based mappings
  it('returns mapping text for a form field', async () => {
    const result = resolveMappingText(
      'Email',
      { formId: 'node-a', fieldId: 'Email' },
      [
        createDataSource(
          'node-a',
          'Form A',
          'Direct',
          async () => [
            createFormField('Form-A-field-1', 'Email', 'string', 'short-text'),
          ]
        ),
      ]
    );
    await expect(result).resolves.toBe('Email: Form A.Email');
  });

  // Test: the function returns fallback field ID if field is missing
  it('falls back to fieldId if field title is not found', async () => {
    const result = resolveMappingText(
      'Email',
      { formId: 'node-a', fieldId: 'missingField' },
      [
        createDataSource(
          'node-a',
          'Form A',
          'Direct',
          async () => [
            createFormField('Form-A-field-1', 'Email', 'string', 'short-text'),
          ]
        ),
      ]
    );
    await expect(result).resolves.toBe('Email: Form A.missingField');
  });

  // Test: the function returns global label correctly
  it('returns mapping text for a global field', async () => {
    const result = resolveMappingText(
      'Timestamp',
      { formId: 'global-id', fieldId: 'Global Timestamp' },
      [
        createDataSource(
          'global-id',
          'Global Field',
          'Global',
          async () => [
            createFormField('global-field-1', 'Global Timestamp', 'string', 'date-time', 'date-time'),
          ]
        ),
      ]
    );
    await expect(result).resolves.toBe('Timestamp: Global Field.Global Timestamp');
  });

  // Test: fallback when global field name is missing
  it('falls back to fieldId if global field is not found', async () => {
    const result = resolveMappingText(
      'Timestamp',
      { formId: 'global-id', fieldId: 'missing-global' },
      [
        createDataSource(
          'global-id',
          'Global Field',
          'Global',
          async () => [
            createFormField('global-field-1', 'Global Timestamp', 'string', 'date-time', 'date-time'),
          ]
        ),
      ]
    );
    await expect(result).resolves.toBe('Timestamp: Global Field.missing-global');
  });
});
