'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { QueryToolSettings, useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { runQuery } from '../pg';
import pg from 'pg';

const useDatabase = () => {
  const { queryToolSettings: settings } = useQueryToolContext();

  const query = useCallback(async (
    text: string,
  ): Promise<{
    res?: { columns: { name: string, type: number }[], rows: any[] },
    time?: number,
    error?: string
  }> => {
    return runQuery(text, settings)
  }, [settings]);

  return { query };
};

export default useDatabase;
