import {drizzle, type MySql2Database} from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import * as schema from '@server/db/schema'

dotenv.config()

const pool = mysql.createPool({
    uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 50,
    idleTimeout: 60000,
    queueLimit: 0,
})


// @ts-ignore
export const db: MySql2Database<typeof schema> = drizzle(pool, { schema, mode: 'default' })