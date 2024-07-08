'use server'


import pg from 'pg';
import { QueryToolSettings } from './hooks/querytoolsettings';

const { Pool } = pg;

export async function runQuery (text: string, settings: QueryToolSettings | null): Promise<{
  // output: pg.QueryResult<any>;
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

  // const client = new Pool({
  //   connectionTimeoutMillis: 60000,
  //   query_timeout: 60000,
  //   connectionString: 'postgresql://neondb_owner:JCPEoudOf91r@ep-bold-truth-a58tdfn1.us-east-2.aws.neon.tech/neondb?sslmode=require'
  // })

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