'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                // Fallback for simulation if user is not created yet
                if (email === 'renato.consultoria@cidadeviva.org' && password === 'renatoadmin2026') {
                    // If Renato is using the system for the first time and hasn't created the user in Supabase Auth,
                    // we can't "just log in". But for this demo, I'll inform him.
                    setError('Usuário não encontrado no Supabase Auth. Por favor, crie o usuário no Dashboard do Supabase.');
                } else {
                    setError(authError.message);
                }
                setLoading(false);
                return;
            }

            if (data.user) {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('Erro inesperado ao realizar login.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 2px 2px, #111 1px, transparent 0)',
            backgroundSize: '40px 40px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid #222'
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <img
                        src="/images/logo-light.png"
                        alt="Cidade Viva Education"
                        style={{ width: '100%', maxWidth: '240px', height: 'auto', marginBottom: '16px' }}
                    />
                    <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginTop: '12px' }}>
                        Finance <span style={{ color: 'var(--primary)', fontSize: '14px', verticalAlign: 'middle', marginLeft: '4px' }}>ERP + BI</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
                        Acesse o ecossistema financeiro
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 23, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        marginBottom: '20px',
                        textAlign: 'left'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)' }} />
                        <input
                            type="email"
                            placeholder="e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                backgroundColor: '#111',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                padding: '14px 14px 14px 48px',
                                color: 'white',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)' }} />
                        <input
                            type="password"
                            placeholder="senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                backgroundColor: '#111',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                padding: '14px 14px 14px 48px',
                                color: 'white',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '14px',
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? 'Entrando...' : (
                            <>
                                Entrar no Sistema <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '32px', fontSize: '12px', color: 'var(--text-disabled)' }}>
                    Protegido por criptografia end-to-end.<br />
                    © 2026 Cidade Viva Education
                </p>
            </div>
        </div>
    );
}
