'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, BarChart3, Brain, LineChart,
    ArrowUpRight, CreditCard, Landmark, Calculator,
    ListTree, ArrowRightLeft, Briefcase, ShoppingCart,
    Shield, Settings, Users, LogOut, Upload
} from 'lucide-react';

const SECTIONS = [
    {
        title: 'ESTRATÉGIA E BI',
        items: [
            { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'var(--primary)' },
            { name: 'Consolidado BI', path: '/orcamento/consolidado', icon: BarChart3, color: 'var(--accent-azure)' },
            { name: 'Relatórios DRE', path: '/relatorios/dre', icon: Calculator, color: 'var(--accent-azure)' },
        ]
    },
    {
        title: 'GESTÃO FINANCEIRA',
        items: [
            { name: 'Fluxo de Caixa', path: '/fluxo-caixa', icon: LineChart, color: 'var(--accent-gold)' },
            { name: 'Contas a Receber', path: '/financeiro/contas-receber', icon: ArrowUpRight, color: 'var(--primary)' },
            { name: 'Contas a Pagar', path: '/financeiro/contas-pagar', icon: CreditCard, color: 'var(--accent-slate)' },
            { name: 'Conciliação', path: '/financeiro/conciliacao', icon: Landmark, color: 'var(--accent-azure)' },
        ]
    },
    {
        title: 'AÇÕES OPERACIONAIS',
        items: [
            { name: 'Importador de Dados', path: '/orcamento/importacao-anual', icon: Upload, color: '#F43F5E' },
        ]
    },
    {
        title: 'CONTROLADORIA',
        items: [
            { name: 'Planejamento Estratégico', path: '/orcamento/planejamento-estrategico', icon: Brain, color: 'var(--accent-azure)' },
            { name: 'Proposta Orçamentária', path: '/orcamento/consolidado', icon: BarChart3, color: 'var(--primary)' },
            { name: 'Estruturador (Manual)', path: '/orcamento/estruturador', icon: ListTree, color: 'var(--primary)' },
            { name: 'Remanejamento', path: '/orcamento/remanejamento', icon: ArrowRightLeft, color: 'var(--accent-gold)' },
        ]
    },
    {
        title: 'ADMINISTRAÇÃO',
        items: [
            { name: 'Segurança', path: '/seguranca', icon: Shield, color: 'var(--accent-slate)' },
            { name: 'Configurações', path: '/settings', icon: Settings, color: 'var(--accent-slate)' },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = () => {
        // Limpa o cookie de sessão (Mock ou Real)
        document.cookie = "cv_finance_user_mock=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redireciona para o login
        router.push('/login');
    };

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 50
        }}>
            {/* 1. Header Area (Branding) */}
            <div style={{ padding: '40px 32px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <img
                        src="/logo_email.png"
                        alt="Cidade Viva"
                        style={{ height: '36px', width: 'auto', filter: 'brightness(1.2)', objectFit: 'contain' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '4px', height: '18px', background: 'linear-gradient(to bottom, var(--primary), var(--primary-light))', borderRadius: '4px' }} />
                        <h2 style={{ fontSize: '15px', fontWeight: 900, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Education <span style={{ color: 'var(--primary)', opacity: 0.8 }}>Finance</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* 2. Navigation Area (FLEX COLUMN) */}
            <nav style={{ flex: 1, padding: '0 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '40px' }} className="custom-scrollbar">
                {SECTIONS.map((section) => (
                    <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-slate)', letterSpacing: '0.15em', paddingLeft: '12px', textTransform: 'uppercase' }}>
                            {section.title}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {section.items.map((item) => {
                                const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            padding: '14px 12px',
                                            borderRadius: '12px',
                                            color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                                            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                                            transition: 'all 0.2s',
                                            textDecoration: 'none',
                                            position: 'relative'
                                        }}
                                        className="sidebar-link-hover"
                                    >
                                        <item.icon
                                            size={18}
                                            style={{
                                                color: isActive ? 'white' : (item.color || 'inherit'),
                                                opacity: isActive ? 1 : 0.6
                                            }}
                                        />
                                        <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500 }}>
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <div style={{
                                                position: 'absolute',
                                                left: '-12px',
                                                width: '4px',
                                                height: '20px',
                                                backgroundColor: 'var(--primary)',
                                                borderRadius: '0 4px 4px 0',
                                                boxShadow: '0 0 10px var(--primary)'
                                            }} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* 3. Profile Area */}
            <div style={{ padding: '32px 24px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} className="text-[var(--primary)]" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Renato Assis</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chief Manager</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)',
                        color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }} className="hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut size={14} /> ENCERRAR SESSÃO
                </button>
            </div>

            <style jsx>{`
                .sidebar-link-hover:hover {
                    background-color: rgba(255, 255, 255, 0.03) !important;
                    color: white !important;
                }
            `}</style>
        </aside>
    );
}
