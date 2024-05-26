import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
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
  id, // Unique identifier for the node
  type: "default", // Node type (default in this case)
  position, // Position of the node on the graph
  data: { label: `${label}: ${value}` }, // Data containing label and value
});

// Function to create an edge between two nodes
const createEdge = (source, target) => ({
  id: `edge-${source}-${target}`, // Unique identifier for the edge
  source, // Source node ID
  target, // Target node ID
  type: "default", // Edge type (default in this case)
});

// Card component to display person details in a graph using React Flow
const Card = ({ person, onBack }) => {
  const reactFlowWrapper = useRef(null); // Ref for the React Flow wrapper
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // State for React Flow instance
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // State for nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // State for edges

  // Function to initialize the React Flow instance
  const onInit = (reactFlowInstance) => setReactFlowInstance(reactFlowInstance);

  useEffect(() => {
    // Function to fetch films and starships data
    const fetchFilmsAndStarships = async () => {
      if (person) {
        // Check if person data is available
        try {
          // Person details to create nodes for
          const personDetails = [{ label: "Name", value: person.name }];

          // Create nodes for person details
          const newNodes = personDetails.map((detail, index) =>
            createNode(`node-person-${index}`, detail.label, detail.value, {
              x: 0, // X position of the node
              y: index * 80, // Y position of the node
            })
          );

          setNodes(newNodes); // Set the newly created nodes

          // Fetch films
          const filmResponses = await axios.get(
            "https://sw-api.starnavi.io/films/"
          );
          const filmNodes = filmResponses.data.results.map((film, index) => {
            return createNode(`node-film-${index}`, "Film", film.title, {
              x: 300, // X position of the node
              y: index * 80, // Y position of the node
            });
          });

          setNodes((nds) => nds.concat(filmNodes)); // Concatenate film nodes with existing nodes

          // Create edges from person to films
          const filmEdges = filmNodes.map((filmNode) =>
            createEdge("node-person-0", filmNode.id)
          );

          setEdges(filmEdges); // Set the newly created edges

          // Fetch starships
          const starshipResponses = await axios.get(
            "https://sw-api.starnavi.io/starships/"
          );
          const starshipNodes = starshipResponses.data.results.map(
            (starship, index) => {
              return createNode(
                `node-starship-${index}`,
                "Starship",
                starship.name,
                {
                  x: 600, // X position of the node
                  y: index * 80, // Y position of the node
                }
              );
            }
          );

          setNodes((nds) => nds.concat(starshipNodes)); // Concatenate starship nodes with existing nodes

          // Create edges from the first film node to starships
          const starshipEdges = starshipNodes.map((starshipNode) =>
            createEdge(`node-film-0`, starshipNode.id)
          );

          setEdges((eds) => eds.concat(starshipEdges)); // Concatenate starship edges with existing edges
        } catch (error) {
          console.error("Error fetching data:", error); // Improved error handling
        }
      }
    };

    fetchFilmsAndStarships(); // Call the function to fetch films and starships
  }, [person, setNodes, setEdges]); // Dependencies for useEffect

  // Function to handle edge connections
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds)
      ),
    [setEdges]
  );

  return (
    <div>
      <button className="button" onClick={onBack}>
        Back
      </button>
      <div style={{ height: 800, width: 800 }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes} // Nodes to display
              edges={edges} // Edges to display
              onNodesChange={onNodesChange} // Handler for node changes
              onEdgesChange={onEdgesChange} // Handler for edge changes
              onConnect={onConnect} // Handler for new connections
              onInit={onInit} // Handler for initialization
              attributionPosition="top-right" // Position of the attribution
            >
              <Background color="#aaa" gap={16} /> {/* Background grid */}
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Card;
