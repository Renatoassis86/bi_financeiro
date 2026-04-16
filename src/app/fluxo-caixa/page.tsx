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
    History, Search, CheckCircle2, MoreHorizontal, DollarSign, Wallet, Sparkles,
    Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';

// --- MOCK DATA ---

const dailyData = [
    { date: '13/02', real: 850000, projected: 850000, balance: 1150000 },
    { date: '14/02', projected: 820000, balance: 1120000 },
    { date: '15/02', projected: 450000, balance: 750000 },
    { date: '16/02', projected: 550000, balance: 850000 },
    { date: '17/02', projected: 600000, balance: 900000 },
    { date: '18/02', projected: 580000, balance: 880000 },
    { date: '19/02', projected: 920000, balance: 1220000 },
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

    const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            alert('Documento lido com sucesso! Processando integração com o banco...');
            // Lógica de integração futura
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal">

            {/* 1. Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-active)'
            }}>
                <div>
                    <h1 className="text-h1" style={{ fontSize: '3rem' }}>
                        Fluxo de <span style={{ color: 'var(--text-primary)' }}>Caixa</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Projeção diária de liquidez e simulação de cenários críticos
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <button
                        onClick={() => document.getElementById('xlsx-import-fc')?.click()}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer"
                    >
                        <Upload size={20} className="text-[#F43F5E]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#F43F5E]">IMPORTAR PLANILHA</span>
                        <input
                            id="xlsx-import-fc"
                            type="file"
                            style={{ display: 'none' }}
                            accept=".xlsx, .xls"
                            onChange={handleImportXLSX}
                        />
                    </button>

                    <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '2px', padding: '2px' }}>
                        {(['D', 'W', 'M'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '8px 16px', borderRadius: '2px', fontSize: '10px', fontWeight: 900,
                                    background: viewMode === mode ? 'var(--primary)' : 'transparent',
                                    color: viewMode === mode ? 'black' : 'var(--text-disabled)',
                                    border: 'none', cursor: 'pointer', transition: '0.2s'
                                }}
                            >
                                {mode === 'D' ? 'DIÁRIO' : mode === 'W' ? 'SEMANAL' : 'MENSAL'}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-primary">
                        <Download size={16} /> EXPORTAR EXTRATO
                    </button>
                </div>
            </div>

            {/* 2. Liquidity Stats Grid */}
            <div className="grid-stats">
                <LiquidityStat label="SALDO CONCILIADO" value="R$ 1.150.000" sub="Disponibilidade Real" icon={<Wallet size={18} />} color="var(--primary)" />
                <LiquidityStat label="RECEITAS PREVISTAS" value="R$ 450.000" sub="Sete dias úteis" icon={<TrendingUp size={18} />} color="var(--secondary)" />
                <LiquidityStat label="CONTAS A PAGAR" value="R$ 380.000" sub="Sete dias úteis" icon={<TrendingDown size={18} />} color="var(--accent)" />
                <LiquidityStat label="LIQUIDEZ PROJETADA" value="R$ 1.220.000" sub="Saldo em Q+1" icon={<Zap size={18} />} color="var(--primary)" />
            </div>

            {/* 3. Main Chart Card */}
            <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h3 className="text-h2" style={{ fontSize: '1.4rem' }}>Curva de Disponibilidade <span style={{ color: 'var(--secondary)' }}>Real vs Projected</span></h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Análise micro-temporal de saldo e stress test</p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '2px' }} />
                            <span style={{ fontSize: '10px', fontWeight: 900 }}>PROJEÇÃO BASE</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '1px', backgroundColor: 'var(--accent)', border: '1px dashed var(--accent)' }} />
                            <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent)' }}>STRESS TEST (-{scenarios.atrasoRecebiveis}%)</span>
                        </div>
                    </div>
                </div>

                <div style={{ height: '380px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                            <XAxis dataKey="date" stroke="#333" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#555', fontWeight: 700 }} />
                            <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fill: '#555', fontWeight: 700 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '4px', fontSize: '12px' }}
                                cursor={{ stroke: 'var(--border-active)', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="balance" fill="rgba(229, 225, 216, 0.05)" stroke="none" />
                            <Line type="stepAfter" dataKey="balance" name="Projeção" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', stroke: 'black' }} />
                            <Line type="monotone" dataKey="conservador" name="Stress Test" stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <ReferenceLine y={500000} stroke="rgba(255,102,0,0.3)" strokeDasharray="3 3" label={{ value: 'LIMITE DE SEGURANÇA', position: 'right', fill: 'var(--accent)', fontSize: 9, fontWeight: 900 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Scenario & Drilldown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>

                {/* Simulator */}
                <div className="card" style={{ padding: '32px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <Settings2 size={18} color="var(--secondary)" />
                        <h3 className="text-h3" style={{ color: 'var(--text-primary)' }}>Simulador de Stress</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 900, textTransform: 'uppercase' }}>Quebra de Receita Mensal</label>
                                <span style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>{scenarios.atrasoRecebiveis}%</span>
                            </div>
                            <input
                                type="range" min="0" max="50" step="5"
                                value={scenarios.atrasoRecebiveis}
                                onChange={(e) => setScenarios({ ...scenarios, atrasoRecebiveis: parseInt(e.target.value) })}
                                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ fontSize: '9px', color: '#333' }}>OTIMISTA</span>
                                <span style={{ fontSize: '9px', color: '#333' }}>CRÍTICO</span>
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: 'rgba(255,102,0,0.02)', border: '1px dashed var(--accent)', borderRadius: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <AlertTriangle size={14} color="var(--accent)" />
                                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>RISCO DE LIQUIDEZ</p>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                Sob este cenário, o grupo precisará de aporte em <strong>3.5 meses</strong> para manter as operações básicas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Extrato */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="text-h3" style={{ color: 'var(--text-primary)' }}>Lançamentos Futuros</h3>
                        <div style={{ position: 'relative' }}>
                            <input placeholder="Procurar transação..." style={inputStyle} />
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', borderBottom: '1px solid var(--border-active)' }}>
                                <th style={{ padding: '16px 32px' }}>Data / ID</th>
                                <th style={{ padding: '16px' }}>Descrição da Operação</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor Previsto</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px 32px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedEntries.map(entry => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="hover:bg-white/[0.01]">
                                    <td style={{ padding: '16px 32px' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 700 }}>{entry.data}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{entry.hash}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 600 }}>{entry.descricao}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{entry.frente}</p>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 700 }}>
                                        R$ {entry.previsto.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '9px', padding: '4px 8px', borderRadius: '2px', fontWeight: 800,
                                            background: entry.status === 'Confirmado' ? 'rgba(0,255,136,0.05)' : 'rgba(255,102,0,0.05)',
                                            color: entry.status === 'Confirmado' ? '#00ff88' : 'var(--accent)'
                                        }}>{entry.status.toUpperCase()}</span>
                                    </td>
                                    <td style={{ padding: '16px 32px', textAlign: 'right' }}>
                                        <ChevronRight size={18} color="#222" />
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
        <div className="card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
            </div>
            <p style={{ fontSize: '9px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</p>
            <h2 style={{ fontSize: '24px', fontWeight: 400, fontFamily: 'var(--font-serif)', color: 'white' }}>{value}</h2>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '6px', fontWeight: 600 }}>{sub}</p>
        </div>
    );
}

const inputStyle = {
    background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
    padding: '10px 12px 10px 36px', borderRadius: '2px', fontSize: '11px',
    color: 'white', outline: 'none', width: '220px'
};
