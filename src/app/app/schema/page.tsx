'use client'

import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Edge,
  Background,
  Connection,
} from '@xyflow/react';
import { runConnectionSpecificQuery } from '@/lib/pg';

import '@xyflow/react/dist/base.css';

import { CustomNode } from '@/components/custom-node';
import { fetchConnections } from '@/lib/actions';

const nodeTypes = {
  custom: CustomNode,
};

interface connection {
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
  customName: string | null;
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

const Flow = () => {

  const getTableSchema = `SELECT table_schema, table_name, column_name, data_type
                          FROM information_schema.columns
                          WHERE table_schema = 'public'
                          ORDER BY table_schema, table_name, ordinal_position;`;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [connections, setConnections] = useState<connection[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const position = { x: 0, y: 0 };

  useEffect(() => {
    const fetchData = async () => {
      const connection = await fetchConnections();
      setConnections(connection);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const queries = async () => {
        const resultsArray = await Promise.all(
          connections.map(async (connection) => {
            const response = await runConnectionSpecificQuery(
              connection,
              getTableSchema
            );
            return response.res ? response.res.rows : [];
          })
        );
        return resultsArray;
      };
      const response = await queries();
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
    };
    fetchData();
  }, [connections]);

  React.useEffect(() => {
    console.log("Updated connections:", connections);
    console.log("Updated tables:", queryResult);
    console.log("Nodes:", nodes);
  }, [connections, queryResult, nodes]);

  return (
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
  );
};

export default Flow;
