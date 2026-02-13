'use client';

import { useState, useMemo } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Line, Area, ReferenceLine, TooltipProps, Bar, BarChart
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, Download,
    Calendar, Filter, ChevronRight, ChevronDown,
    Settings2, Info, TrendingUp, TrendingDown, Clock, AlertTriangle, Zap,
    History, Search, CheckCircle2, MoreHorizontal, DollarSign, Wallet
} from 'lucide-react';

// --- MOCK DATA ---

const dailyData = [
    { date: '13/02', real: 850000, projected: 850000, balance: 1150000 },
    { date: '14/02', projected: 820000, balance: 1120000 },
    { date: '15/02', projected: 450000, balance: 750000 }, // Big payment day
    { date: '16/02', projected: 550000, balance: 850000 },
    { date: '17/02', projected: 600000, balance: 900000 },
    { date: '18/02', projected: 580000, balance: 880000 },
    { date: '19/02', projected: 920000, balance: 1220000 }, // Big revenue day
    { date: '20/02', projected: 900000, balance: 1200000 },
];

const detailedEntries = [
    { id: 1, data: '13/02/2026', descricao: 'Mensalidades Paideia - Lote 01', conta: 'Receita Operacional', previsto: 150000, realizado: 148500, status: 'Confirmado', frente: 'PAIDEIA', hash: 'TX-992' },
    { id: 2, data: '15/02/2026', descricao: 'Folha de Pagamento - CLT', conta: 'Salários', previsto: 280000, realizado: 0, status: 'Provisionado', frente: 'CONSOLIDADO', hash: 'TX-993' },
    { id: 3, data: '16/02/2026', descricao: 'Fornecedor de TI - AWS', conta: 'Serviços Terceiros', previsto: 12000, realizado: 0, status: 'Provisionado', frente: 'DIVERSOS', hash: 'TX-994' },
    { id: 4, data: '19/02/2026', descricao: 'Repasse Projetos Sociais', conta: 'Doações', previsto: 45000, realizado: 0, status: 'Provisionado', frente: 'BIBLOS', hash: 'TX-995' },
];

export default function FluxoCaixaDiarioPage() {
    const [viewMode, setViewMode] = useState<'D' | 'W' | 'M'>('D');
    const [scenarios, setScenarios] = useState({
        atrasoRecebiveis: 15,
        corteDespesas: 0,
        adiarPagamentos: false
    });

    const chartData = useMemo(() => {
        return dailyData.map(d => ({
            ...d,
            conservador: d.balance * (1 - (scenarios.atrasoRecebiveis / 100))
        }));
    }, [scenarios]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Integrated Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Fluxo de Caixa Diário</h1>
                    <p className="text-body">Monitoramento de liquidez imediata e projeção Real v Projected</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', display: 'flex' }}>
                        {(['D', 'W', 'M'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                                    background: viewMode === mode ? 'var(--primary)' : 'transparent',
                                    color: viewMode === mode ? 'black' : 'var(--text-disabled)',
                                    transition: '0.2s'
                                }}
                            >
                                {mode === 'D' ? 'Diário' : mode === 'W' ? 'Semanal' : 'Mensal'}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Exportar Extrato
                    </button>
                </div>
            </div>

            {/* 2. Real-Time Liquidity Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <LiquidityStat label="Saldo em Conta" value="R$ 1.150.000" sub="Conciliado hoje" icon={<Wallet size={16} />} color="var(--primary)" />
                <LiquidityStat label="Receitas (Próx. 7d)" value="R$ 450.000" sub="12 lançamentos" icon={<TrendingUp size={16} />} color="var(--success)" />
                <LiquidityStat label="Contas a Pagar (Próx. 7d)" value="R$ 380.000" sub="8 lançamentos" icon={<TrendingDown size={16} />} color="var(--danger)" />
                <LiquidityStat label="Disponibilidade Q+1" value="R$ 1.220.000" sub="Projeção líquida" icon={<Zap size={16} />} color="var(--secondary)" />
            </div>

            {/* 3. Main Daily Chart */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Curva de Disponibilidade (Real v Projected)</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Considerando saldo inicial + entradas/saídas confirmadas</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '2px' }} /> Saldo Projetado</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '2px', border: '1px dashed white' }} /> Stress Test (-{scenarios.atrasoRecebiveis}%)</div>
                    </div>
                </div>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                            <XAxis dataKey="date" stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#090909', border: '1px solid #222', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="balance" fill="rgba(0, 230, 118, 0.05)" stroke="none" />
                            <Line type="monotone" dataKey="balance" name="Projeção" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                            <Line type="monotone" dataKey="conservador" name="Stress Test" stroke="var(--danger)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <ReferenceLine y={500000} stroke="rgba(255,23,68,0.2)" strokeDasharray="3 3" label={{ value: 'Limite Segurança', position: 'right', fill: 'var(--danger)', fontSize: 10 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Scenario Controls & Drill-down */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

                {/* Simulation Panel */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Settings2 size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Simulador de Stress</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-disabled)', fontWeight: 'bold' }}>QUEBRA DE RECEITA (%)</label>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>{scenarios.atrasoRecebiveis}%</span>
                            </div>
                            <input
                                type="range" min="0" max="40" step="5"
                                value={scenarios.atrasoRecebiveis}
                                onChange={(e) => setScenarios({ ...scenarios, atrasoRecebiveis: parseInt(e.target.value) })}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(255,171,0,0.02)', border: '1px dashed var(--warning)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 700, marginBottom: '4px' }}>ALERTA DE LIQUIDEZ</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Com {scenarios.atrasoRecebiveis}% de quebra, o saldo atinge o limite de segurança em 3 dias.</p>
                        </div>
                    </div>
                </div>

                {/* Daily Extrait */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Lançamentos Futuros (Conciliação Diária)</h3>
                        <div style={{ position: 'relative' }}>
                            <input placeholder="Filtrar por descrição..." style={{ background: '#0D0D0D', border: '1px solid #222', padding: '6px 12px 6px 30px', borderRadius: '6px', fontSize: '12px', color: 'white', outline: 'none' }} />
                            <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', textTransform: 'uppercase', fontSize: '10px' }}>
                                <th style={{ padding: '16px 24px' }}>Data / ID</th>
                                <th style={{ padding: '16px' }}>Descrição</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Previsto</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedEntries.map(entry => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01]">
                                    <td style={{ padding: '14px 24px' }}>
                                        <p style={{ fontWeight: 600 }}>{entry.data}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{entry.hash}</p>
                                    </td>
                                    <td style={{ padding: '14px' }}>
                                        <p style={{ fontWeight: 600 }}>{entry.descricao}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Frente: {entry.frente}</p>
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold' }}>
                                        R$ {entry.previsto.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: entry.status === 'Confirmado' ? 'rgba(0,230,118,0.1)' : 'rgba(255,171,0,0.1)', color: entry.status === 'Confirmado' ? 'var(--success)' : 'var(--warning)' }}>{entry.status}</span>
                                    </td>
                                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                                        <ChevronRight size={16} color="#333" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}

function LiquidityStat({ label, value, sub, icon, color }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</p>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>{value}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginTop: '2px' }}>{sub}</p>
        </div>
    );
}
