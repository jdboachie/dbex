"use server";

import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { Connection, User, Query } from "@prisma/client/edge";
import bcryptjs from "bcryptjs";
import { runConnectionSpecificQuery } from "@/lib/pg";


// export const runSchemaQuery = async (
//   connection_array:Connection[]
// ) => {
//   const getTableSchema = `SELECT table_schema, table_name, column_name, data_type
//                         FROM
//                           information_schema.columns
//                         WHERE
//                           table_schema = 'public'
//                         ORDER BY
//                           table_schema,
//                           table_name,
//                           ordinal_position;`;
//   const resultsArray = await Promise.all(
//     connection_array.map(async (connection) => {
//       const response = await runConnectionSpecificQuery(
//         connection,
//         getTableSchema
//       );
//       return response.res ? response.res.rows : [];
//     })
//   );
//   return resultsArray;
// };

// CREATE
export const createConnection = async (data: any): Promise<Connection> => {
  return await prisma.connection.create({
    data: data,
  });
};

export const createQuery = async (id: string, data: any): Promise<Query> => {
  return await prisma.query.upsert({
    where: { id: id },
    update: data,
    create: data,
  });
};

// READ
export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  noStore();
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user || null;
};

export const fetchConnections = async (): Promise<Connection[]> => {
  noStore();

  const session = await auth();
  let authId = session?.user?.id;

  if (!authId) {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });

    authId = user?.id;
  }

  return prisma.connection.findMany({
    where: {
      userId: authId,
    },
  });
};

export const fetchConnectionById = async (id: string) => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  const connection: Connection | null = await prisma.connection.findFirst({
    where: {
      id: id,
      userId: authId,
    },
  });

  return connection;
};

export const fetchAllQueries = async () => {
  noStore();

  const session = await auth();
  let authId = session?.user?.id;

  if (!authId) {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });

    authId = user?.id;
  }

  const queries = await prisma.query.findMany({
    include: {
      relatedConnection: true,
    },
    where: {
      userId: authId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return queries;
};

export const fetchQuerybyId = async (id: string) => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  const query = await prisma.query.findFirst({
    where: {
      id: id,
      userId: authId,
    },
    include: {
      relatedConnection: true,
    },
  });

  return query;
};

// UPDATE
// I'm using prisma's handy `upsert` command instead

// DELETE
export const deleteConnection = async (id: string) => {
  await prisma.connection.delete({
    where: {
      id: id,
    },
  });
};

export const deleteQuery = async (id: string) => {
  await prisma.query.delete({
    where: {
      id: id,
    },
  });
};

export const Analytics = async () => {
  const session = await auth();
  if (!session) return { queries: 0, connection: 0 };
  let authId = session.user?.id;
  if (!authId) {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });
    authId = user?.id;
  }
  const queries = await prisma.query.count({ where: { userId: authId } });
  const connection = await prisma.connection.count({
    where: { userId: authId },
  });
  return { queries, connection };
};


export const SendMail = async (email: string, message: string) => {
  const apiEndpoint = "/api/email";

  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify({ email, message }),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
    })
    .catch((err) => {
      alert(err);
    });
};

export const userQueries = async () => {
  const session = await auth();
  if (!session) return [];

  let authId = session.user?.id;

  if (!authId) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email ?? "",
      },
    });
    authId = user?.id;
  }

  const userQueries = await prisma.query.findMany({
    where: { userId: authId },
    orderBy: { updatedAt: "desc" },
  });

  return userQueries;
};

export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: email.split("@")[0],
        password: hashedPassword,
      },
    });
    console.log("User created:", user);
    return {sucess: true}
  } catch (error) {
    console.error("Error creating user:", error);
    return {sucess: false};
  }
};


export const hashPassword = async (password: string) => {
  const saltRound = 10;
  const hashPassword = await bcryptjs.hash(password, saltRound);
  return hashPassword;
};


