import {Hono} from "hono";

const projectsRouter = new Hono();

projectsRouter.get('/', async (ctx) => {
    return ctx.json({message: "ok"})
})

export default projectsRouter;