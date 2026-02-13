'use client';

import { useState, useMemo } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Line, Area, ReferenceLine, TooltipProps
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, Download,
    Calendar, Filter, ChevronRight, ChevronDown,
    Settings2, Info, TrendingUp, TrendingDown, Clock, AlertTriangle, Zap
} from 'lucide-react';

const detailedEntries = [
    { id: 1, data: '12/03/2026', descricao: 'Mensalidades Paideia - Lote 01', conta: 'Receita Operacional', previsto: 150000, realizado: 148500, status: 'Confirmado', frente: 'PAIDEIA' },
    { id: 2, data: '13/03/2026', descricao: 'Fornecedor de TI - AWS', conta: 'Serviços Terceiros', previsto: 12000, realizado: 12150, status: 'Confirmado', frente: 'DIVERSOS' },
    { id: 3, data: '15/03/2026', descricao: 'Folha de Pagamento - Professores', conta: 'Salários', previsto: 280000, realizado: 0, status: 'Atrasado', frente: 'PAIDEIA', diasAtraso: 5 },
    { id: 4, data: '18/03/2026', descricao: 'Doações Projetos Sociais', conta: 'Doações', previsto: 45000, realizado: 0, status: 'Provisionado', frente: 'BIBLOS' },
    { id: 5, data: '20/03/2026', descricao: 'Manutenção Predial Oikos', conta: 'Infraestrutura', previsto: 8000, realizado: 0, status: 'Provisionado', frente: 'OIKOS' },
];

export default function FluxoCaixaPage() {
    const [viewMode, setViewMode] = useState<'D' | 'W' | 'M'>('M');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [scenarios, setScenarios] = useState({
        atrasoRecebiveis: 20, // % de desconto no conservador
        corteDespesas: 0, // % de redução simulada
        adiarPagamentos: false
    });

    const toggleRow = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    // Engine de Projeção (Simplificada)
    const chartData = useMemo(() => {
        const base = [
            { name: 'Jan', realizado: 420000, previsto: 450000 },
            { name: 'Fev', realizado: 510000, previsto: 480000 },
            { name: 'Mar', realizado: 490000, previsto: 500000 },
            { name: 'Abr', previsto: 520000 },
            { name: 'Mai', previsto: 540000 },
            { name: 'Jun', previsto: 560000 },
        ];

        let saldoAcumulado = 1150000; // Saldo inicial Março
        let saldoConservador = 1150000;
        let saldoSimulado = 1150000;

        return base.map((point, i) => {
            const hasRealized = point.realizado !== undefined;
            const influx = point.previsto || 0;
            const outflow = (point.previsto || 0) * 0.8; // Simplificado: 80% é despesa

            // Projeção Padrão
            if (i >= 2) { // A partir de Março (index 2)
                saldoAcumulado += (influx - outflow);

                // Projeção Conservadora (Regra: Atraso em recebíveis)
                const influxConservador = influx * (1 - scenarios.atrasoRecebiveis / 100);
                saldoConservador += (influxConservador - outflow);

                // Projeção Simulada
                const outflowSimulado = outflow * (1 - scenarios.corteDespesas / 100);
                saldoSimulado += (influx - (scenarios.adiarPagamentos ? outflowSimulado * 0.5 : outflowSimulado));
            }

            return {
                ...point,
                saldo: hasRealized ? point.realizado : (i === 2 ? 1150000 : saldoAcumulado),
                conservador: i >= 2 ? saldoConservador : undefined,
                simulado: i >= 2 ? saldoSimulado : undefined
            };
        });
    }, [scenarios]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header com Toggle de Visualização */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Fluxo de Caixa & Projeções</h1>
                    <p className="text-body">Análise temporal de liquidez com motores de simulação ativa</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', display: 'flex' }}>
                        {(['D', 'W', 'M'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: viewMode === mode ? 'var(--primary)' : 'transparent',
                                    color: viewMode === mode ? 'black' : 'var(--text-secondary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {mode === 'D' ? 'Diário' : mode === 'W' ? 'Semanal' : 'Mensal'}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Exportar
                    </button>
                </div>
            </div>

            {/* Simulator Panel */}
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', borderLeft: '4px solid var(--primary)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Settings2 size={18} color="var(--primary)" />
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Cenário Conservador</h3>
                    </div>
                    <label style={{ fontSize: '12px', color: 'var(--text-disabled)', display: 'block', marginBottom: '8px' }}>
                        Atraso em Recebíveis: <strong>{scenarios.atrasoRecebiveis}%</strong>
                    </label>
                    <input
                        type="range"
                        min="0" max="50" step="5"
                        value={scenarios.atrasoRecebiveis}
                        onChange={(e) => setScenarios({ ...scenarios, atrasoRecebiveis: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)', marginTop: '8px' }}>
                        Simula o impacto de atrasos de faturas acima de 5 dias.
                    </p>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Zap size={18} color="var(--warning)" />
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Simulação "E Se"</h3>
                    </div>
                    <label style={{ fontSize: '12px', color: 'var(--text-disabled)', display: 'block', marginBottom: '8px' }}>
                        Corte de Despesas: <strong>{scenarios.corteDespesas}%</strong>
                    </label>
                    <input
                        type="range"
                        min="0" max="30" step="5"
                        value={scenarios.corteDespesas}
                        onChange={(e) => setScenarios({ ...scenarios, corteDespesas: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--warning)' }}
                    />
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={scenarios.adiarPagamentos}
                            onChange={(e) => setScenarios({ ...scenarios, adiarPagamentos: e.target.checked })}
                        />
                        <span style={{ fontSize: '12px', color: 'white' }}>Adiar pagamentos (30 dias)</span>
                    </div>
                </div>

                <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Info size={16} color="var(--primary)" />
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Diagnóstico de Projeção</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Com o cenário atual, o fluxo de caixa permanece positivo nos próximos 90 dias.
                        No <strong style={{ color: 'var(--danger)' }}>Cenário Conservador</strong>, o saldo atinge um ponto de atenção em Junho.
                    </p>
                </div>
            </div>

            {/* Advanced Charts Section */}
            <div className="card" style={{ height: '450px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 className="text-h3">Disponibilidade de Caixa: Próximos 120 dias</h3>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 12, height: 2, background: 'var(--primary)' }} /> Realizado/Previsto</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 12, height: 2, background: 'var(--danger)', borderStyle: 'dashed' }} /> Conservador</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 12, height: 2, background: 'var(--warning)' }} /> Simulado</div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${(v / 1000000).toFixed(1)}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={1150000} stroke="#444" strokeDasharray="5 5" label={{ value: 'Saldo Atual', position: 'right', fill: '#666', fontSize: 10 }} />

                        <Area type="monotone" dataKey="saldo" fill="rgba(0, 230, 118, 0.05)" stroke="none" />
                        <Line type="monotone" dataKey="saldo" name="Fluxo Padrão" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="conservador" name="Conservador" stroke="var(--danger)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="simulado" name="Simulado" stroke="var(--warning)" strokeWidth={2} dot={{ r: 4 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Projections Grid */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-h3">Projeções de Movimentação (Próximos Lançamentos)</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="badge badge-paideia">Recebíveis</div>
                        <div className="badge badge-oikos">Provisionamentos</div>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px 24px' }}>Status</th>
                            <th style={{ padding: '16px' }}>Data Estimada</th>
                            <th style={{ padding: '16px' }}>Descrição / Recorrência</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor Bruto</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Impacto Cons.</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailedEntries.map((row) => (
                            <tr key={row.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    {row.status === 'Atrasado' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)' }}>
                                            <AlertTriangle size={14} />
                                            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>ATRASO {row.diasAtraso}D</span>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                            <Clock size={14} />
                                            <span style={{ fontSize: '11px' }}>FUTURO</span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '16px' }}>{row.data}</td>
                                <td style={{ padding: '16px' }}>
                                    <p style={{ fontWeight: 600 }}>{row.descricao}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Mensal / Plano de Contas: {row.conta}</p>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 500 }}>R$ {row.previsto.toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right', color: 'var(--danger)' }}>
                                    {row.status === 'Atrasado' ? `-R$ ${(row.previsto * 0.5).toLocaleString()}` : '—'}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 8px' }}>Simular Adiantamento</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="card" style={{ background: '#111', border: '1px solid #333', padding: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>{label}</p>
                {payload.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span style={{ fontWeight: 'bold' }}>R$ {entry.value?.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
