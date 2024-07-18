'use server'

import { auth } from '@/auth'
import { prisma } from "@/lib/prisma";
import { Connection } from "@prisma/client/edge";

export async function experimentalFetchConnections () : Promise<Connection[]> {
  const session = await auth()
  const authId = session?.user?.id

  return prisma.connection.findMany({
    where: {
      userId: authId,
    }
  })
}