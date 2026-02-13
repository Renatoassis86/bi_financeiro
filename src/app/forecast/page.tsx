'use client';

import { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, Calendar,
    Settings2, AlertTriangle, ShieldCheck, Zap,
    ArrowRight, Info, BarChart3, LineChart,
    RefreshCcw, Filter, Download, SlidersHorizontal,
    ChevronRight, Gauge
} from 'lucide-react';
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- DATA & TYPES ---

const MONTHS_FORWARD = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan/27', 'Fev/27'];

type ForecastParams = {
    revenueVar: number;      // % variation
    collectionDelay: number; // days
    costInflation: number;  // %
    plannedCuts: number;     // %
};

const BASE_REVENUE = 450000;
const BASE_EXPENSE = 380000;
const INITIAL_CASH = 150000;

export default function ForecastPage() {
    const [scenario, setScenario] = useState<'CONSERVADOR' | 'BASE' | 'OTIMISTA'>('BASE');
    const [params, setParams] = useState<ForecastParams>({
        revenueVar: 0,
        collectionDelay: 0,
        costInflation: 0,
        plannedCuts: 0
    });

    // Scenario Presets
    const applyPreset = (scen: 'CONSERVADOR' | 'BASE' | 'OTIMISTA') => {
        setScenario(scen);
        if (scen === 'CONSERVADOR') {
            setParams({ revenueVar: -10, collectionDelay: 15, costInflation: 5, plannedCuts: 10 });
        } else if (scen === 'OTIMISTA') {
            setParams({ revenueVar: 15, collectionDelay: -5, costInflation: 2, plannedCuts: 5 });
        } else {
            setParams({ revenueVar: 0, collectionDelay: 0, costInflation: 0, plannedCuts: 0 });
        }
    };

    // Forecast Engine (Heuristic)
    const forecastData = useMemo(() => {
        let currentCash = INITIAL_CASH;
        return MONTHS_FORWARD.map((m, idx) => {
            // Logic for growth: base + variation + slight monthly trend
            const trend = 1 + (idx * 0.01);
            const rev = BASE_REVENUE * (1 + params.revenueVar / 100) * trend;

            // Expenses: base + inflation - cuts
            const exp = BASE_EXPENSE * (1 + params.costInflation / 100) * (1 - params.plannedCuts / 100);

            const result = rev - exp;

            // Cash delay effect (simulated reduction in cash entry based on delay)
            const cashEntry = rev * (1 - (params.collectionDelay / 60));
            const monthlyCashFlow = cashEntry - exp;
            currentCash += monthlyCashFlow;

            return {
                month: m,
                receita: Math.round(rev),
                despesa: Math.round(exp),
                resultado: Math.round(result),
                caixa: Math.round(currentCash),
            };
        });
    }, [params]);

    const riskLevel = useMemo(() => {
        const hasNegative = forecastData.some(d => d.caixa < 0);
        const lowMargin = forecastData.some(d => d.caixa < 50000);
        if (hasNegative) return { label: 'ALTO', color: 'var(--danger)', prob: '85%' };
        if (lowMargin) return { label: 'MÉDIO', color: 'var(--warning)', prob: '30%' };
        return { label: 'BAIXO', color: 'var(--success)', prob: '< 5%' };
    }, [forecastData]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Scenarios */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Forecast & Rolling Forecast</h1>
                    <p className="text-body">Previsão dinâmica baseada em tendências, contratos e drivers</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', background: '#111', padding: '6px', borderRadius: '12px', border: '1px solid #222' }}>
                    <button onClick={() => applyPreset('CONSERVADOR')} style={{ ...tabStyle, background: scenario === 'CONSERVADOR' ? 'rgba(255,23,68,0.1)' : 'transparent', color: scenario === 'CONSERVADOR' ? 'var(--danger)' : '#666' }}>Conservador</button>
                    <button onClick={() => applyPreset('BASE')} style={{ ...tabStyle, background: scenario === 'BASE' ? 'rgba(0,230,118,0.1)' : 'transparent', color: scenario === 'BASE' ? 'var(--primary)' : '#666' }}>Base</button>
                    <button onClick={() => applyPreset('OTIMISTA')} style={{ ...tabStyle, background: scenario === 'OTIMISTA' ? 'rgba(41,121,255,0.1)' : 'transparent', color: scenario === 'OTIMISTA' ? 'var(--secondary)' : '#666' }}>Otimista</button>
                </div>
            </div>

            {/* 2. Parameters Sliders Panel */}
            <div className="card grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', padding: '32px' }}>
                <SliderField
                    label="Var. Receita (%)"
                    value={params.revenueVar}
                    min={-30} max={30}
                    onChange={(v: number) => setParams({ ...params, revenueVar: v })}
                    icon={<TrendingUp size={16} color="var(--primary)" />}
                />
                <SliderField
                    label="Atraso Recebimento (Dias)"
                    value={params.collectionDelay}
                    min={0} max={60}
                    onChange={(v: number) => setParams({ ...params, collectionDelay: v })}
                    icon={<RefreshCcw size={16} color="var(--warning)" />}
                />
                <SliderField
                    label="Inflação de Custos (%)"
                    value={params.costInflation}
                    min={0} max={20}
                    onChange={(v: number) => setParams({ ...params, costInflation: v })}
                    icon={<TrendingDown size={16} color="var(--danger)" />}
                />
                <SliderField
                    label="Cortes Planejados (%)"
                    value={params.plannedCuts}
                    min={0} max={30}
                    onChange={(v: number) => setParams({ ...params, plannedCuts: v })}
                    icon={<ShieldCheck size={16} color="var(--success)" />}
                />
            </div>

            {/* 3. Key Metrics & Risk */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr) 1.2fr', gap: '20px' }}>
                <MetricCard label="Média Receita Projetada" value={`R$ ${Math.round(forecastData.reduce((a, b) => a + b.receita, 0) / 12).toLocaleString()}`} />
                <MetricCard label="Média Despesa Projetada" value={`R$ ${Math.round(forecastData.reduce((a, b) => a + b.despesa, 0) / 12).toLocaleString()}`} />
                <MetricCard label="Acumulado Resultado (12m)" value={`R$ ${forecastData.reduce((a, b) => a + b.resultado, 0).toLocaleString()}`} color="var(--success)" />

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderLeft: `4px solid ${riskLevel.color}` }}>
                    <div style={{ padding: '12px', background: `${riskLevel.color}10`, borderRadius: '12px', color: riskLevel.color }}>
                        <Gauge size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Risco de Caixa Negativo</p>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{riskLevel.label} ({riskLevel.prob})</h3>
                    </div>
                </div>
            </div>

            {/* 4. Forecast Chart */}
            <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <h3 className="text-h3">Rolling Forecast — 12 Meses</h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, background: 'var(--primary)' }} /> Receita</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, background: 'var(--danger)' }} /> Despesa</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, background: 'white' }} /> Saldo Caixa</span>
                    </div>
                </div>
                <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="month" stroke="#555" fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis stroke="#555" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                            <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                            <Bar dataKey="receita" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="despesa" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={40} />
                            <Line type="monotone" dataKey="caixa" stroke="white" strokeWidth={3} dot={{ fill: 'white', r: 4 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 5. Detailed Table */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 className="text-h3">Grade de Projeção Mensal</h3>
                    <button className="btn btn-ghost" style={{ fontSize: '12px' }}><Download size={14} style={{ marginRight: '8px' }} /> Planilha (.csv)</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px' }}>Mês/Período</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Receita Proj.</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Despesa Proj.</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Resultado</th>
                                <th style={{ padding: '16px', textAlign: 'right', paddingRight: '24px' }}>Saldo Caixa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forecastData.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 600, fontSize: '13px' }}>{row.month}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>R$ {row.receita.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>R$ {row.despesa.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: row.resultado >= 0 ? 'var(--success)' : 'var(--danger)' }}>R$ {row.resultado.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', paddingRight: '24px', fontSize: '13px', fontWeight: 'bold' }}>R$ {row.caixa.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

function SliderField({ label, value, min, max, onChange, icon }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {icon} {label}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{value > 0 ? '+' : ''}{value}{label.includes('Dias') ? '' : '%'}</span>
            </div>
            <input
                type="range"
                min={min} max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', height: '4px', cursor: 'pointer' }}
            />
        </div>
    );
}

function MetricCard({ label, value, color }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{label}</p>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: color }}>{value}</h2>
        </div>
    );
}

const tabStyle = { padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: '0.2s' };
const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
