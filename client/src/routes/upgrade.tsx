import {createFileRoute} from '@tanstack/react-router'
import {useState} from 'react'

export const Route = createFileRoute('/upgrade')({
    component: Upgrade,
})

const steps = ['Migrate', 'Done'] as const;
type Step = typeof steps[number];


function Upgrade() {
    const [step, setStep] = useState<Step>('Migrate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const runMigrations = async () => {
        setLoading(true);
        const res = await fetch('/api/install/migrate', { method: 'POST' });
        const json = await res.json();
        setLoading(false);

        if (json.success) setStep('Done');
        else setError(json.error || 'Migration failed');
    };

    const goHome = () => {
        window.location.reload();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="max-w-md mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-gray-900 space-y-6">
                <div className="flex items-center justify-center">
                    <img src="icon.svg" alt="Icon" className="h-20 w-20" />
                </div>
                <h1 className="text-2xl font-bold text-center">Honeycomb Upgrader</h1>
                {error && <div className="text-red-500 text-center">{error}</div>}

                {step === 'Migrate' && (
                    <div className="text-center space-y-4">
                        <p>Honeycomb has detected a newer version has been installed and needs to update the database</p>
                        <p>Before you begin, it's advised to backup your database.</p>
                        <p>Please click below to run the database migrations.</p>
                        <button onClick={runMigrations} disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded">
                            {loading ? 'Running...' : 'Run Migrations'}
                        </button>
                    </div>
                )}

                {step === 'Done' && (
                    <div className="text-center space-y-4">
                        <p>Setup complete!</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">You can now log in and resume using the application.</p>
                        <button onClick={goHome} disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded">
                            Return to Application
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}