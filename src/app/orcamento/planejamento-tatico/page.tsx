'use client';

import { useState, useMemo } from 'react';
import {
    ArrowRightLeft, CheckCircle2, AlertCircle, Save, Lock,
    Plus, Search, Filter, Calendar, BarChart3, TrendingUp,
    Download, FileSpreadsheet, Info, ChevronRight, Calculator,
    Zap, Table, ShieldCheck
} from 'lucide-react';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const TACTICAL_BUDGET = [
    { conta: 'Marketing Digital', cc: 'Vendas', frente: 'PAIDEIA', total: 480000, dist: 'Sazon' },
    { conta: 'Salários Docentes', cc: 'Acadêmico', frente: 'PAIDEIA', total: 1200000, dist: 'Linear' },
    { conta: 'Produção Conteúdo', cc: 'Acadêmico', frente: 'OIKOS', total: 350000, dist: 'Sazon' },
    { conta: 'Infra Cloud (AWS)', cc: 'TI', frente: 'BIBLOS', total: 180000, dist: 'Linear' },
];

export default function PlanejamentoTaticoPage() {
    const [selectedYear, setSelectedYear] = useState(2026);
    const [activeView, setActiveView] = useState<'BUDGET' | 'RECONCILIATION'>('BUDGET');
    const [isLocked, setIsLocked] = useState(false);

    const estratégicoMeta = 2160000; // PAIDEIA Budget Goal for 2026
    const táticoTotal = 2210000; // Sum of tactical lines for PAIDEIA

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Planejamento Tático {selectedYear}</h1>
                    <p className="text-body">Detalhamento mensal e distribuição por drivers/sazonalidade</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setActiveView(activeView === 'BUDGET' ? 'RECONCILIATION' : 'BUDGET')}
                        className="btn btn-ghost"
                        style={{ border: '1px solid #333', color: activeView === 'RECONCILIATION' ? 'var(--primary)' : 'white' }}
                    >
                        <ShieldCheck size={18} style={{ marginRight: '8px' }} />
                        {activeView === 'RECONCILIATION' ? 'Voltar para Orçamento' : 'Reconciliação Estratégica'}
                    </button>
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`btn ${isLocked ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: isLocked ? '1px solid var(--success)' : 'none' }}
                    >
                        {isLocked ? <Lock size={18} color="var(--success)" /> : <Save size={18} />}
                        {isLocked ? 'Versão Travada' : 'Salvar e Travar Versão'}
                    </button>
                </div>
            </div>

            {/* 2. Reconciliation Bar (Always visible if active or critical) */}
            <div className="card" style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid ' + (táticoTotal > estratégicoMeta ? 'var(--danger)' : 'var(--success)') }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Teto Estratégico (Paideia)</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>R$ {estratégicoMeta.toLocaleString()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Total Tático Planejado</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>R$ {táticoTotal.toLocaleString()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Diferença</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold', color: táticoTotal > estratégicoMeta ? 'var(--danger)' : 'var(--success)' }}>
                                R$ {(táticoTotal - estratégicoMeta).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {táticoTotal > estratégicoMeta && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '11px', fontWeight: 'bold' }}>
                            <AlertCircle size={16} /> ALERTA: ORÇAMENTO TÁTICO PRECISA DE CORTE
                        </div>
                    )}
                </div>
            </div>

            {activeView === 'BUDGET' ? (
                <>
                    {/* 3. Tactical Budget Table */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input placeholder="Filtrar por conta ou C.Custo..." style={inputStyle} />
                                <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                            <select style={inputStyle}><option>Todas as Frentes</option></select>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '16px 24px', position: 'sticky', left: 0, background: '#0A0A0A', zIndex: 10 }}>Conta Contábil / Frente</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Total Anual</th>
                                        <th style={{ padding: '16px' }}>Regra</th>
                                        {MONTHS.map(m => <th key={m} style={{ padding: '16px', textAlign: 'right' }}>{m}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TACTICAL_BUDGET.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                            <td style={{ padding: '16px 24px', position: 'sticky', left: 0, background: '#0A0A0A', zIndex: 10 }}>
                                                <p style={{ fontSize: '13px', fontWeight: 600 }}>{row.conta}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{row.cc} • {row.frente}</p>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' }}>
                                                R$ {row.total.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--primary)' }}>
                                                    <Calculator size={12} /> {row.dist}
                                                </div>
                                            </td>
                                            {MONTHS.map(m => (
                                                <td key={m} style={{ padding: '16px', textAlign: 'right' }}>
                                                    <input
                                                        defaultValue={(row.total / 12).toFixed(0)}
                                                        style={{ width: '80px', background: 'transparent', border: 'none', textAlign: 'right', color: 'white', fontSize: '12px', padding: '4px' }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                /* 4. Reconciliation Module */
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="card">
                        <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px' }}>Reconciliação por Frente</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <ReconRow label="PAIDEIA" strategic={2160000} tactical={2210000} />
                            <ReconRow label="OIKOS" strategic={1296000} tactical={1150000} />
                            <ReconRow label="BIBLOS" strategic={864000} tactical={860000} />
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--danger)' }}>98.2%</p>
                        </div>
                        <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Aderência ao Estratégico</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                            O planejamento tático está <span style={{ color: 'var(--danger)' }}>acima do teto estratégico em R$ 50.000</span>. Cortes são necessários para travar a versão.
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}

function ReconRow({ label, strategic, tactical }: any) {
    const diff = tactical - strategic;
    const isOver = diff > 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>{label}</span>
                <span style={{ fontSize: '11px', color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                    {isOver ? 'ALÉM DO TETO' : 'DENTRO DA META'}
                </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', height: '8px', background: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary)', position: 'relative' }}>
                    <div style={{ width: (tactical / strategic * 100) + '%', height: '100%', background: isOver ? 'var(--danger)' : 'var(--success)', opacity: 0.8 }} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                <span>Estratégico: R$ {strategic / 1000}k</span>
                <span>Tático: R$ {tactical / 1000}k</span>
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };
