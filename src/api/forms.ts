import type { FormNode, Edge, RawForm } from '@types';

// Fetch form data from a API endpoint
export async function fetchPackage(): Promise<{
  nodes: FormNode[];
  edges: Edge[];
  forms: RawForm[];
}> {
  console.log('→ fetchPackage: calling API…');
  const res = await fetch(
    'http://localhost:3000/api/v1/mock/actions/blueprints/test/graph'
  );
  console.log('→ fetchPackage: got response', res.status);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const json = await res.json();
  console.log('→ fetchPackage: json payload', json);
  return {
    nodes: json.nodes || [],
    edges: json.edges || [],
    forms: json.forms || [],
  };
}
