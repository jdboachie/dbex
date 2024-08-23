'use client'

import {
  Edge,
  addEdge,
  MiniMap,
  Controls,
  ReactFlow,
  Background,
  Connection,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import * as React from 'react';
import '@xyflow/react/dist/base.css';
import { CustomNode } from './custom-node';
import { fetchConnectionById } from '@/lib/actions';
import { runConnectionSpecificQuery } from '@/lib/pg';
import { NumberCircleFour } from '@phosphor-icons/react';
import LoadingUI from './loading-ui';

const nodeTypes = {
  custom: CustomNode,
};

interface ConnectionType {
  id: string;
  userId: string;
  username: string;
  hostname: string;
  password: string;
  port: number;
  protocol: string;
  databaseName: string;
  isConnected: boolean;
  ssl: boolean | null;
}

const initEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
];

const Flow = ({id} : {id: string}) => {

  const getTableSchema = `SELECT table_schema, table_name, column_name, data_type
                          FROM information_schema.columns
                          WHERE table_schema = 'public'
                          ORDER BY table_schema, table_name, ordinal_position;`;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [connections, setConnections] = React.useState<ConnectionType[]>();
  const [queryResult, setQueryResult] = React.useState<any[]>([]);

  const onConnect = React.useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const position = { x: 0, y: 0 };

  React.useEffect(() => {
    const fetchData = async () => {
      const connection = await fetchConnectionById(id);
      if ( connection )
        setConnections([connection]);
    };

    fetchData();
  }, [id]);

  React.useEffect(() => {
    const fetchData = async () => {
      const queries = async () => {
        if (connections) {
          const resultsArray = await Promise.all(
            connections.map(async (c: ConnectionType) => {
              const response = await runConnectionSpecificQuery(
                c,
                getTableSchema
              );
              return response.res ? response.res.rows : [];
            })
          );
          return resultsArray;
        }
      };
      const response = await queries();
      if (response) {
        const mergedResults = response.flat();

        const groupedTables = mergedResults.reduce((acc, curr) => {
          if (!acc[curr.table_name]) {
            acc[curr.table_name] = [];
          }
          acc[curr.table_name].push({
            name: curr.column_name,
            type: curr.data_type,
          });
          return acc;
        }, {});

        const newNodes = Object.keys(groupedTables).map((tableName, index) => {
          const xPos = (index % 4) * 400; // Adjust 400 to increase horizontal spacing
          const yPos = Math.floor(index / 4) * 300; // Adjust 300 to control vertical spacing

          return {
            id: `${index + 1}`,
            type: 'custom',
            data: {
              tableName: tableName,
              columns: groupedTables[tableName],
            },
            position: { x: xPos, y: yPos },
          };
        });

        setNodes(newNodes as never[]);
        setQueryResult(mergedResults);
      }



    };
    fetchData();
  }, [connections, getTableSchema, setNodes]);


  return (
    <div className="h-[400px] border rounded-lg">
      {nodes.length > 0 ?
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-teal-50"
        >
          <MiniMap />
          <Background />
          <Controls />
        </ReactFlow>
        :
        <LoadingUI />
      }
    </div>
  );
};

export default Flow;
