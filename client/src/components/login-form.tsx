import { useForm } from '@tanstack/react-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {useAuth} from "@/context/auth-context";
import {useNavigate} from "@tanstack/react-router";
import {useState} from "react";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<'div'>) {
    const { setAuthenticated, refreshUser } = useAuth()
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState<string | null>(null)
    const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {

        const res = await fetch('/api/authentication/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        })

        if (!res.ok) {
            try {
                const data = await res.json()
                setLoginError(data.error ?? 'Invalid Credentials')
            } catch {
                setLoginError('Invalid credentials')
            }
            return
        }

        setAuthenticated(true)
        await refreshUser()
        navigate({ to: '/dashboard', replace: true })
    },
  })

  return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-18 items-center justify-center rounded-md">
                <img src="icon.svg" alt="Icon" />
              </div>
              <span className="sr-only">Honeycomb</span>
              <h1 className="text-xl font-bold">Welcome to Honeycomb.</h1>
            </div>

            <div className="flex flex-col gap-6">
              <form.Field
                  name="username"
                  children={(field) => (
                      <div className="grid gap-3">
                        <Label htmlFor={field.name}>Username Or Email Address</Label>
                        <Input
                            id={field.name}
                            type="text"
                            placeholder="MyUser"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                        />
                      </div>
                  )}
              />

              <form.Field
                  name="password"
                  children={(field) => (
                      <div className="grid gap-3">
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                            id={field.name}
                            type="password"
                            placeholder="P@ssw0rd"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                        />
                      </div>
                  )}
              />
                {loginError && (
                    <div className="text-sm text-red-500 font-medium">
                        {loginError}
                    </div>
                )}
              <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Logging in…' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      </div>
  )
}


/* We'll add SSO later
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-neutral-900 text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="justify-center items-center grid gap-4 sm:grid-cols-3">
            <Button variant="outline" type="button" className="w-full col-start-2 right-1/4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
 */