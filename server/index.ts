import app from "@server/app";
//import {initializeCronJobs} from "@server/cron/cron";
import {copyFileSync, existsSync} from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const rootDir = path.join(import.meta.dir, '..');
const envPath = path.join(rootDir, '.env');
const envExample = path.join(rootDir, '.env.example');

if (!existsSync(envPath) && existsSync(envExample)) {
    copyFileSync(envExample, envPath);
}

dotenv.config({ path: envPath });

Bun.serve({
    fetch: app.fetch
})

//initializeCronJobs()
console.log("Honeycomb Is Running");