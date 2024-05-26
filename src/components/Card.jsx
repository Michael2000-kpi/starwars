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
  id,
  type: "default",
  position,
  data: { label: `${label}: ${value}` },
});

const createEdge = (source, target) => ({
  id: `edge-${source}-${target}`,
  source,
  target,
  type: "default",
});

// Card component to display person details in a graph using React Flow
const Card = ({ person, onBack }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = (reactFlowInstance) => setReactFlowInstance(reactFlowInstance);

  useEffect(() => {
    const fetchFilmsAndStarships = async () => {
      if (person) {
        try {
          const personDetails = [{ label: "Name", value: person.name }];

          const newNodes = personDetails.map((detail, index) =>
            createNode(`node-person-${index}`, detail.label, detail.value, {
              x: 0,
              y: index * 80,
            })
          );

          setNodes(newNodes);

          // Fetch films
          const filmResponses = await axios.get(
            "https://sw-api.starnavi.io/films/"
          );
          const filmNodes = filmResponses.data.results.map((film, index) => {
            return createNode(`node-film-${index}`, "Film", film.title, {
              x: 300,
              y: index * 80,
            });
          });

          setNodes((nds) => nds.concat(filmNodes));

          const filmEdges = filmNodes.map((filmNode) =>
            createEdge("node-person-0", filmNode.id)
          );

          setEdges(filmEdges);

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
                  x: 600,
                  y: index * 80,
                }
              );
            }
          );

          setNodes((nds) => nds.concat(starshipNodes));

          const starshipEdges = starshipNodes.map((starshipNode) =>
            createEdge(`node-film-0`, starshipNode.id)
          );

          setEdges((eds) => eds.concat(starshipEdges));
        } catch (error) {
          console.error("Error fetching data:", error); // Improved error handling
        }
      }
    };

    fetchFilmsAndStarships();
  }, [person, setNodes, setEdges]);

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
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={onInit}
              attributionPosition="top-right"
            >
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Card;
