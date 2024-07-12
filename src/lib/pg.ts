'use server'


import pg from 'pg';
import { QueryToolSettings } from './hooks/querytoolsettings';
import { parsePostgresConnectionString } from './utils';

const { Pool } = pg;

export async function testConnection (connectionString: string) {
  const credentials = parsePostgresConnectionString(connectionString);
  const client = new Pool(credentials)
  await client.connect()
    .then(() => {return true})
    .catch(() => {return false})
}

export async function runQuery (text: string, settings: QueryToolSettings | null): Promise<{
  output: string;
  time: number;
  error?: undefined;
  null?: undefined;
} | {
  error?: string;
  output?: undefined;
  time?: undefined;
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
    const res = await client.query(text)
    const output = JSON.stringify(res)
    const end = Date.now();
    const time = end - start
    return { output, time }
  } catch (err) {
    const error = err!.toString()
    console.log(err)
    return { error }
  } finally {
    client.end()
  }
}