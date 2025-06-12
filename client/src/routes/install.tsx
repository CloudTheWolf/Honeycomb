import {createFileRoute} from '@tanstack/react-router'
import {useState} from 'react'
import {codeToHtml} from 'shiki'

export const Route = createFileRoute('/install')({
    component: Install,
})

const steps = ['Migrate', 'Create User', 'Done'] as const;
type Step = typeof steps[number];

const example = `DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=
DATABASE_NAME=`

const codeBlock = await codeToHtml(example, {
        lang: 'ssh-config',
        theme: 'min-dark'
    })


function Install() {
    const [step, setStep] = useState<Step>('Migrate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const runMigrations = async () => {
        setLoading(true);
        const res = await fetch('/api/install/migrate', { method: 'POST' });
        const json = await res.json();
        setLoading(false);

        if (json.success) setStep('Create User');
        else setError(json.error || 'Migration failed');
    };

    const createUser = async () => {
        setLoading(true);
        const res = await fetch('/api/install/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,email, password }),
        });
        const json = await res.json();
        setLoading(false);

        if (json.success) setStep('Done');
        else setError(json.error || 'User creation failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="max-w-md mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-gray-900 space-y-6">
                <div className="flex items-center justify-center">
                    <img src="icon.svg" alt="Icon" className="h-20 w-20" />
                </div>
                <h1 className="text-2xl font-bold text-center">Honeycomb Installer</h1>
                {error && <div className="text-red-500 text-center">{error}</div>}

                {step === 'Migrate' && (
                    <div className="text-center space-y-4">
                        <p>Welcome to Honeycomb.<br/>An OpenSource QA Testing Platform</p>
                        <p>Before you begin, please modify the <br/><code className="bg-neutral-800">.env</code> file, if you haven't already.<br/>
                            Here is an example:
                        </p>
                        <div className="shiki prose max-w-none text-left ml-1 px-22"
                             dangerouslySetInnerHTML={{__html: codeBlock}}/>
                        <p>Once done, restart the container.<br/> Then click below to run the database migrations.</p>
                        <button onClick={runMigrations} disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded">
                            {loading ? 'Running...' : 'Run Migrations'}
                        </button>
                    </div>
                )}

                {step === 'Create User' && (
                    <div className="space-y-4">
                        <p className="text-center">Create your first admin account.</p>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <button onClick={createUser} disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                            {loading ? 'Creating...' : 'Create Admin User'}
                        </button>
                    </div>
                )}

                {step === 'Done' && (
                    <div className="text-center space-y-4">
                        <p>Setup complete!</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">You can now log in and start using the
                            system.</p>
                    </div>
                )}
            </div>
        </div>
    );
}