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
    try {
        const res = await fetch('/api/install', {
            credentials: 'include',
        })
        const data = await res.json()

        if (window.location.pathname.startsWith('/install')) {
            if(data.installed) {
                window.location.href = '/'
                return
            }
            renderApp()
            return
        }

        console.log('path:', window.location.pathname)
        console.log('data:', data)

        if (window.location.pathname.startsWith('/upgrade')) {
            if (!data.upgradeable) {
                window.location.href = '/'
                return
            }
            renderApp()
            return
        }

        if (data.upgradeable && !window.location.pathname.startsWith('/upgrade')) {
            window.location.href = '/upgrade'
            return
        }

        if (!data.installed && !window.location.pathname.startsWith('/install')) {
            window.location.href = '/install'
            return
        }

        renderApp()

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
