'use server'

import { auth } from '@/auth'
import { prisma } from '../lib/prisma'
import { unstable_noStore as noStore } from "next/cache";
import { Connection, User, Query } from '@prisma/client/edge';


// CREATE
export const createConnection = async (data: any): Promise<Connection> => {
  return await prisma.connection.create({
    data: data
  })
}

export const createQuery = async (id: string, data: any): Promise<Query> => {
  return await prisma.query.upsert({
    where: {id:  id},
    update: data,
    create: data
  })
}


// READ
export const fetchUserByEmail = async (email: string) : Promise<User | null> => {
  noStore();

  const user = await prisma.user.findUnique({
    where: {email: email}
  })
  return user || null
}

export const fetchConnections = async () : Promise<Connection[]> => {
  noStore();

  const session = await auth()
  const authId = session?.user?.id

  return prisma.connection.findMany({
    where: {
      userId: authId,
    }
  })
}

export const fetchConnectionById = async ( id: string ) => {
  noStore();

  const session = await auth()
  const authId = session?.user?.id

  const connection: Connection | null = await prisma.connection.findFirst({
    where: {
      id: id,
      userId: authId,
    }
  })

  return connection
}

export const fetchAllQueries = async () => {
  noStore();

  const session = await auth()
  const authId = session?.user?.id

  const queries = await prisma.query.findMany(
    {
      include: {
        relatedConnection: true
      },
      where: {
        userId: authId
      }
    }
  )
  return queries
}

export const fetchQuerybyId = async ( id: string ) => {
  noStore();

  const session = await auth()
  const authId = session?.user?.id

  const query = await prisma.query.findFirst({
    where: {
      id: id,
      userId: authId,
    },
    include: {
      relatedConnection: true
    }
  })

  return query
}


// UPDATE
// I'm using prisma's handy `upsert` command instead

// DELETE
export const deleteConnection = async (id: string) => {
  await prisma.connection.delete({
    where: {
      id: id
    }
  })
}

export const deleteQuery = async (id: string) => {
  await prisma.query.delete({
    where: {
      id: id
    }
  })
}

export const Analytics = async () => {
  const queries = await prisma.query.count();
  const connection = await prisma.connection.count();

  return { queries, connection };
};