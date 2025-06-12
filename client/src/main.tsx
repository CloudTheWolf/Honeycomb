import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import './index.css'
import {AuthProvider} from '@/context/auth-context.tsx'
import {routeTree} from "@/routeTree.gen";

const router = createRouter({ routeTree })

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)

//Fetch install status first
const checkInstallStatus = async () => {
    if (window.location.pathname.startsWith('/install')) {
        renderApp()
        return
    }

    try {
        const res = await fetch('/api/install-status', {
            credentials: 'include', // optional if your backend uses cookies
        })
        const data = await res.json()
        if (!data.installed) {
            window.location.href = '/install'
        } else {
            renderApp()
        }
    } catch (e) {
        console.error('Install check failed', e)

    }
}

const renderApp = () => {
    root.render(
        <StrictMode>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </StrictMode>
    )
}

if (!rootElement.innerHTML) {
    checkInstallStatus()
}
