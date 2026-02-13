'use client';

import { useState } from 'react';
import {
    TrendingUp, TrendingDown, Target, AlertCircle,
    ChevronRight, ChevronDown, Search, Filter,
    Info, ArrowRight, Zap, LayoutGrid
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

const EXECUTION_DATA = [
    {
        id: '1',
        name: 'Marketing e Comunicação',
        orcado: 45000,
        realizado: 52400,
        categoria: 'DESPESA',
        frente: 'PAIDEIA',
        diagnostico: 'Gasto Excepcional (Campanha Matrículas)',
        tendencia: 'up'
    },
    {
        id: '2',
        name: 'Mensalidades Escolares',
        orcado: 280000,
        realizado: 265000,
        categoria: 'RECEITA',
        frente: 'PAIDEIA',
        diagnostico: 'Sazonalidade / Atrasos de Pagamento',
        tendencia: 'down'
    },
    {
        id: '3',
        name: 'Infraestrutura e TI',
        orcado: 12000,
        realizado: 11800,
        categoria: 'DESPESA',
        frente: 'DIVERSOS',
        diagnostico: 'Confirmado',
        tendencia: 'stable'
    },
    {
        id: '4',
        name: 'Doações Projetos Sociais',
        orcado: 50000,
        realizado: 68000,
        categoria: 'RECEITA',
        frente: 'BIBLOS',
        diagnostico: 'Receita Concentrada (Evento Especial)',
        tendencia: 'up'
    },
];

const COST_CENTER_HEATMAP = [
    { name: 'Marketing', exec: 116 },
    { name: 'Acadêmico', exec: 92 },
    { name: 'Financeiro', exec: 88 },
    { name: 'Eventos', exec: 105 },
    { name: 'TI', exec: 98 },
    { name: 'Oikos', exec: 130 },
];

export default function ExecucaoPage() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const calculateVariance = (orcado: number, realizado: number, type: string) => {
        const diff = realizado - orcado;
        const percent = (diff / orcado) * 100;

        // Para despesa, realizado > orcado é RUIM (vermelho)
        // Para receita, realizado > orcado é BOM (verde)
        const isPositive = type === 'RECEITA' ? diff >= 0 : diff <= 0;

        return { diff, percent, isPositive };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-h1">Execução Orçamentária</h1>
                    <p className="text-body">Acompanhamento Realizado vs Planejado (Variações e Diagnósticos)</p>
                </div>
                <div className="card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)' }}>
                    <Target size={20} color="var(--primary)" />
                    <div>
                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Execução Global</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>94.2%</p>
                    </div>
                </div>
            </div>

            {/* Grid: Heatmap + Summary */}
            <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 className="text-h3">Heatmap de Execução por C.Custo (%)</h3>
                        <Info size={16} color="var(--text-disabled)" />
                    </div>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={COST_CENTER_HEATMAP} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" domain={[0, 150]} hide />
                                <YAxis dataKey="name" type="category" stroke="#AAA" fontSize={11} tickLine={false} axisLine={false} width={80} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    formatter={(val: any) => [`${val}%`, 'Execução']}
                                />
                                <Bar dataKey="exec" radius={[0, 4, 4, 0]} barSize={18}>
                                    {COST_CENTER_HEATMAP.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.exec > 110 ? 'var(--danger)' : entry.exec > 95 ? 'var(--primary)' : 'var(--secondary)'} />
                                    ))}
                                </Bar>
                                <ReferenceLine x={100} stroke="white" strokeDasharray="3 3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 className="text-h3">Status da Controladoria</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="card" style={{ background: 'rgba(255, 23, 68, 0.05)', border: 'none', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <AlertCircle size={18} color="var(--danger)" />
                            <p style={{ fontSize: '13px' }}><span style={{ fontWeight: 'bold' }}>Alerta:</span> OIKOS excedeu 130% do orçado.</p>
                        </div>
                        <div className="card" style={{ background: 'rgba(0, 230, 118, 0.05)', border: 'none', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Zap size={18} color="var(--primary)" />
                            <p style={{ fontSize: '13px' }}><span style={{ fontWeight: 'bold' }}>Otimização:</span> TI com economia de 2%.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Execution Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '16px 24px' }}>Dimensão / Conta</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Orçado</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Realizado</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Desvio (R$)</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Desvio (%)</th>
                            <th style={{ padding: '16px' }}>Diagnóstico</th>
                            <th style={{ padding: '16px 24px', width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {EXECUTION_DATA.map(item => {
                            const { diff, percent, isPositive } = calculateVariance(item.orcado, item.realizado, item.categoria);
                            const isExpanded = expandedRow === item.id;

                            return (
                                <React.Fragment key={item.id}>
                                    <tr
                                        style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                                        onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ fontWeight: 600, color: 'white' }}>{item.name}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.frente} • {item.categoria}</p>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>R$ {item.orcado.toLocaleString()}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>R$ {item.realizado.toLocaleString()}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
                                            {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: isPositive ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)',
                                                color: isPositive ? 'var(--success)' : 'var(--danger)',
                                                fontWeight: 'bold'
                                            }}>
                                                {Math.abs(percent).toFixed(1)}%
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                                {isPositive ? <TrendingUp size={14} color="var(--success)" /> : <TrendingDown size={14} color="var(--danger)" />}
                                                <span style={{ color: 'var(--text-secondary)' }}>{item.diagnostico}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </td>
                                    </tr>

                                    {isExpanded && (
                                        <tr style={{ background: 'rgba(255,255,255,0.015)' }}>
                                            <td colSpan={7} style={{ padding: '32px 48px' }}>
                                                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
                                                    <div>
                                                        <h4 style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>Detalhamento por Lançamento</h4>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <LaunchItem title="NF 8821 - Agência X" value={15400} date="12/01" />
                                                            <LaunchItem title="NF 8855 - Impressão" value={37000} date="18/01" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>Análise de Dimensão</h4>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <DimensionItem label="Centro de Custo" value="Marketing" />
                                                            <DimensionItem label="Produto" value="Campanha Paideia" />
                                                            <DimensionItem label="Responsável" value="Renato Assis" />
                                                        </div>
                                                    </div>
                                                    <div className="card" style={{ background: '#111', border: '1px solid #333' }}>
                                                        <h4 style={{ fontSize: '11px', color: 'var(--text-disabled)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Resumo de Variação</h4>
                                                        <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                                            O desvio nesta conta foi causado principalmente pela antecipação de gastos de marketing planejados para Fevereiro. Recomenda-se ajuste na dotação do próximo mês.
                                                        </p>
                                                        <button className="btn btn-ghost" style={{ marginTop: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            Ajustar Orçamento <ArrowRight size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function LaunchItem({ title, value, date }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', paddingBottom: '8px', borderBottom: '1px solid #222' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--text-disabled)' }}>{date}</span>
                <span>{title}</span>
            </div>
            <span style={{ fontWeight: 600 }}>R$ {value.toLocaleString()}</span>
        </div>
    );
}

function DimensionItem({ label, value }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-disabled)' }}>{label}:</span>
            <span style={{ color: 'white' }}>{value}</span>
        </div>
    );
}

import React from 'react';
