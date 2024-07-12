'use server'

import pg from 'pg';
import { QueryToolSettings } from './hooks/querytoolsettings';
import { parsePostgresConnectionString } from './utils';

const { Pool } = pg;

export async function testConnection(connectionString: string): Promise<boolean> {
  const credentials = parsePostgresConnectionString(connectionString);
  const client = new Pool(credentials);

  try {
    await client.connect();
    return true;
  } catch {
    return false;
  } finally {
    await client.end();
  }
}

export async function runQuery(
  text: string,
  settings: QueryToolSettings | null
): Promise<{
  res?: { columns: { name: string, type: number }[], rows: any[] },
  time?: number,
  error?: string
}> {


  const client = new Pool({
    user: settings?.connection.username,
    database: settings?.connection.databaseName,
    port: settings?.connection.port,
    host: settings?.connection.hostname,
    password: settings?.connection.password,
    ssl: settings?.connection.ssl ? true : false,
    connectionTimeoutMillis: 60000,
    query_timeout: 60000,
  });

  try {
    const start = Date.now();
    const result = await client.query(text);
    const end = Date.now();

    const columns = result.fields.map(field => ({
      name: field.name,
      type: field.dataTypeID
    }));

    const rows = result.rows;

    return {
      res: { columns, rows },
      time: end - start
    };
  } catch (err) {
    return { error: err!.toString() };
  } finally {
    await client.end();
  }
}
