import type { DataSource } from '@types';
import { createFormField, createDataSource } from '@test/mockFactory';

// mock implementation for fetching global sources
// In a real application, this would make an API call to fetch global sources or be set from a context
export async function fetchGlobalSources(): Promise<DataSource[]> {
  return [
    createDataSource(
      'global-fields',
      'Global Fields',
      'Global',
      async () => [
        createFormField('global-field-1', 'Global User ID', 'string', 'short-text'),
        createFormField('global-field-2', 'Global Timestamp', 'string', 'date-time', 'date-time'),
      ]
    ),
  ];
}
