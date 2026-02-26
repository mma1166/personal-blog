'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            // Mock login: validate password against saved profile (default: admin123)
            const stored = localStorage.getItem('admin_profile');
            const savedPw = stored ? (JSON.parse(stored).password || 'admin123') : 'admin123';
            if (password !== savedPw) {
                setError('Invalid password. Please try again.');
                setLoading(false);
                return;
            }
            localStorage.setItem('admin_mock_session', 'true');
            router.push('/admin');
            router.refresh();
            return;
        }

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="glass login-card">
                <div className="login-header">
                    <div className="icon-box">
                        <Lock size={24} />
                    </div>
                    <h1>Admin Login</h1>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top right, rgba(124, 58, 237, 0.1), transparent),
                                radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.05), transparent);
                }
                .login-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 3rem;
                    border-radius: 24px;
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .icon-box {
                    width: 56px;
                    height: 56px;
                    background: var(--accent);
                    color: white;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3);
                }
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }
                .input-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    color: white;
                    padding: 0.8rem 1rem;
                    border-radius: 10px;
                    outline: none;
                    transition: all 0.3s;
                }
                input:focus {
                    border-color: var(--accent);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
                }
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 0.8rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .login-button {
                    width: 100%;
                    background: var(--accent);
                    border: none;
                    color: white;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }
                .login-button:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
                }
                .login-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
