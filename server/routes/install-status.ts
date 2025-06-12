import { readFileSync, existsSync } from 'fs';
import { parse } from 'dotenv';
import {Hono} from "hono";
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from '@server/db/db';
import { writeFileSync } from 'fs';
import bcrypt from 'bcryptjs'
import {users} from "@server/db/schema";
import {eq} from "drizzle-orm";
const installStatus = new Hono()



installStatus.get('/', (c) => {
    try {
        const parsed = parse(readFileSync('.env', 'utf-8'));
        const installed = !!parsed.INSTALL_VERSION || existsSync('./INSTALLED');

        return c.json({ installed });
    } catch {
        return c.json({ installed: false });
    }
});


installStatus.post('/migrate', async (c) => {
    try {
        await migrate(db, { migrationsFolder: 'server/db/migrations' });
        return c.json({ success: true });
    } catch (err) {
        console.error('Migration failed:', err);
        return c.json({ success: false, error: 'Migration failed. Check logs.' }, 500);
    }
});

installStatus.post('/create-user', async (c) => {
    const { username, email, password } = await c.req.json();

    if (!email || !password) {
        return c.json({ success: false, error: 'Missing username or password' }, 400);
    }

    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length > 0) {
        return c.json({ success: false, error: 'User already exists' }, 400);
    }

    // @ts-ignore - We don't need to set created_at or updated_at
    await db.insert(users).values({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        auth_provider: 'local',
        enabled: true,
        role: 0
    });

    writeFileSync('./INSTALLED', new Date().toISOString());
    return c.json({ success: true });
});

export default  installStatus
