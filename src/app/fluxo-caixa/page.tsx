'use client';

import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Line, Area
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, Search, Download,
    Calendar, ArrowRightLeft, Filter, ChevronRight, ChevronDown
} from 'lucide-react';

const flowData = [
    { name: 'Jan', previsto: 450000, realizado: 420000, saldo: -30000 },
    { name: 'Fev', previsto: 480000, realizado: 510000, saldo: 30000 },
    { name: 'Mar', previsto: 500000, realizado: 490000, saldo: -10000 },
    { name: 'Abr', previsto: 520000, realizado: 0, saldo: 0, isForecast: true },
    { name: 'Mai', previsto: 540000, realizado: 0, saldo: 0, isForecast: true },
    { name: 'Jun', previsto: 560000, realizado: 0, saldo: 0, isForecast: true },
];

const detailedEntries = [
    { id: 1, data: '12/02/2026', descricao: 'Mensalidades Paideia - Lote 01', conta: 'Receita Operacional', previsto: 150000, realizado: 148500, status: 'Divergente', frente: 'PAIDEIA' },
    { id: 2, data: '13/02/2026', descricao: 'Fornecedor de TI - AWS', conta: 'Serviços Terceiros', previsto: 12000, realizado: 12150, status: 'Confirmado', frente: 'DIVERSOS' },
    { id: 3, data: '15/02/2026', descricao: 'Folha de Pagamento - Professores', conta: 'Salários', previsto: 280000, realizado: 0, status: 'Provisionado', frente: 'PAIDEIA' },
    { id: 4, data: '18/02/2026', descricao: 'Doações Projetos Sociais', conta: 'Doações', previsto: 45000, realizado: 48200, status: 'Excedente', frente: 'BIBLOS' },
    { id: 5, data: '20/02/2026', descricao: 'Manutenção Predial Oikos', conta: 'Infraestrutura', previsto: 8000, realizado: 0, status: 'Provisionado', frente: 'OIKOS' },
];

export default function FluxoCaixaPage() {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Fluxo de Caixa</h1>
                    <p className="text-body">Análise comparativa de Previsão vs Realização Financeira</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Exportar
                    </button>
                    <button className="btn btn-primary">Gerar Previsão</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <SummaryCard title="Saldo em Conta" value="R$ 1.150.000" trend="+2.4%" icon={<WalletIcon />} />
                <SummaryCard title="Receitas Pendentes" value="R$ 425.800" trend="Próximos 30 dias" icon={<ArrowUpRight size={20} />} />
                <SummaryCard title="Despesas Provisionadas" value="R$ 312.400" trend="Próximos 30 dias" icon={<ArrowDownRight size={20} />} />
                <SummaryCard title="Resultado Projetado" value="R$ 113.400" trend="Superávit" icon={<ZapIcon />} color="var(--primary)" />
            </div>

            {/* Charts Section */}
            <div className="card" style={{ height: '400px' }}>
                <h3 className="text-h3" style={{ marginBottom: '24px' }}>Projeção de Disponibilidade (Previsto x Realizado)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={flowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} />
                        <Bar dataKey="realizado" name="Realizado" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                        <Line type="monotone" dataKey="previsto" name="Previsto" stroke="var(--secondary)" strokeWidth={2} dot={{ r: 4 }} />
                        <Area type="monotone" dataKey="saldo" name="Delta" fill="rgba(41, 121, 255, 0.1)" stroke="none" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Grid */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-h3">Grade de Lançamentos (Previsto vs Realizado)</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                placeholder="Pesquisar descrição..."
                                style={{ background: '#0A0A0A', border: '1px solid #333', color: 'white', padding: '8px 12px 8px 36px', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        </div>
                        <button style={{ background: '#1A1A1A', border: '1px solid #333', color: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={14} /> Filtro Avançado
                        </button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px 24px' }}>Ref.</th>
                            <th style={{ padding: '16px' }}>Data</th>
                            <th style={{ padding: '16px' }}>Descrição / Favorecido</th>
                            <th style={{ padding: '16px' }}>Frente</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Previsto</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Realizado</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailedEntries.map((row) => (
                            <React.Fragment key={row.id}>
                                <tr style={{ borderBottom: '1px solid var(--border-subtle)', hover: { backgroundColor: 'rgba(255,255,255,0.01)' }, cursor: 'pointer' }} onClick={() => toggleRow(row.id)}>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-disabled)' }}>#{row.id.toString().padStart(4, '0')}</td>
                                    <td style={{ padding: '16px' }}>{row.data}</td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: 600 }}>{row.descricao}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{row.conta}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge badge-${row.frente.toLowerCase()}`}>{row.frente}</span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 500 }}>R$ {row.previsto.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: row.realizado > 0 ? 'white' : 'var(--text-disabled)' }}>
                                        {row.realizado > 0 ? `R$ ${row.realizado.toLocaleString()}` : '—'}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        {expandedRows.includes(row.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </td>
                                </tr>
                                {expandedRows.includes(row.id) && (
                                    <tr style={{ backgroundColor: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td colSpan={8} style={{ padding: '24px 48px' }}>
                                            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                                                <div>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Centro de Custo</p>
                                                    <p style={{ fontSize: '14px' }}>Marketing e Comunicação</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Documento</p>
                                                    <p style={{ fontSize: '14px' }}>NF-e 88234 / Recibo</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Variação</p>
                                                    <p style={{ fontSize: '14px', color: row.realizado > row.previsto ? 'var(--danger)' : 'var(--success)' }}>
                                                        {row.realizado > 0 ? `${(((row.realizado - row.previsto) / row.previsto) * 100).toFixed(1)}%` : 'N/A'}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                                                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>Anexos</button>
                                                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>Auditoria</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function SummaryCard({ title, value, trend, icon, color = 'white' }: any) {
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color }}>{value}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginTop: '2px' }}>{trend}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'Divergente': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
        'Confirmado': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'Provisionado': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)' },
        'Excedente': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
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

import React from 'react';
function WalletIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg> }
function ZapIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> }
