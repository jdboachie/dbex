'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { runQuery } from '../pg';
import pg from 'pg';

const useDatabase = () => {
  const { queryToolSettings: settings } = useQueryToolContext();

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

  return { query };
};

export default useDatabase;
