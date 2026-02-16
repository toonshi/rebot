import { useReactFlow } from 'reactflow';

const useNodeLineage = (nodeId) => {
  const { getNodes, getEdges } = useReactFlow();
  const edges = getEdges();
  const nodes = getNodes();

  // Find all edges pointing into THIS node
  const incomingEdges = edges.filter((edge) => edge.target === nodeId);
  
  // Get the actual node data for those parents
  const parents = incomingEdges.map((edge) => 
    nodes.find((node) => node.id === edge.source)
  ).filter(Boolean);

  return parents.map(p => ({
    id: p.id,
    varName: p.data.varName || p.id,
    type: p.type,
    // Define what "Tools/Pills" each type provides
    outputs: p.type === 'google_meet' ? ['transcript'] : ['output']
  }));
};

export default useNodeLineage;