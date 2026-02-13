'use client';

import { Bell, Calendar, ChevronDown, Filter, HelpCircle, Layers, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
    const pathname = usePathname();
    const pageName = pathname === '/' ? 'Dashboard' : pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2).replace('-', ' ');

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-width)',
            right: 0,
            height: 'var(--topbar-height)',
            backgroundColor: 'var(--bg-main)', // Transparent/Blur effect could be nice, but stick to solid for now
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            zIndex: 40,
            backdropFilter: 'blur(10px)',
            background: 'rgba(10, 10, 10, 0.8)'
        }}>
            {/* Left: Breadcrumb/Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{pageName}</h2>

                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

                {/* Global Filter Trigger */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                }}>
                    <Filter size={14} />
                    <span>Filtros Globais:</span>
                    <span style={{ color: 'white' }}>2025 • Todas Frentes</span>
                    <ChevronDown size={14} />
                </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ position: 'relative' }}>
                    <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--danger)'
                    }} />
                </div>
                <HelpCircle size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            </div>
        </header>
    );
}
