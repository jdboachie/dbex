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

import '@xyflow/react/dist/base.css';

// import 'tailwindcss'

import { CustomNode } from '@/components/custom-nodes';
import { fetchConnections } from '@/lib/actions';
import { runQuery } from '@/lib/actions';
import { connect } from 'http2';


const nodeTypes = {
  custom: CustomNode,
};

const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      tableName: 'Users', columns: [
        {
          name: 'id',
          type: 'integer'
        },
        {
          name: 'name',
          type: 'string'
        }
      ]
    },
    position: { x: 0, y: 50 },
  }
];

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [connections, setConnections] = useState<connection[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const connection = await fetchConnections();
      setConnections(connection);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const queries = await runQuery(connections);
      const mergedResults = queries.flat();
      setQueryResult(mergedResults);
    };
    fetchData();
  }, [connections]);

  React.useEffect(() => {
    console.log("Updated connections:", connections);
    console.log("Updated tables:", queryResult);
  }, [connections, queryResult]);

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
