'use client';

import { useState } from 'react';
import {
    Plus, Search, MoreHorizontal, ChevronRight, ChevronDown,
    Folder, FileText, ArrowLeft, Download, PlusCircle
} from 'lucide-react';
import Link from 'next/link';

const PLAN_DATA = [
    {
        id: '1',
        code: '1',
        name: 'RECEITAS',
        type: 'RECEITA',
        level: 1,
        children: [
            {
                id: '1.1',
                code: '1.1',
                name: 'RECEITAS OPERACIONAIS',
                type: 'RECEITA',
                level: 2,
                children: [
                    { id: '1.1.01', code: '1.1.01', name: 'Mensalidades Escolares', type: 'RECEITA', level: 3 },
                    { id: '1.1.02', code: '1.1.02', name: 'Taxas de Inscrição', type: 'RECEITA', level: 3 },
                    { id: '1.1.03', code: '1.1.03', name: 'Venda de Material', type: 'RECEITA', level: 3 },
                ]
            },
            {
                id: '1.2',
                code: '1.2',
                name: 'RECEITAS FINANCEIRAS',
                type: 'RECEITA',
                level: 2,
                children: [
                    { id: '1.2.01', code: '1.2.01', name: 'Rendimento de Aplicações', type: 'RECEITA', level: 3 },
                ]
            }
        ]
    },
    {
        id: '2',
        code: '2',
        name: 'DESPESAS',
        type: 'DESPESA',
        level: 1,
        children: [
            {
                id: '2.1',
                code: '2.1',
                name: 'DESPESAS COM PESSOAL',
                type: 'DESPESA',
                level: 2,
                children: [
                    { id: '2.1.01', code: '2.1.01', name: 'Salários e Ordenados', type: 'DESPESA', level: 3 },
                    { id: '2.1.02', code: '2.1.02', name: 'Encargos Sociais', type: 'DESPESA', level: 3 },
                    { id: '2.1.03', code: '2.1.03', name: 'Benefícios', type: 'DESPESA', level: 3 },
                ]
            }
        ]
    }
];

export default function PlanoContasPage() {
    const [expanded, setExpanded] = useState<string[]>(['1', '2', '1.1']);

    const toggleExpand = (id: string) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const renderRow = (item: any, depth = 0) => {
        const isFolder = item.children && item.children.length > 0;
        const isExpanded = expanded.includes(item.id);

        return (
            <div key={item.id}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: depth === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => isFolder && toggleExpand(item.id)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = depth === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
                >
                    {/* Indentation */}
                    <div style={{ width: depth * 24 }} />

                    {/* Icon */}
                    <div style={{ marginRight: '12px', color: isFolder ? 'var(--primary)' : 'var(--text-disabled)' }}>
                        {isFolder ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : <div style={{ width: 14 }} />}
                    </div>

                    <div style={{ width: '100px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {item.code}
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isFolder ? <Folder size={16} style={{ opacity: 0.6 }} /> : <FileText size={16} style={{ opacity: 0.4 }} />}
                        <span style={{ fontWeight: depth < 2 ? 600 : 400, color: depth === 0 ? 'white' : 'var(--text-secondary)' }}>
                            {item.name}
                        </span>
                    </div>

                    <div style={{ width: '100px', textAlign: 'center' }}>
                        <span style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: item.type === 'RECEITA' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                            color: item.type === 'RECEITA' ? 'var(--success)' : 'var(--danger)',
                            fontWeight: 'bold'
                        }}>
                            {item.type}
                        </span>
                    </div>

                    <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end', gap: '12px', color: 'var(--text-disabled)' }}>
                        <Plus size={16} style={{ cursor: 'pointer' }} />
                        <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {isFolder && isExpanded && item.children.map((child: any) => renderRow(child, depth + 1))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/cadastros" className="btn btn-ghost" style={{ padding: '8px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-h1">Plano de Contas</h1>
                        <p className="text-body">Estrutura organizacional de naturezas financeiras</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Importar Estrutura
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlusCircle size={18} /> Novo Item
                    </button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Filtro:</span>
                        <select style={{ background: '#0A0A0A', border: '1px solid #333', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
                            <option>Todos</option>
                            <option>Apenas Receitas</option>
                            <option>Apenas Despesas</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            placeholder="Buscar por código ou nome..."
                            style={{ background: '#0A0A0A', border: '1px solid #333', color: 'white', padding: '8px 12px 8px 36px', borderRadius: '6px', fontSize: '13px', width: '300px' }}
                        />
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>
                    Total: 42 contas cadastradas
                </div>
            </div>

            {/* Tree Grid */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                    display: 'flex',
                    padding: '16px 24px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: 'var(--text-disabled)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    <div style={{ width: depthWidth(0), marginRight: '12px' }}></div>
                    <div style={{ width: '100px' }}>Código</div>
                    <div style={{ flex: 1 }}>Nome da Conta</div>
                    <div style={{ width: '100px', textAlign: 'center' }}>Tipo</div>
                    <div style={{ width: '100px', textAlign: 'right' }}>Ações</div>
                </div>

                {PLAN_DATA.map(root => renderRow(root))}
            </div>

        </div>
    );
}

const depthWidth = (d: number) => (d * 24) + 14;
