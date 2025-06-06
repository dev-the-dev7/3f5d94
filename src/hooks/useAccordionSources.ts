import { useState, useMemo } from 'react';
import type { FormNode, Edge, RawForm, FormField, DataSource } from '@types';

export function useAccordionSources(
  targetNode: FormNode,
  nodes: FormNode[],
  edges: Edge[],
  forms: RawForm[],
  globalFields: DataSource[]
) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fieldsCache, setFieldsCache] = useState<Record<string, FormField[]>>({});

  // Compute all ancestor nodes
  const ancestorNodes: FormNode[] = useMemo(() => {
    const parentMap: Record<string, string[]> = {};
    edges.forEach((e) => {
      parentMap[e.target] = (parentMap[e.target] || []).concat(e.source);
    });

    const seen = new Set<string>();

    function dfs(id: string) {
      if (seen.has(id)) return;
      seen.add(id);
      (parentMap[id] || []).forEach(dfs);
    }

    dfs(targetNode.id);

    return Array.from(seen)
      .filter((nid) => nid !== targetNode.id)
      .map((nid) => nodes.find((n) => n.id === nid))
      .filter((n): n is FormNode => Boolean(n));
  }, [edges, nodes, targetNode.id]);

  // Build global + ancestor sources
  const sources: DataSource[] = useMemo(() => {
    const parentMap: Record<string, string[]> = {};
  
  // Build parent mapping
  edges.forEach((e) => {
    parentMap[e.target] = (parentMap[e.target] || []).concat(e.source);
  });

  // Track levels of ancestry
  const ancestorLevels: Record<string, number> = {};
  
  function dfs(id: string, level = 0) {
    if (ancestorLevels[id] !== undefined) return;
    ancestorLevels[id] = level;
    
    (parentMap[id] || []).forEach((parentId) => {
      dfs(parentId, level + 1);
    });
  }

  dfs(targetNode.id); // Start DFS traversal

  const parentSrcs: DataSource[] = Object.entries(ancestorLevels)
    .filter(([nid]) => nid !== targetNode.id)
    .map(([nid, level]) => {
      const node = nodes.find((n) => n.id === nid);
      if (!node) return null;

      return {
        id: node.id,
        label: node.data.name,
        SourceType: level === 1 ? "Direct" : "Transitive",
        getFields: () => getFormFields(node, nodes, edges, forms),
      };
    })
    .filter((n): n is DataSource => Boolean(n));

    // filter by query parameter
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const sourceTypes = searchParams.get("Datasource")?.split(',');
    const sources = [...globalFields, ...parentSrcs];
    return sourceTypes == undefined ? sources : sources.filter(src => sourceTypes?.includes(src.SourceType));
  }, [globalFields, ancestorNodes, nodes, edges, forms]);

  // Walk the DAG edges upstream from node.id
  // and pulls fields from each ancestor’s JSON‐schema
  async function getFormFields(
    node: FormNode,
    allNodes: FormNode[],
    edges: Edge[],
    formMetadata: RawForm[]
  ): Promise<FormField[]> {
    // Build parent map
    const parentMap: Record<string, string[]> = {};
    edges.forEach((e) => {
      parentMap[e.target] = (parentMap[e.target] || []).concat(e.source);
    });

    // DFS from *this* node plus all upstream nodes
    const visited = new Set<string>();
    // *** add the node itself so its fields appear ***
    visited.add(node.id);

    (function dfs(curr: string) {
      (parentMap[curr] || []).forEach((pid) => {
        if (!visited.has(pid)) {
          visited.add(pid);
          dfs(pid);
        }
      });
    })(node.id);

    // Collect fields from each visited node
    const fields: FormField[] = [];
    for (const ancId of visited) {
      const ancNode = allNodes.find((n) => n.id === ancId);
      if (!ancNode) continue;
      const raw = formMetadata.find((f) => f.id === ancNode.data.component_id);
      if (!raw) continue;
      Object.entries(raw.field_schema.properties).forEach(([fid, schema]) => {
        fields.push({
          id: fid,
          name: schema.title || fid,
          type: schema.type,
          avantos_type: (schema as any).avantos_type,
          format: (schema as any).format,
          items: (schema as any).items,
        });
      });
    }

    // Dedupe and return
    return Array.from(new Map(fields.map((f) => [f.id, f])).values());
  }

  // Toggle + lazy-load fields
  function toggleSection(srcId: string) {
    const isOpen = !expanded[srcId];
    setExpanded((prev) => ({ ...prev, [srcId]: isOpen }));

    if (isOpen && !fieldsCache[srcId]) {
      const src = sources.find((s) => s.id === srcId);
      if (!src) return;
      src.getFields().then((flds) => {
        // Deduplicate by id
        const unique = Array.from(new Map(flds.map((f) => [f.id, f])).values());
        setFieldsCache((prev) => ({ ...prev, [srcId]: unique }));
      });
    }
  }

  // Close all sections
  function closeAllSections() {
    setExpanded({});
  }

  return { sources, expanded, fieldsCache, toggleSection, closeAllSections };
}
