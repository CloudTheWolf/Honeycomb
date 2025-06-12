import {Hono} from 'hono'
import {logger} from 'hono/logger'
import {serveStatic} from 'hono/bun'
import projectsRouter from "@server/routes/projects";
import installStatus from "@server/routes/install-status";

const app = new Hono()

app.use('*',logger())

const apiRoutes = app.basePath('/api')
    .route('/projects',projectsRouter)
    .route('/install',installStatus)

app.use('*', serveStatic({ root: './client/dist' }))
app.use('*', serveStatic({ path: './client/dist/index.html' }))

export default app;