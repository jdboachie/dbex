'use server'

import { prisma } from '../lib/prisma'
import { Connection } from '@prisma/client/edge';
import { unstable_noStore as noStore } from "next/cache";


// CREATE
export const createConnection = async (data: any) => { // edit this later
  await prisma.connection.create({
    data: data
  })
}


// READ

export const getUserById = async ({ email } : { email: string }) : Promise<string | null> => {
  noStore();

  const user = await prisma.user.findUnique({
    where: {email: email}
  })
  return user?.id || null
}

export const fetchAllConnections = async () : Promise<Connection[]> => {
  noStore();

  const connections: Connection[] = await prisma.connection.findMany()
  return connections
}

export const fetchConnectionById = async ( {id} : {id : string} ) => {
  noStore();

  const connection: Connection | null = await prisma.connection.findFirst({
    where: {
      id: id
    }
  })

  return connection
}

export const fetchAllQueries = async () => {
  noStore();

  const queries = await prisma.query.findMany(
    {
      include: {
        relatedConnection: true
      }
    }
  )
  return queries
}