import {type JWTPayload, jwtVerify, SignJWT} from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_fallback_secret')

export type AuthPayload = {
    userId: number
} & JWTPayload

export async function signJwt(payload: AuthPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // expires in 7 days
        .sign(secret)
}

export async function verifyJwt(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify<AuthPayload>(token, secret)
        return payload
    } catch {
        return null
    }
}