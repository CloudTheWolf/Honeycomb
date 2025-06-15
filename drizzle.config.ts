import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export default defineConfig({
    out: './server/db/migrations',
    schema: './server/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: requireEnv('DATABASE_HOST'),
        port: Number(requireEnv('DATABASE_PORT')),
    user: requireEnv('DATABASE_USERNAME'),
        password: requireEnv('DATABASE_PASSWORD'),
        database: requireEnv('DATABASE_NAME'),
    },
});
