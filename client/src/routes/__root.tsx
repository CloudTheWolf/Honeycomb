import {createRootRoute, Outlet, useLocation, useNavigate} from '@tanstack/react-router'
import {useAuth} from '@/context/auth-context'
import {useEffect} from 'react'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: Root,
})

function Root() {
    const { isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname

    const isProtectedPath = path !== '/' && !path.startsWith('/public')  && path !== '/install' && path !== '/upgrade'

    useEffect(() => {
        if (!loading && !isAuthenticated && isProtectedPath) {
            navigate({ to: '/', replace: true })
        }
    }, [loading, isAuthenticated, isProtectedPath, navigate])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!isAuthenticated && isProtectedPath) {
        return null
    }

    return (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}
