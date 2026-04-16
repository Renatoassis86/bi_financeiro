'use client';

import { Bell, Search, Globe, Compass, ShieldCheck, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
    const pathname = usePathname();

    const formatPageName = (path: string) => {
        if (path === '/') return 'Resumo Executivo';
        return path
            .split('/')
            .filter(Boolean)
            .pop()
            ?.replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || 'Financeiro';
    };

    const pageName = formatPageName(pathname);

    return (
        <header style={{
            height: 'var(--topbar-height)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 100px',
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-subtle)',
            zIndex: 40,
            flexShrink: 0
        }}>
            {/* Left Column: Title & Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                        {pageName}
                    </h2>
                </div>

                <div style={{ width: '1px', height: '48px', backgroundColor: 'var(--border-subtle)' }} />

                {/* AI-Powered Search */}
                <div style={{ position: 'relative', width: '380px' }}>
                    <Search
                        size={16}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)' }}
                    />
                    <input
                        placeholder="Pesquisar registros e auditoria analítica..."
                        style={{
                            width: '100%',
                            padding: '14px 20px 14px 52px',
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'var(--transition)'
                        }}
                        className="topbar-search-focus"
                    />
                </div>
            </div>

            {/* Right Column: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6, cursor: 'pointer' }} className="hover:opacity-100 transition-opacity">
                    <Globe size={18} color="white" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'white' }}>PT-BR</span>
                    <ChevronDown size={14} color="var(--text-disabled)" />
                </div>

                <div style={{ position: 'relative', cursor: 'pointer', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-input)' }} className="hover:brightness-125 transition-all">
                    <Bell size={20} color="var(--text-secondary)" />
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '8px', height: '8px', backgroundColor: 'var(--danger)',
                        borderRadius: '50%', border: '2px solid var(--bg-sidebar)'
                    }} />
                </div>

                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 24px', backgroundColor: 'var(--primary-subtle)',
                    borderRadius: '12px', border: '1px solid var(--border-active)'
                }}>
                    <ShieldCheck size={16} className="text-[var(--primary)]" />
                    <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.1em' }}>AMBIENTE SEGURO</span>
                </div>
            </div>

            <style jsx>{`
                .topbar-search-focus:focus {
                    border-color: var(--primary);
                    background-color: #1A202A !important;
                    box-shadow: 0 0 0 4px var(--primary-subtle);
                }
            `}</style>
        </header>
    );
}
