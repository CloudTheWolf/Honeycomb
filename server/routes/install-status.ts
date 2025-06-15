import { readFileSync, existsSync } from 'fs';
import { parse } from 'dotenv';
import {Hono} from "hono";
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from '@server/db/db';
import { writeFileSync } from 'fs';
import bcrypt from 'bcryptjs'
import {users, version} from "@server/db/schema";
import { eq } from "drizzle-orm";
import { Application_Version } from "@server/core/version.core";
import semver from 'semver';
const installStatusRouter = new Hono()



installStatusRouter.get('/', async (c) => {
    try {
        const dbVersion = await db.select().from(version).where(eq(version.item,'honeycomb-core'))
        console.log(dbVersion)
        const hasExistingVersion = dbVersion.length  > 0;
        let hasUpgrade = false
        if(dbVersion.length > 0 )
        {
            hasUpgrade = semver.gt(Application_Version,dbVersion[0].version_str);
        }


        return c.json({ installed: hasExistingVersion, upgradeable: hasUpgrade, version: dbVersion[0].version_str, package_version: Application_Version });
    } catch (error) {
        // @ts-ignore
        return c.json({ installed: false, error: `${error.message}` });
    }
});


installStatusRouter.post('/migrate', async (c) => {
    try {
        await migrate(db, { migrationsFolder: 'server/db/migrations' });
        await db.insert(version).values({item: 'honeycomb-core', version_str: Application_Version})
            .onDuplicateKeyUpdate({set: { version_str: Application_Version }});
        return c.json({ success: true });
    } catch (err) {
        console.error('Migration failed:', err);
        return c.json({ success: false, error: 'Migration failed. Check logs.' }, 500);
    }
});

installStatusRouter.post('/create-user', async (c) => {
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

export default  installStatusRouter
