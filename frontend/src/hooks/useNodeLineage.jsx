import { useReactFlow } from 'reactflow';
import { useMemo } from 'react';

const useNodeLineage = (nodeId) => {
  const { getNodes, getEdges } = useReactFlow();
  const edges = getEdges();
  const nodes = getNodes();

  const memoizedParents = useMemo(() => {
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);
    
    const resolvedParents = incomingEdges.map((edge) => 
      nodes.find((node) => node.id === edge.source)
    ).filter(Boolean);

    return resolvedParents.map(p => ({
      id: p.id,
      varName: p.data.varName || p.id,
      type: p.type,
      outputs: p.type === 'google_meet' ? ['transcript'] : ['output']
    }));
  }, [
    nodeId,
    // Deep-ish compare relevant node props by stringifying them
    JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, varName: n.data.varName }))),
    // Deep-ish compare relevant edge props by stringifying them
    JSON.stringify(edges.map(e => ({ source: e.source, target: e.target })))
  ]);

  return memoizedParents;
};

export default useNodeLineage;