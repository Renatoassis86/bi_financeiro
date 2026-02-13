'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
    const pathname = usePathname();
    const pageName = pathname === '/' ? 'Dashboard Executivo' : pathname.replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-width)',
            right: 0,
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            zIndex: 40,
            backdropFilter: 'blur(12px)',
            background: 'rgba(10, 10, 10, 0.75)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{pageName}</h2>
                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

                {/* Global Filters Grid */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Filter size={14} />
                        <span>Filtros:</span>
                    </div>

                    <FilterDropdown label="Ano" value="2026" />
                    <FilterDropdown label="Período" value="Janeiro" />
                    <FilterDropdown label="Frente" value="Consolidado" />
                    <FilterDropdown label="C. Custo" value="Todos" />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right', marginRight: '8px' }}>
                    <p style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Status do Sistema</p>
                    <p style={{ fontSize: '12px', color: 'white' }}>Dados Atualizados</p>
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
            </div>
        </header>
    );
}

function FilterDropdown({ label, value }: { label: string, value: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            transition: 'all 0.2s'
        }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
            <span style={{ fontSize: '11px', opacity: 0.7 }}>{label}:</span>
            <span style={{ color: 'white', fontWeight: 500 }}>{value}</span>
            <ChevronDown size={14} />
        </div>
    );
}
