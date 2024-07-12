import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Return the string as-is if it's empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parsePostgresConnectionString(connectionString: string) {
  const formats = [
      /postgres:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.+)?/,
      /postgresql:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.+)?/
  ];

  let match: RegExpMatchArray | null = null;

  for (const format of formats) {
      match = connectionString.match(format);
      if (match) break;
  }

  if (!match) {
      throw new Error("Invalid connection string format");
  }

  const [protocol, username, password, hostname, port, databaseName, ssl] = match;

  return {
    protocol,
    username,
    password,
    hostname,
    port: port ? parseInt(port, 10) : 5432,
    databaseName,
    ssl: ssl ? true : false
  };
}