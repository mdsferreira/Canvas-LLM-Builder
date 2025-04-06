import type { Config } from 'drizzle-kit';
import "dotenv/config";

export default {
    schema: './src/drizzle/schema.ts',
    out: './src/drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
} satisfies Config;
