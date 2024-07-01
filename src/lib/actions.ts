'use server'

import { prisma } from '../lib/prisma'
import { Connection, Query } from '@prisma/client/edge';
import { unstable_noStore as noStore } from "next/cache";

export const fetchAllConnections = async () => {
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