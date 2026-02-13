'use client';

import { useState } from 'react';
import {
    Download, Filter, ChevronRight, ChevronDown,
    TrendingUp, TrendingDown, Calendar, CreditCard,
    BarChart3, PieChart, FileText, Share2, Printer,
    ArrowRight, Info, CheckCircle2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';

const DRE_DATA = [
    { label: 'RECEITA BRUTA', valor: 850000, yoy: '+12%', type: 'HEADER' },
    { label: '(-) Deduções e Impostos', valor: -125000, yoy: '+5%', type: 'SUB' },
    { label: 'RECEITA LÍQUIDA', valor: 725000, yoy: '+14%', type: 'TOTAL' },
    { label: '(-) Custos dos Serviços', valor: -310000, yoy: '+8%', type: 'SUB' },
    { label: 'LUCRO BRUTO', valor: 415000, yoy: '+18%', type: 'TOTAL' },
    { label: '(-) Despesas Operacionais', valor: -180000, yoy: '-2%', type: 'SUB' },
    { label: '(-) Despesas Administrativas', valor: -45000, yoy: '+1%', type: 'SUB' },
    { label: 'EBITDA', valor: 190000, yoy: '+22%', type: 'TOTAL' },
    { label: '(-) Depreciação / Financeiro', valor: -12000, yoy: '0%', type: 'SUB' },
    { label: 'LUCRO LÍQUIDO', valor: 178000, yoy: '+25%', type: 'RESULT' },
];

const PERFORMANCE_BY_FRONT = [
    { name: 'PAIDEIA', receita: 450000, margem: 62 },
    { name: 'OIKOS', receita: 280000, margem: 45 },
    { name: 'BIBLOS', receita: 120000, margem: 50 },
];

const COMPARATIVE_DATA = [
    { month: 'Set', atual: 145000, anterior: 132000 },
    { month: 'Out', atual: 158000, anterior: 141000 },
    { month: 'Nov', atual: 162000, anterior: 155000 },
    { month: 'Dez', atual: 185000, anterior: 160000 },
    { month: 'Jan', atual: 142000, anterior: 135000 },
    { month: 'Fev', atual: 178000, anterior: 142000 },
];

export default function RelatoriosPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('Ultimos 6 Meses');
    const [selectedFront, setSelectedFront] = useState('Todas as Unidades');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Global BI Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">BI e Relatórios Consolidados</h1>
                    <p className="text-body">Visão estratégica multunidade (DRE, Performance e Balanço)</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}><Share2 size={16} /></button>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}><Printer size={16} /></button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Exportar DRE (Excel)
                    </button>
                </div>
            </div>

            {/* 2. BI Filter Bar */}
            <div className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="var(--primary)" />
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            style={filterSelectStyle}
                        >
                            <option>Mês Atual (Fevereiro)</option>
                            <option>Janeiro / 2026</option>
                            <option>Ultimos 6 Meses</option>
                            <option>Ano 2025</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={16} color="var(--secondary)" />
                        <select
                            value={selectedFront}
                            onChange={(e) => setSelectedFront(e.target.value)}
                            style={filterSelectStyle}
                        >
                            <option>Todas as Unidades</option>
                            <option>FRENTE PAIDEIA</option>
                            <option>FRENTE OIKOS</option>
                            <option>FRENTE BIBLOS</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Variação YoY</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--success)' }}>+25.4%</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Variação MoM</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>+12.8%</p>
                    </div>
                </div>
            </div>

            {/* 3. DRE Gerencial & Comparative Chart */}
            <div className="grid" style={{ gridTemplateColumns: 'minmax(450px, 1fr) 1.5fr', gap: '24px' }}>
                {/* DRE Column */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>DRE Gerencial Consolidado</h3>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {DRE_DATA.map((row, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '12px 24px',
                                backgroundColor: row.type === 'TOTAL' || row.type === 'RESULT' ? 'rgba(255,255,255,0.02)' : 'transparent',
                                borderBottom: row.type === 'TOTAL' ? '1px solid #222' : 'none',
                                fontWeight: row.type === 'HEADER' || row.type === 'TOTAL' || row.type === 'RESULT' ? 700 : 400,
                            }}>
                                <span style={{
                                    fontSize: '13px',
                                    color: row.type === 'SUB' ? 'var(--text-secondary)' : 'white',
                                    paddingLeft: row.type === 'SUB' ? '16px' : '0'
                                }}>
                                    {row.label}
                                </span>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '13px',
                                        color: row.type === 'RESULT' ? 'var(--success)' : row.valor < 0 && row.type !== 'SUB' ? 'var(--danger)' : 'white'
                                    }}>
                                        R$ {Math.abs(row.valor).toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '10px', width: '35px', color: row.yoy.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                                        {row.yoy}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ flex: 1 }}>
                        <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px' }}>Evolução Comparativa (Atual vs Anterior)</h3>
                        <div style={{ height: '240px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={COMPARATIVE_DATA}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="month" stroke="#555" fontSize={11} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#555" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="atual" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                    <Line type="monotone" dataKey="anterior" stroke="#444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="card" style={{ background: 'rgba(0, 230, 118, 0.03)', borderColor: 'rgba(0, 230, 118, 0.1)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Margem de Contribuição Média</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>56.4%</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success)' }}>
                                <TrendingUp size={12} /> +2.1% YoY
                            </div>
                        </div>
                        <div className="card" style={{ background: 'rgba(41, 121, 255, 0.03)', borderColor: 'rgba(41, 121, 255, 0.1)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Break Even Projetado</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>Dia 18/Mês</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--primary)' }}>
                                <CheckCircle2 size={12} /> Dentro da meta
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Performance by Unit (Heatmap/Cards) */}
            <div>
                <h3 className="text-h3" style={{ marginBottom: '20px' }}>Performance por Unidade de Negócio</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {PERFORMANCE_BY_FRONT.map((front, i) => (
                        <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: 0, right: 0, padding: '12px',
                                background: `rgba(255,255,255,0.03)`, borderBottomLeftRadius: '12px'
                            }}>
                                <BarChart3 size={16} opacity={0.3} />
                            </div>
                            <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px', color: 'var(--primary)' }}>{front.name}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Receita Total</span>
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>R$ {front.receita.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Margem Operacional</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: front.margem > 50 ? 'var(--success)' : 'var(--warning)' }}>{front.margem}%</span>
                            </div>
                            <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                                <div style={{ width: `${front.margem}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

const filterSelectStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none'
};
