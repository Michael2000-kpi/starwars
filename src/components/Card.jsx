import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

// Function to create a node for React Flow graph
const createNode = (id, label, value, position) => ({
  id,
  type: "default",
  position,
  data: { label: `${label}: ${value}` },
});

// Card component to display person details in a graph using React Flow
const Card = ({ person, onBack }) => {
  // Ref for React Flow wrapper
  const reactFlowWrapper = useRef(null);
  // State for React Flow instance
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // State for nodes and edges using React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Function to initialize React Flow instance
  const onInit = (reactFlowInstance) => setReactFlowInstance(reactFlowInstance);

  useEffect(() => {
    // Create nodes based on person details when person prop changes
    if (person) {
      const personDetails = [
        { label: "Name", value: person.name },
        { label: "Height", value: person.height },
        { label: "Mass", value: person.mass },
        { label: "Hair Color", value: person.hair_color },
        { label: "Skin Color", value: person.skin_color },
        { label: "Eye Color", value: person.eye_color },
        { label: "Birth Year", value: person.birth_year },
        { label: "Gender", value: person.gender },
      ];

      // Map person details to create nodes
      const newNodes = personDetails.map((detail, index) =>
        createNode(`node-${index}`, detail.label, detail.value, {
          x: 0,
          y: index * 80, // Position each node vertically
        })
      );

      setNodes(newNodes); // Set nodes state
    }
  }, [person, setNodes]);

  // Function to handle node connection
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds)
      ),
    [setEdges]
  );

  return (
    <div>
      {/* Back button */}
      <button className="button" onClick={onBack}>
        Back
      </button>
      {/* React Flow container */}
      <div style={{ height: 800, width: 800 }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            {/* React Flow component */}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={onInit}
              attributionPosition="top-right"
            >
              {/* Background for React Flow */}
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Card;
