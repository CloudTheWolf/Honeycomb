import {Hono} from "hono";

const projects = new Hono();

projects.get('/', async (ctx) => {
    return ctx.json({message: "ok"})
})

export default projects;