import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getPostgresUrl } from "./url";

const globalForDb = globalThis as unknown as {
  postgresClient?: postgres.Sql;
};

const connectionString = getPostgresUrl(process.env.DATABASE_URL);

const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
export { client as sqlClient };
