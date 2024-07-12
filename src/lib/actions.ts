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

export const fetchUserById = async ({ email } : { email: string }) : Promise<string | null> => {
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

export const fetchUserConnections = async (id: string) : Promise<Connection[]> => {
  noStore();

  const connections: Connection[] = await prisma.connection.findMany({
    where: {id: id}
  })
  return connections
}


export const fetchConnectionById = async ( id: string ) => {
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

// DELETE
export const deleteConnection = async (id: string) : Promise<Connection> => { // edit this later
  const deletedConnection = await prisma.connection.delete({
    where: {
      id: id
    }
  })
  return deletedConnection
}