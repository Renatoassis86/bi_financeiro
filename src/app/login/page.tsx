'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
            // 1. Tenta autenticação real com Supabase
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (data?.user) {
                router.push('/');
                router.refresh();
                return;
            }

            // 2. Fallback para Mock (Usuário Administrativo de Emergência)
            if (email === 'renato.consultoria@cidadeviva.org' && password === 'renatoadmin2026') {
                document.cookie = "cv_finance_user_mock=true; path=/; max-age=86400";
                router.push('/');
                router.refresh();
            } else {
                setError(authError?.message || 'Credenciais inválidas para o ambiente de BI.');
                setLoading(false);
            }
        } catch (err) {
            setError('Falha na conexão com o servidor de segurança.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            backgroundColor: '#050505',
            color: 'white',
            overflow: 'hidden'
        }}>
            {/* Left Side: Cinematic Visual */}
            <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(to right, #050505, transparent 90%), url("/images/auth-bg.jpg")', // Fallback or grain
                backgroundSize: 'cover'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(2px)'
                }} />

                <div style={{ position: 'relative', zIndex: 10, padding: '60px', maxWidth: '600px' }}>
                    <p style={{
                        fontSize: '12px', fontWeight: 900, color: 'var(--secondary)',
                        textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '16px'
                    }}>
                        Controladoria Estratégica
                    </p>
                    <h1 className="font-serif" style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: '24px' }}>
                        Excelência que <span style={{ color: 'var(--primary)' }}>permanece.</span>
                    </h1>
                    <p style={{ fontSize: '18px', color: '#888', maxWidth: '450px', lineHeight: 1.6 }}>
                        Transparência total e inteligência financeira para o grupo Cidade Viva.
                    </p>

                    <div style={{ marginTop: '48px', display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--primary)' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>Consolidação Global</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--primary)' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>BI em Tempo Real</span>
                        </div>
                    </div>
                </div>


            </div>

            {/* Right Side: Luxury Form Box */}
            <div style={{
                width: '500px',
                backgroundColor: '#080808',
                borderLeft: '1px solid #1A1A1A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px',
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <img
                        src="/logo_assinatura_horizontal.png"
                        alt="Cidade Viva Education"
                        style={{ width: '180px', marginBottom: '32px', filter: 'brightness(1.1)' }}
                    />
                    <h2 className="font-serif" style={{ fontSize: '28px', color: 'var(--primary)' }}>Acesso Restrito</h2>
                    <p style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>Pátio das Nações • Controladoria Geral</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', backgroundColor: 'rgba(255,0,0,0.05)',
                        border: '1px solid rgba(255,0,0,0.2)', color: '#ff4444',
                        borderRadius: '2px', fontSize: '12px', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <ShieldCheck size={14} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '10px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Email Institucional</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@cidadeviva.org"
                                required
                                style={{
                                    width: '100%', padding: '16px 16px 16px 48px',
                                    background: '#040404', border: '1px solid #1A1A1A',
                                    borderRadius: '2px', color: 'white', outline: 'none',
                                    fontSize: '14px', transition: 'border-color 0.3s'
                                }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: '10px', color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Senha de Segurança</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '16px 16px 16px 48px',
                                    background: '#040404', border: '1px solid #1A1A1A',
                                    borderRadius: '2px', color: 'white', outline: 'none',
                                    fontSize: '14px', transition: 'border-color 0.3s'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '18px', marginTop: '12px' }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%' }} />
                                AUTENTICANDO...
                            </div>
                        ) : (
                            <>ESTABELECER CONEXÃO <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', opacity: 0.3 }}>
                        <Sparkles size={16} />
                        <Lock size={16} />
                        <ShieldCheck size={16} />
                    </div>
                    <p style={{ fontSize: '10px', color: '#333', letterSpacing: '0.1em' }}>
                        NEXT-GEN BI INFRASTRUCTURE v2026.1<br />
                        SISTEMA CIDADE VIVA EDUCATION
                    </p>
                </div>
            </div>

            <style jsx>{`
                input:focus {
                    border-color: var(--primary) !important;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
