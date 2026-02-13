'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart2,
    PieChart,
    DollarSign,
    TrendingUp,
    Briefcase,
    FileText,
    Settings,
    Bell,
    Users,
    Grid
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', path: '/', icon: Grid },
    { name: 'Orçamento', path: '/orcamento', icon: PieChart },
    { name: 'Execução', path: '/execucao', icon: BarChart2 },
    { name: 'Fluxo de Caixa', path: '/fluxo-caixa', icon: TrendingUp },
    { name: 'Receitas', path: '/receitas', icon: DollarSign },
    { name: 'Despesas', path: '/despesas', icon: FileText },
    { name: 'Empenho', path: '/empenho', icon: Briefcase },
    { name: 'Cadastros', path: '/cadastros', icon: Users },
    { name: 'Alertas', path: '/alertas', icon: Bell },
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 50
        }}>
            <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    letterSpacing: '-0.5px'
                }}>
                    Cidade Viva <span style={{ color: 'white' }}>Finance</span>
                </h1>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ERP + BI Suite
                </p>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                backgroundColor: isActive ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none'
                            }}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
                marginTop: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }}>
                        AD
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Admin User</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Controller</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
