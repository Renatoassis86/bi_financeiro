'use client';

import { useState } from 'react';
import {
    Download, FileSpreadsheet, FileText, Filter, Calendar,
    ArrowUpRight, TrendingUp, Info, Printer, Share2,
    ChevronDown, ChevronRight, PieChart, BarChart3, LineChart,
    LayoutGrid, Building2, Package, Search
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart as RechartsLine, Line, AreaChart, Area
} from 'recharts';

const DRE_ROWS = [
    { label: 'RECEITA BRUTA', mensal: 450000, ytd: 1250000, type: 'HEADER' },
    { label: '(-) Deduções e Impostos', mensal: -45000, ytd: -125000, type: 'SUB' },
    { label: 'RECEITA LÍQUIDA', mensal: 405000, ytd: 1125000, type: 'TOTAL' },
    { label: '(-) Custos Diretos', mensal: -180000, ytd: -480000, type: 'SUB' },
    { label: 'LUCRO BRUTO', mensal: 225000, ytd: 645000, type: 'TOTAL' },
    { label: '(-) Despesas Operacionais', mensal: -95000, ytd: -240000, type: 'SUB' },
    { label: '(-) Despesas Administrativas', mensal: -32000, ytd: -85000, type: 'SUB' },
    { label: 'EBITDA', mensal: 98000, ytd: 320000, type: 'TOTAL' },
    { label: '(-) Financeiro / Depreciação', mensal: -8500, ytd: -24000, type: 'SUB' },
    { label: 'LUCRO LÍQUIDO', mensal: 89500, ytd: 296000, type: 'RESULT' },
];

const BUDGET_EXECUTION = [
    { cc: 'Marketing Central', orcado: 50000, realizado: 48500, perc: 97 },
    { cc: 'Acadêmico Paideia', orcado: 120000, realizado: 135000, perc: 112 },
    { cc: 'Infraestrutura', orcado: 35000, realizado: 28000, perc: 80 },
    { cc: 'TI / Sistemas', orcado: 25000, realizado: 24200, perc: 96 },
];

const CASH_FLOW_PROJECTION = [
    { day: 'Dia 1-30', saldo: 145000, cor: 'var(--primary)' },
    { day: 'Dia 31-60', saldo: 182000, cor: 'var(--primary)' },
    { day: 'Dia 61-90', saldo: 215000, cor: 'var(--primary)' },
];

export default function RelatoriosPage() {
    const [activeReport, setActiveReport] = useState('DRE');
    const [selectedFront, setSelectedFront] = useState('CONSOLIDADO');
    const [budgetVersion, setBudgetVersion] = useState('V2.2 - APROVADO 2026');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header com Filtros & Versão do Orçamento */}
            <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="text-h1" style={{ fontSize: '24px' }}>Central de Relatórios Administrativos</h1>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                            <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Filter size={12} color="var(--primary)" />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>Filtro: {selectedFront}</span>
                            </div>
                            <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Calendar size={12} color="var(--secondary)" />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>Competência: Fev/2026</span>
                            </div>
                            <div className="badge" style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Info size={12} />
                                <span style={{ fontSize: '11px', fontWeight: 700 }}>Orçamento: {budgetVersion}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '12px' }}>
                            <FileSpreadsheet size={16} style={{ marginRight: '8px' }} /> Exportar Excel
                        </button>
                        <button className="btn btn-primary" style={{ fontSize: '12px' }}>
                            <Printer size={16} style={{ marginRight: '8px' }} /> Gerar PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Navegação de Relatórios */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                <NavButton active={activeReport === 'DRE'} onClick={() => setActiveReport('DRE')} label="DRE Gerencial" icon={<BarChart3 size={16} />} />
                <NavButton active={activeReport === 'EXECUCAO'} onClick={() => setActiveReport('EXECUCAO')} label="Execução por C.Custo" icon={<Building2 size={16} />} />
                <NavButton active={activeReport === 'CAIXA'} onClick={() => setActiveReport('CAIXA')} label="Projeção 90 Dias" icon={<TrendingUp size={16} />} />
                <NavButton active={activeReport === 'RECEITAS'} onClick={() => setActiveReport('RECEITAS')} label="Receitas x Produtos" icon={<Package size={16} />} />
            </div>

            {/* 3. Área de Dados do Relatório */}
            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>

                {activeReport === 'DRE' && (
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                            <h3 className="text-h3">Demonstrativo de Resultados (Mensal e YTD)</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Valores consolidados em Reais (R$)</p>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-disabled)', fontSize: '11px', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 32px' }}>Categoria Contábil</th>
                                    <th style={{ padding: '16px', textAlign: 'right' }}>Fevereiro (Mensal)</th>
                                    <th style={{ padding: '16px', textAlign: 'right', paddingRight: '40px' }}>Acumulado 2026 (YTD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DRE_ROWS.map((row, i) => (
                                    <tr key={i} style={{
                                        borderBottom: i === DRE_ROWS.length - 1 ? 'none' : '1px solid #1A1A1A',
                                        backgroundColor: row.type === 'TOTAL' || row.type === 'RESULT' ? 'rgba(255,255,255,0.015)' : 'transparent',
                                        fontWeight: row.type === 'HEADER' || row.type === 'TOTAL' || row.type === 'RESULT' ? 700 : 400
                                    }}>
                                        <td style={{ padding: '16px 32px', fontSize: '13px', paddingLeft: row.type === 'SUB' ? '56px' : '32px' }}>{row.label}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: row.mensal < 0 && row.type !== 'SUB' ? 'var(--danger)' : 'white' }}>
                                            {row.mensal < 0 ? `(${Math.abs(row.mensal).toLocaleString()})` : row.mensal.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', paddingRight: '40px', fontSize: '13px', color: row.ytd < 0 && row.type !== 'SUB' ? 'var(--danger)' : 'white' }}>
                                            {row.ytd < 0 ? `(${Math.abs(row.ytd).toLocaleString()})` : row.ytd.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeReport === 'EXECUCAO' && (
                    <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                        <div className="card" style={{ padding: 0 }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #222' }}>
                                <h3 className="text-h3">Execução por Centro de Custo</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-disabled)', fontSize: '10px' }}>
                                        <th style={{ padding: '16px 24px', textAlign: 'left' }}>Centro de Custo</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Orçado (R$)</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Realizado (R$)</th>
                                        <th style={{ padding: '16px', textAlign: 'center' }}>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BUDGET_EXECUTION.map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600 }}>{item.cc}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>{item.orcado.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>{item.realizado.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: item.perc > 100 ? 'var(--danger)' : 'var(--success)' }}>{item.perc}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card">
                            <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px' }}>Cargas por Frente</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={BUDGET_EXECUTION} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="cc" type="category" stroke="#555" fontSize={11} width={100} />
                                        <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                                        <Bar dataKey="realizado" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeReport === 'CAIXA' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div>
                                <h3 className="text-h3">Projeção de Caixa 90 Dias</h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Simulação baseada em compromissos e recorrência</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Saldo Final Projetado</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>R$ 215.000</h2>
                            </div>
                        </div>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CASH_FLOW_PROJECTION}>
                                    <defs>
                                        <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="day" stroke="#555" fontSize={12} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#555" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                                    <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="saldo" stroke="var(--primary)" strokeWidth={3} fill="url(#colorCash)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeReport === 'RECEITAS' && (
                    <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                        <div className="card">
                            <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px' }}>Receita por Modalidade</h3>
                            <div style={{ height: '240px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{ name: 'Recorrente', value: 70 }, { name: 'Venda Unica', value: 30 }]} innerRadius={60} outerRadius={80} dataKey="value">
                                            <Cell fill="var(--primary)" />
                                            <Cell fill="var(--secondary)" />
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#111', border: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="card" style={{ padding: 0 }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #222' }}>
                                <h3 className="text-h3">Rentabilidade por Produto</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-disabled)', fontSize: '10px' }}>
                                        <th style={{ padding: '16px 24px', textAlign: 'left' }}>Produto / Serviço</th>
                                        <th style={{ padding: '16px' }}>Qtde</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Bruto (R$)</th>
                                        <th style={{ padding: '16px', textAlign: 'right', paddingRight: '24px' }}>Margem (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { p: 'Mensalidade Escolar', q: 120, b: 350000, m: 72 },
                                        { p: 'Curso de Liderança', q: 45, b: 85000, m: 45 },
                                        { p: 'Material Literário', q: 210, b: 15000, m: 30 }
                                    ].map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '13px' }}>{item.p}</td>
                                            <td style={{ padding: '16px', textAlign: 'center', fontSize: '13px' }}>{item.q}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>{item.b.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', paddingRight: '24px', fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>{item.m}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

function NavButton({ active, label, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
                borderRadius: '10px', background: active ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.02)',
                border: active ? '1px solid var(--primary)' : '1px solid #222',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap'
            }}
        >
            {icon}
            {label}
        </button>
    );
}
