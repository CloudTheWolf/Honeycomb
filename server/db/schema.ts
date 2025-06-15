import {
    int,
    mysqlTable,
    timestamp,
    tinyint,
    varchar
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    username: varchar("username",{ length: 150}).notNull().unique(),
    email: varchar("email",{ length: 150 }).notNull().unique(),
    password: varchar("password",{ length: 255 }).notNull(),
    auth_provider: varchar("auth_provider",{ length: 50 }).notNull().default('local'),
    enabled: tinyint('enabled').notNull().default(1),
    role: int("role").notNull().default(1),
    created_at: timestamp('created_at',{mode: 'string'}).defaultNow(),
    updated_at: timestamp('updated_at',{mode: 'string'}).defaultNow(),
});

export const version = mysqlTable("version", {
    item: varchar("item",{length: 50}).notNull().unique(),
    version_str: varchar("version_str",{length: 50}).notNull()
})