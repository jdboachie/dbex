'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { runQuery } from '../pg';
import pg from 'pg';

const useDatabase = () => {
  const { queryToolSettings: settings } = useQueryToolContext();

  // const useValidConnection = useCallback(async (): Promise<{ res: boolean | null, message: string }> => {
  //   const client = new Client({
  //     user: settings?.connection.username,
  //     database: settings?.connection.databaseName,
  //     host: settings?.connection.hostname,
  //     port: settings?.connection.port,
  //     password: settings?.connection.password,
  //   });

  //   try {
  //     console.log('connecting')
  //     await client.connect()
  //     .then(() => {
  //       return { res: true, message: 'Connected successfully' };
  //     })
  //     return { res: null, message: 'Connecting...'}
  //   } catch (error) {
  //     return { res: false, message: error!.toString() };
  //   } finally {
  //     client.end();
  //   }
  // }, [settings]);

  const query = useCallback(async (text: string): Promise<{
    // output: pg.QueryResult<any>;
    output: string;
    time: number;
    error?: undefined;
    null?: undefined;
  } | {
    error?: string;
    output?: undefined;
    time?: undefined;
  }> => {
    return runQuery(text, settings)
  }, [settings]);

  return { query,  }; // useValidConnection
};

export default useDatabase;
