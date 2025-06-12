import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";
dotenv.config()
export const db = drizzle(`mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`);