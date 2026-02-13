'use client';

import { useState } from 'react';
import {
    Plus, Search, MoreHorizontal, ChevronRight, ChevronDown,
    LayoutGrid, ArrowLeft, Download, PlusCircle, Building2
} from 'lucide-react';
import Link from 'next/link';

const COST_CENTERS = [
    {
        id: '1',
        code: '10',
        name: 'ADMINISTRAÇÃO CENTRAL',
        children: [
            { id: '1.1', code: '10.01', name: 'Gestão Executiva' },
            { id: '1.2', code: '10.02', name: 'Financeiro / Controladoria' },
            { id: '1.3', code: '10.03', name: 'Recursos Humanos' },
        ]
    },
    {
        id: '2',
        code: '20',
        name: 'UNIDADE PAIDEIA (EDUCAÇÃO)',
        children: [
            { id: '2.1', code: '20.01', name: 'Escola Cidade Viva - Primário' },
            { id: '2.2', code: '20.02', name: 'Escola Cidade Viva - Secundário' },
        ]
    },
    {
        id: '3',
        code: '30',
        name: 'UNIDADE OIKOS (FAMÍLIA)',
        children: [
            { id: '3.1', code: '30.01', name: 'Aconselhamento' },
            { id: '3.2', code: '30.02', name: 'Eventos e Cursos' },
        ]
    }
];

export default function CentrosCustoPage() {
    const [expanded, setExpanded] = useState<string[]>(['1', '2']);

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
                        padding: depth === 0 ? '16px 24px' : '12px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: depth === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        cursor: 'pointer'
                    }}
                    onClick={() => isFolder && toggleExpand(item.id)}
                >
                    <div style={{ width: depth * 24 }} />
                    <div style={{ marginRight: '12px', color: isFolder ? 'var(--primary)' : 'var(--text-disabled)' }}>
                        {isFolder ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{ width: 14 }} />}
                    </div>
                    <div style={{ width: '80px', fontSize: '12px', color: 'var(--text-disabled)' }}>{item.code}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {depth === 0 ? <Building2 size={16} /> : <LayoutGrid size={14} opacity={0.5} />}
                        <span style={{ fontWeight: depth === 0 ? 600 : 400 }}>{item.name}</span>
                    </div>
                    <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end', gap: '12px', color: 'var(--text-disabled)' }}>
                        <Plus size={16} />
                        <MoreHorizontal size={16} />
                    </div>
                </div>
                {isFolder && isExpanded && item.children.map((child: any) => renderRow(child, depth + 1))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/cadastros" className="btn btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-h1">Centros de Custo</h1>
                        <p className="text-body">Unidades de alocação e responsabilidade financeira</p>
                    </div>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={18} /> Novo Centro
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-disabled)' }}>
                    <div style={{ width: '14px', marginRight: '12px' }}></div>
                    <div style={{ width: '80px' }}>CÓDIGO</div>
                    <div style={{ flex: 1 }}>NOME DA UNIDADE / CENTRO</div>
                    <div style={{ width: '100px', textAlign: 'right' }}>AÇÕES</div>
                </div>
                {COST_CENTERS.map(root => renderRow(root))}
            </div>
        </div>
    );
}
