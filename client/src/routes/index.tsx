import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {LoginForm} from "@/components/login-form"
import {useAuth} from "@/context/auth-context"
import {useEffect} from "react"

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const { isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/dashboard', replace: true })
        }
    }, [isAuthenticated, navigate])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Checking login status...</p>
            </div>
        )
    }

    return (
        <div className="bg-neutral-900 flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <LoginForm />
        </div>
    )
}
