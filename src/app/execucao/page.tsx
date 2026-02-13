'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExecucaoPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Acompanhamento e Execução</h1>
                    <p className="text-body">Realizado vs Orçado (YTD)</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost">Exportar</button>
                    <button className="btn btn-primary">Novo Lançamento</button>
                </div>
            </div>

            {/* Gauges Row */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="card">
                    <h3 className="text-h3">Consumo Orçamentário Global</h3>
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>78.5%</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Meta: 80%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '78.5%', height: '100%', background: 'linear-gradient(90deg, var(--success), var(--warning))' }}></div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-h3">Frente Paideia</h3>
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>82.1%</span>
                            <span style={{ color: 'var(--danger)', fontSize: '12px' }}>+2.1% acima</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '82.1%', height: '100%', background: 'var(--danger)' }}></div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-h3">Frente Oikos</h3>
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>65.0%</span>
                            <span style={{ color: 'var(--success)', fontSize: '12px' }}>Dentro da meta</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', background: 'var(--success)' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Drilldown */}
            <div className="card">
                <h3 className="text-h3" style={{ marginBottom: '20px' }}>Detalhamento por Conta</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '12px' }}>Conta Contábil</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Orçado</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Realizado</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Desvio %</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: "Pessoal", orc: 250000, real: 248000, dev: -0.8, status: 'ok' },
                            { name: "Marketing", orc: 25000, real: 28000, dev: +12.0, status: 'warn' },
                            { name: "Infraestrutura", orc: 15000, real: 14500, dev: -3.3, status: 'ok' },
                            { name: "Tecnologia", orc: 10000, real: 18000, dev: +80.0, status: 'danger' },
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '12px' }}>{row.name}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>R$ {row.orc.toLocaleString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>R$ {row.real.toLocaleString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: row.dev > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                    {row.dev > 0 ? '+' : ''}{row.dev}%
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {row.status === 'ok' && <CheckCircle2 size={16} color="var(--success)" />}
                                    {row.status === 'warn' && <AlertCircle size={16} color="var(--warning)" />}
                                    {row.status === 'danger' && <AlertCircle size={16} color="var(--danger)" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
