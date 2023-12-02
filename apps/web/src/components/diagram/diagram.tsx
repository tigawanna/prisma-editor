import { useYDoc } from "app/yDocContext";
import { useState } from "react";
import { useDebounce } from "react-use";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { apiClient } from "~/utils/api";
import relationEdge from "./edges/relationEdge";
import EnumNode from "./nodes/enumNode";
import ModelNode from "./nodes/modelNode";
import { dmmfToElements } from "./util/dmmfToFlow";

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const parseSchema = async ({ schema }: { schema: string }) => {
  const result = await apiClient.dmmf.schemaToDmmf.mutate(schema);
  if (result.datamodel) {
    const { nodes, edges } = dmmfToElements(result.datamodel, null);
    return { nodes, edges };
  }
  return { errors: result.errors };
};

const Diagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [schema, setSchema] = useState("");
  const { ydoc } = useYDoc();
  const _schema = ydoc.getText("schema");
  _schema.observe(() => {
    setSchema(_schema.toString());
  });

  useDebounce(
    async () => {
      if (!schema) return;
      console.log("parsing");
      const result = await parseSchema({ schema });
      if (result.nodes) {
        setNodes(result.nodes);
        setEdges(result.edges);
      } else {
        console.log(result.errors);
      }
    },
    1000,
    [schema]
  );

  return (
    <div className="h-full w-full">
      <div className="zoompanflow">
        <div className="reactflow-wrapper">
          {/* <DiagramContextMenu> */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            minZoom={0.1}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
          >
            <Background color="grey" />
          </ReactFlow>
          {/* </DiagramContextMenu> */}
        </div>
        <svg width="0" height="0">
          <defs>
            <marker
              id="relation-one"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-one-selected"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-black"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-many"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-many-selected"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-black"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-one-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="text-edge stroke-current"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="text-edge stroke-current"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-one-selected-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-white"
                strokeWidth="3"
                strokeLinecap="square"
                fill="none"
                points="-10,-8 -10,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>

            <marker
              id="relation-many-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-[#5c7194]"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
            <marker
              id="relation-many-selected-dark"
              markerWidth="12.5"
              markerHeight="12.5"
              viewBox="-10 -10 20 20"
              orient="auto-start-reverse"
              refX="-10"
              refY="0"
            >
              <polyline
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
                points="0,-8 -10,0 0,8"
              />
              <line
                x1="-8"
                y1="0"
                x2="0"
                y2="0"
                className="stroke-current text-white"
                strokeLinejoin="round"
                strokeLinecap="square"
                strokeWidth="1.5"
                fill="none"
              />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Diagram;
