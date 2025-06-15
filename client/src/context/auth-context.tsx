import {createContext, type ReactNode, useContext, useEffect, useState,} from 'react'
import type {InferSelectModel} from 'drizzle-orm'
//@ts-ignore
import {users} from '@server/db/schema'

type User = InferSelectModel<typeof users>


interface AuthContextType {
    isAuthenticated: boolean
    loading: boolean
    user: User | null
    setAuthenticated: (auth: boolean) => void
    refreshUser: () => Promise<void>
}


const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    user: null,
    setAuthenticated: () => {},
    refreshUser: async () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)


    const refreshUser = async () => {
        try {
            const res = await fetch('/api/authentication/me', {
                credentials: 'include',
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setUser(data.user)
        } catch {
            setUser(null)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/authentication/status', {
                    credentials: 'include',
                })

                const data = await res.json()

                if (data.loggedIn) {
                    setIsAuthenticated(true)

                    const meRes = await fetch('/api/authentication/me', {
                        credentials: 'include',
                    })
                    if (meRes.ok) {
                        const meData = await meRes.json()
                        setUser(meData.user)
                    } else {

                        setUser(null)
                    }
                } else {
                    setIsAuthenticated(false)
                    setUser(null)
                }
            } catch {
                setIsAuthenticated(false)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={
                {
                isAuthenticated,
                loading,
                user,
                setAuthenticated: setIsAuthenticated,
                refreshUser,}}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Hook
export const useAuth = (): AuthContextType => useContext(AuthContext)
