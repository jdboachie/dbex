'use server'

import { prisma } from '../lib/prisma'
import { Connection, User } from '@prisma/client/edge';
import { unstable_noStore as noStore } from "next/cache";


// CREATE
export const createConnection = async (data: any) => {
  await prisma.connection.create({
    data: data
  })
}

export const createQuery = async (data: any) => {
  await prisma.query.create({
    data: data
  })
}


// READ
export const fetchUserByEmail = async (email: string) : Promise<User | null> => {
  // noStore();

  const user = await prisma.user.findUnique({
    where: {email: email}
  })
  return user || null
}

export const fetchUserConnections = async (userId: string | undefined) : Promise<Connection[]> => {
  noStore();

  if ( userId ) {
    const connections: Connection[] = await prisma.connection.findMany({
      where: {userId: userId}
    })
    return connections
  } else {
    return []
  }

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

export const fetchQuerybyId = async ( id: string ) => {
  noStore();

  const query = await prisma.query.findFirst({
    where: {
      id: id
    }
  })

  return query
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