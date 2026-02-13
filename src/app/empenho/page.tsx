'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download,
    FileCheck, ShieldAlert, History,
    TrendingDown, PieChart, Info
} from 'lucide-react';

const EMPENHOS = [
    {
        id: 'EMP-2026-001',
        descricao: 'Reforma do Bloco B - Escola Paideia',
        setor: 'Infraestrutura',
        valor_total: 150000.00,
        valor_consumido: 45000.00,
        saldo: 105000.00,
        status: 'BLOQUEADO',
        validade: '31/12/2026'
    },
    {
        id: 'EMP-2026-002',
        descricao: 'Material Didático Anual',
        setor: 'Acadêmico',
        valor_total: 80000.00,
        valor_consumido: 78500.00,
        saldo: 1500.00,
        status: 'CRÍTICO',
        validade: '30/06/2026'
    },
    {
        id: 'EMP-2026-003',
        descricao: 'Campanha de Marketing Oikos',
        setor: 'Marketing',
        valor_total: 25000.00,
        valor_consumido: 0.00,
        saldo: 25000.00,
        status: 'LIBERADO',
        validade: '31/03/2026'
    },
];

export default function EmpenhoPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Controle de Empenho</h1>
                    <p className="text-body">Reserva e bloqueio de dotação orçamentária por projeto</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCheck size={18} /> Novo Empenho
                    </button>
                </div>
            </div>

            {/* Summary Matrix */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px' }}>Limite Total Bloqueado</p>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>R$ 1.250.000</h2>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px' }}>Valor Executado (Real)</p>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>R$ 485.300</h2>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px' }}>Disponibilidade Líquida</p>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>R$ 764.700</h2>
                </div>
            </div>

            {/* Main List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-h3">Projetos em Empenho</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <input placeholder="Buscar projeto..." style={{ background: '#0A0A0A', border: '1px solid #333', color: 'white', padding: '8px 12px 8px 36px', borderRadius: '6px', fontSize: '13px' }} />
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        </div>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-disabled)' }}>
                            <th style={{ padding: '16px 24px' }}>Cód. Empenho</th>
                            <th style={{ padding: '16px' }}>Projeto / Descrição</th>
                            <th style={{ padding: '16px' }}>Total Empenhado</th>
                            <th style={{ padding: '16px' }}>Consumo (%)</th>
                            <th style={{ padding: '16px' }}>Saldo Disponível</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {EMPENHOS.map(emp => {
                            const percent = (emp.valor_consumido / emp.valor_total) * 100;
                            return (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{emp.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: 600 }}>{emp.descricao}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{emp.setor}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>R$ {emp.valor_total.toLocaleString()}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ width: '100px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                                                <span>{percent.toFixed(1)}%</span>
                                            </div>
                                            <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                                                <div style={{
                                                    width: `${percent}%`,
                                                    height: '100%',
                                                    background: percent > 90 ? 'var(--danger)' : percent > 50 ? 'var(--warning)' : 'var(--primary)',
                                                    borderRadius: '2px'
                                                }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: emp.saldo < 10000 ? 'var(--danger)' : 'white' }}>
                                        R$ {emp.saldo.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <StatusBadge status={emp.status} />
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button className="btn btn-ghost" style={{ padding: '6px' }}><History size={16} /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Rules Notice */}
            <div className="card" style={{ background: 'rgba(41, 121, 255, 0.05)', borderColor: 'rgba(41, 121, 255, 0.2)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <ShieldAlert size={32} color="var(--primary)" />
                <div>
                    <h4 style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Políticas de Empenho Ativas</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Projetos com consumo superior a 95% bloqueiam automaticamente novos lançamentos no centro de custo associado até que ocorra um suplemento orçamentário.
                    </p>
                </div>
            </div>

        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'BLOQUEADO': { bg: 'rgba(255, 255, 255, 0.05)', color: 'white' },
        'CRÍTICO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
        'LIBERADO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
    };
    const style = styles[status] || { bg: '#333', color: '#AAA' };
    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: style.bg,
            color: style.color
        }}>
            {status}
        </span>
    );
}
