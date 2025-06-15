import {Hono} from 'hono'
import {logger} from 'hono/logger'
import {serveStatic} from 'hono/bun'
import projectsRouter from "@server/routes/projects";
import installStatusRouter from "@server/routes/install-status";
import authenticationRouter from "@server/routes/authentication";

const app = new Hono()

app.use('*',logger())

const apiRoutes = app.basePath('/api')
    .route('/authentication',authenticationRouter)
    .route('/projects',projectsRouter)
    .route('/install',installStatusRouter)

app.use('*', serveStatic({ root: './client/dist' }))
app.use('*', serveStatic({ path: './client/dist/index.html' }))

export default app;