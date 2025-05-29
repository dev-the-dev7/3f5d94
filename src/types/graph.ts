export interface NodeData {
  component_id: string;
  name: string;
}

export interface FormNode {
  id: string;
  type: string;
  data: NodeData;
}

export interface Edge {
  source: string;
  target: string;
}
