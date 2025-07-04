import {Hono} from "hono";
import {db} from "@server/helpers/database-helper";
import {sessions, users} from "@server/db/schema";
import {eq, or,gt} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {nanoid} from "nanoid";
import {signJwt, verifyJwt} from "@server/helpers/jwt-helper";
import {deleteCookie, getCookie, setCookie} from 'hono/cookie'
import {requireMinimumRole, requireRole} from "@server/middleware/requireRole";
import {UserRole} from "@server/enums/UserRole";

function getDomain(c: any): string | undefined {
    const host = c.req.header('host') ?? 'localhost'
    const hostname = host.split(':')[0]
    return hostname === 'localhost' || hostname === '127.0.0.1' ? undefined : hostname
}

const authenticationRouter = new Hono();

authenticationRouter.get('/status', async (c) => {
    const sessionToken = getCookie(c,'session')
    if (!sessionToken) return c.json({ loggedIn: false })
    try {
        const now = new Date()

        const session = await db.query.sessions.findFirst({
            where: (s) =>
                eq(s.accessToken, sessionToken) &&
                eq(s.isRevoked, 0) &&
                gt(s.expiresAt, now)
        })
        const payload = await verifyJwt(sessionToken)
        return c.json({loggedIn: !!session,payload})
    } catch (error) {
        return c.json({ loggedIn: false })
    }
})

authenticationRouter.post('/login', async (c) => {
    try {
        const {username, password} = await c.req.json()
        console.log(`${username}, ${password}  `)
        const user = await db.query.users.findFirst({
            where: or(eq(users.username, username), eq(users.email, username)),
        })

        if (!user) {
            return c.json({error: 'Invalid credentials'}, 401)
        }

        const match = bcrypt.compare(password, user.password)
        if (!match) {
            return c.json({error: 'Invalid credentials'}, 401)
        }

        const accessToken = await signJwt({userId: user.id, apiAccess: true, role: user.role})
        const refreshToken = nanoid()
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await db.insert(sessions).values({
            userId: Number(user.id),
            accessToken,
            refreshToken,
            isRevoked: 0,
            expiresAt
        })

        setCookie(c, 'session', accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60,
            sameSite: 'Strict',
            domain: getDomain(c),
            expires: expiresAt,
        })

        return c.json({success: true})
    } catch (error) {
        return c.json({success: false, error: error}, 500)
    }
})

export default authenticationRouter;