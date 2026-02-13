'use client';

import { Plus, ListTree, Target, Users, Package, Home } from 'lucide-react';
import Link from 'next/link';

const MODULES = [
    {
        title: 'Plano de Contas',
        description: 'Gestão da estrutura hierárquica de receitas e despesas.',
        icon: ListTree,
        path: '/cadastros/plano-contas',
        color: 'var(--primary)'
    },
    {
        title: 'Centros de Custo',
        description: 'Segmentação por departamentos e unidades de negócio.',
        icon: Target,
        path: '/cadastros/centros-custo',
        color: 'var(--secondary)'
    },
    {
        title: 'Clientes e Fornecedores',
        description: 'Cadastro de entidades externas e parceiros.',
        icon: Users,
        path: '/cadastros/entidades',
        color: 'var(--warning)'
    },
    {
        title: 'Produtos e Projetos',
        description: 'Catálogo de itens faturáveis e frentes de trabalho.',
        icon: Package,
        path: '/cadastros/produtos',
        color: 'var(--success)'
    },
];

export default function CadastrosPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 className="text-h1">Cadastros e Configurações</h1>
                <p className="text-body">Gerencie os fundamentos e dimensões do sistema financeiro</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {MODULES.map((module, i) => (
                    <Link key={i} href={module.path} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{
                            display: 'flex',
                            gap: '24px',
                            alignItems: 'center',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '24px',
                                borderRadius: '16px',
                                color: module.color
                            }}>
                                <module.icon size={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 className="text-h3" style={{ marginBottom: '8px' }}>{module.title}</h3>
                                <p className="text-body" style={{ fontSize: '14px' }}>{module.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                                    Acessar Módulo <Plus size={14} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
