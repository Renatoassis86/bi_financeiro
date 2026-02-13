'use client';

import { useState, useMemo } from 'react';
import {
    TrendingUp, Users, School, Church, Target,
    ChevronRight, ArrowRight, Save, Lock,
    Layers, BarChart3, PieChart, Info, AlertCircle,
    TrendingDown, Zap, Shield, ArrowUpRight
} from 'lucide-react';

type Scenario = 'CONSERVADOR' | 'BASE' | 'AGRESSIVO';

type StrategicGoal = {
    year: number;
    front: string;
    revenue: number;
    growth: number;
    margin: number;
    budget: number;
    drivers: {
        partners: number;
        subscribers: number;
        ticket: number;
        churn: number;
    };
};

const INITIAL_GOALS: StrategicGoal[] = [
    {
        year: 2026, front: 'PAIDEIA', revenue: 5400000, growth: 15, margin: 60, budget: 2160000,
        drivers: { partners: 45, subscribers: 1200, ticket: 450, churn: 5 }
    },
    {
        year: 2027, front: 'PAIDEIA', revenue: 6480000, growth: 20, margin: 62, budget: 2462400,
        drivers: { partners: 55, subscribers: 1500, ticket: 480, churn: 4 }
    },
    {
        year: 2028, front: 'PAIDEIA', revenue: 8100000, growth: 25, margin: 65, budget: 2835000,
        drivers: { partners: 70, subscribers: 2000, ticket: 520, churn: 3 }
    },
    {
        year: 2029, front: 'PAIDEIA', revenue: 10530000, growth: 30, margin: 68, budget: 3369600,
        drivers: { partners: 90, subscribers: 2800, ticket: 550, churn: 3 }
    },
];

export default function PlanejamentoEstrategicoPage() {
    const [goals, setGoals] = useState<StrategicGoal[]>(INITIAL_GOALS);
    const [scenario, setScenario] = useState<Scenario>('BASE');
    const [selectedYear, setSelectedYear] = useState(2026);

    // Simple Scenario Modifier Engine
    const scenarioMultiplier = useMemo(() => {
        if (scenario === 'CONSERVADOR') return 0.85;
        if (scenario === 'AGRESSIVO') return 1.25;
        return 1;
    }, [scenario]);

    const filteredGoals = useMemo(() => {
        return goals.map(g => ({
            ...g,
            revenue: g.revenue * scenarioMultiplier,
            budget: g.budget * (scenario === 'AGRESSIVO' ? 1.15 : scenario === 'CONSERVADOR' ? 0.9 : 1)
        }));
    }, [goals, scenarioMultiplier, scenario]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Scenario Control */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="text-h1">Planejamento Estratégico 2026–2029</h1>
                    <p className="text-body">Definição de metas de longo prazo e drivers de crescimento</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', border: '1px solid #222' }}>
                    <ScenarioTab active={scenario === 'CONSERVADOR'} onClick={() => setScenario('CONSERVADOR')} label="Conservador" icon={<Shield size={14} />} color="var(--secondary)" />
                    <ScenarioTab active={scenario === 'BASE'} onClick={() => setScenario('BASE')} label="Base" icon={<Layers size={14} />} color="var(--primary)" />
                    <ScenarioTab active={scenario === 'AGRESSIVO'} onClick={() => setScenario('AGRESSIVO')} label="Agressivo" icon={<Zap size={14} />} color="var(--warning)" />
                </div>
            </div>

            {/* 2. Top Level KPI Comparison (Multi-year) */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {filteredGoals.filter(g => g.front === 'PAIDEIA').map(g => (
                    <div key={g.year} className="card" style={{ borderTop: g.year === selectedYear ? '3px solid var(--primary)' : '1px solid #222' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: g.year === selectedYear ? 'white' : 'var(--text-disabled)' }}>{g.year}</span>
                            {g.year === selectedYear && <Target size={16} color="var(--primary)" />}
                        </div>
                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Receita Alvo</p>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>R$ {(g.revenue / 1000000).toFixed(1)}M</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px' }}>
                            <span style={{ color: 'var(--success)' }}>+{g.growth}% Cresc.</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{g.margin}% Margem</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Detailed Driver Config for Selected Year */}
            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
                {/* Driver Inputs */}
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} color="var(--primary)" />
                        Drivers Estratégicos ({selectedYear})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <DriverField label="Escolas Parceiras" value={INITIAL_GOALS.find(g => g.year === selectedYear)?.drivers.partners || 0} unit="escolas" icon={<School size={16} />} />
                        <DriverField label="Famílias Assinantes" value={INITIAL_GOALS.find(g => g.year === selectedYear)?.drivers.subscribers || 0} unit="famílias" icon={<Users size={16} />} />
                        <DriverField label="Ticket Médio Mensal" value={INITIAL_GOALS.find(g => g.year === selectedYear)?.drivers.ticket || 0} unit="R$" icon={<ArrowUpRight size={16} />} />
                        <DriverField label="Churn Projetado" value={INITIAL_GOALS.find(g => g.year === selectedYear)?.drivers.churn || 0} unit="%" icon={<TrendingDown size={16} />} />
                    </div>

                    <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'rgba(255,171,0,0.03)', border: '1px dashed #333' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Info size={16} color="var(--warning)" />
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                Ajustes nestes drivers recalculam automaticamente a Receita Alvo do nível estratégico.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Multi-front Comparison Table */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #222' }}>
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Metas por UN (Unidade de Negócio) - {selectedYear}</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Frente</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Receita Anual</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Orçamento Op.</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Resultado</th>
                                <th style={{ padding: '16px', textAlign: 'right', paddingRight: '24px' }}>Margem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['PAIDEIA', 'OIKOS', 'BIBLOS'].map(front => {
                                const data = filteredGoals.find(g => g.year === selectedYear && g.front === 'PAIDEIA')!; // Mock using Paideia data scaled
                                const scale = front === 'PAIDEIA' ? 1 : front === 'OIKOS' ? 0.6 : 0.4;
                                return (
                                    <tr key={front} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: 600, fontSize: '13px' }}>
                                            <span className={`badge badge-${front.toLowerCase()}`}>{front}</span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>R$ {(data.revenue * scale).toLocaleString()}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'var(--text-disabled)' }}>R$ {(data.budget * scale).toLocaleString()}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'var(--success)', fontWeight: 'bold' }}>
                                            R$ {((data.revenue - data.budget) * scale).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', paddingRight: '24px', fontSize: '13px', fontWeight: 600 }}>{data.margin}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{ padding: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333' }}>
                            <ArrowRight size={16} style={{ marginRight: '8px' }} /> Ver Reconciliação Tática
                        </button>
                        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Salvar Cenário Estratégico
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ScenarioTab({ active, onClick, label, icon, color }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px',
                background: active ? color : 'transparent',
                color: active ? 'black' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, transition: '0.2s'
            }}
        >
            {icon} {label}
        </button>
    );
}

function DriverField({ label, value, unit, icon }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#111', padding: '8px', borderRadius: '8px', color: 'var(--text-disabled)' }}>{icon}</div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type="number"
                    defaultValue={value}
                    style={{ width: '80px', background: '#0D0D0D', border: '1px solid #333', borderRadius: '6px', padding: '6px 10px', textAlign: 'right', color: 'white', fontSize: '13px' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-disabled)', width: '50px' }}>{unit}</span>
            </div>
        </div>
    );
}
