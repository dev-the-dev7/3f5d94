import type { MappingEntry } from '@types';
const BASE_URL = import.meta.env.VITE_API_BASE_URL; 
const MAPPINGS_ENDPOINT = `${BASE_URL}/mappings`;

// Load existing mapping configurations from server
export async function fetchMappings(): Promise<MappingEntry[]> {
  const res = await fetch(MAPPINGS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`fetchMappings failed: ${res.status}`);
  }
  return res.json();
}

// Save a list of mapping entries to the server
export async function saveMappings(payload: MappingEntry[]) {
  const res = await fetch(MAPPINGS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`saveMappings failed: ${res.status}`);
}
