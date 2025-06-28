import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { UserRole } from '@server/enums/UserRole'
import {getCookie} from 'hono/cookie'
import * as process from "node:process";

/***
 * Require Specific Roles to access endpoints
 * @param {UserRole[]} allowedRoles List of allowed Roles (Role 0 "Administrator" will always have access)
 */
export function requireRole(allowedRoles: UserRole[]) {
    return createMiddleware(async (c, next) => {
        const token =getCookie(c,'session')
        if (!token) return c.json({message:'Unauthorized'}, 401)

        try {
            const payload = await verify(token, `${process.env.JWT_SECRET}`);
            if (typeof payload.role !== 'number' || (!allowedRoles.includes(payload.role) && payload.role != UserRole.Administrator)) {
                return c.json({message:'Forbidden'}, 403)
            }

            c.set('user', payload) // Optional: make user available downstream
            await next()
        } catch (error) {
            return c.json({message:error}, 500)
        }
    })
}
/***
 * Allow users with at least the specified role
 * @param {UserRole} minimumRole Minimum Required Role to access this endpoint
 */
export function requireMinimumRole(minimumRole: UserRole) {
    return createMiddleware(async (c, next) => {
        const token =getCookie(c,'session')
        if (!token) return c.json({message:'Unauthorized'}, 401)

        try {
            const payload = await verify(token, `${process.env.JWT_SECRET}`);

            if (typeof payload.role !== 'number' || payload.role > minimumRole) {
                return c.json({ message: 'Forbidden' }, 403)
            }

            c.set('user', payload)
            await next()
        } catch (error) {
            return c.json({message:error}, 500)
        }
    })
}
