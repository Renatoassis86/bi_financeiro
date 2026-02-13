'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowDownRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, ShoppingCart,
    PieChart as PieIcon, BarChart3, FileText, CreditCard,
    Zap, Repeat, X, UploadCloud, Briefcase, ShieldAlert,
    Target, Info, ArrowUpRight
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const EXPENSE_NATURE = [
    { name: 'Fixas', value: 210000, color: 'var(--secondary)' },
    { name: 'Variáveis', value: 145000, color: 'var(--danger)' },
    { name: 'Empenhadas', value: 85000, color: 'var(--primary)' },
];

const TOP_SUPPLIERS = [
    { name: 'Microsoft BR', total: 45000, perc: 30 },
    { name: 'Clima Tech', total: 12000, perc: 8 },
    { name: 'Kalunga', total: 8500, perc: 5 },
    { name: 'Meta Ads', total: 25000, perc: 16 },
];

const BUDGET_LIMITS = [
    { cc: 'Marketing', consumido: 92, total: 50000, alert: false },
    { cc: 'Acadêmico', consumido: 105, total: 80000, alert: true },
    { cc: 'Infraestrutura', consumido: 45, total: 20000, alert: false },
];

const RECENT_EXPENSES = [
    {
        id: 1,
        descricao: 'Licenças Microsoft 365',
        fornecedor: 'Microsoft BR',
        competencia: 'Jan/26',
        caixa: '20/02/2026',
        frente: 'DIVERSOS',
        cc: 'TI Central',
        valor: 4500.00,
        status: 'BLOQUEADO', // Empenhado
        limiteExcedido: false
    },
    {
        id: 2,
        descricao: 'Manutenção Preventiva AC',
        fornecedor: 'Clima Tech',
        competencia: 'Fev/26',
        caixa: '10/02/2026',
        frente: 'PAIDEIA',
        cc: 'Escola Paideia',
        valor: 1200.00,
        status: 'PAGO',
        limiteExcedido: false
    },
    {
        id: 3,
        descricao: 'Compra Mat. Escritório',
        fornecedor: 'Kalunga',
        competencia: 'Fev/26',
        caixa: '15/02/2026',
        frente: 'BIBLOS',
        cc: 'Acadêmico',
        valor: 8500.00,
        status: 'PENDENTE',
        limiteExcedido: true
    },
];

export default function DespesasPage() {
    const [activeSidePanel, setActiveSidePanel] = useState<'NEW' | 'IMPORT' | null>(null);
    const [isEmpenho, setIsEmpenho] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Strategy */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Gestão de Despesas & Empenho</h1>
                    <p className="text-body">Controle orçamentário, limites por C.Custo e reserva de dotação</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSidePanel('IMPORT')} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Importar DDA
                    </button>
                    <button onClick={() => setActiveSidePanel('NEW')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <Plus size={18} /> Novo Lançamento
                    </button>
                </div>
            </div>

            {/* 2. Analytics Tier (Suppliers & Budget Limits) */}
            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
                {/* Concentration Report */}
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Concentração por Fornecedor</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {TOP_SUPPLIERS.map((sup, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                                    <span style={{ fontWeight: 600 }}>{sup.name}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>R$ {sup.total.toLocaleString()} ({sup.perc}%)</span>
                                </div>
                                <div style={{ height: '6px', background: '#1A1A1A', borderRadius: '3px' }}>
                                    <div style={{ width: `${sup.perc}%`, height: '100%', backgroundColor: 'var(--danger)', borderRadius: '3px', opacity: 1 - i * 0.15 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Enforcement Panel */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Monitoramento de Limites Orçamentários</h3>
                        <div className="badge badge-error" style={{ fontSize: '10px' }}>2 Alertas Críticos</div>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {BUDGET_LIMITS.map((limit, i) => (
                            <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: limit.alert ? '1px solid var(--danger)' : '1px solid #222' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginBottom: '8px' }}>{limit.cc}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: limit.alert ? 'var(--danger)' : 'white' }}>{limit.consumido}%</h4>
                                    <span style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>de R${limit.total / 1000}k</span>
                                </div>
                                <div style={{ height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(limit.consumido, 100)}%`, height: '100%', background: limit.alert ? 'var(--danger)' : 'var(--primary)' }} />
                                </div>
                                {limit.alert && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', color: 'var(--danger)', fontSize: '10px', fontWeight: 'bold' }}>
                                        <AlertCircle size={10} /> LIMITE EXCEDIDO
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. List Tier with Competência/Caixa */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input placeholder="Filtrar por centro de custo ou fornecedor..." style={inputStyle} />
                        <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}><Filter size={16} /></button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '11px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px 24px' }}>Descrição / Favorecido</th>
                            <th style={{ padding: '16px' }}>Competência</th>
                            <th style={{ padding: '16px' }}>Caixa (Vencto)</th>
                            <th style={{ padding: '16px' }}>C. Custo / Frente</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_EXPENSES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <ShoppingCart size={14} color={entry.limiteExcedido ? 'var(--danger)' : 'var(--text-disabled)'} />
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{entry.fornecedor}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.descricao}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{entry.competencia}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={12} opacity={0.6} />
                                        {entry.caixa}
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <p style={{ fontWeight: 500 }}>{entry.cc}</p>
                                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{entry.frente}</p>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: entry.limiteExcedido ? 'var(--danger)' : 'white' }}>
                                    R$ {entry.valor.toLocaleString()}
                                    {entry.limiteExcedido && <div style={{ fontSize: '9px', fontWeight: 'normal' }}>Acima do Orçado</div>}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <StatusLabel status={entry.status} />
                                </td>
                                <td style={{ padding: '16px 24px' }}><MoreHorizontal size={18} color="#444" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Refined Side Panel for New Entry / Empenho */}
            {activeSidePanel === 'NEW' && (
                <div style={sidePanelStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Novo Lançamento / Empenho</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', background: '#0D0D0D', padding: '12px', borderRadius: '12px', border: '1px solid #222', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ background: isEmpenho ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: isEmpenho ? 'black' : 'white', padding: '10px', borderRadius: '8px', flex: 1, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }} onClick={() => setIsEmpenho(true)}>
                                <Bookmark size={16} style={{ marginBottom: '4px', margin: 'auto' }} />
                                <p style={{ fontSize: '11px', fontWeight: 'bold' }}>EMPENHAR</p>
                            </div>
                            <div style={{ background: !isEmpenho ? 'var(--danger)' : 'rgba(255,255,255,0.05)', color: 'white', padding: '10px', borderRadius: '8px', flex: 1, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }} onClick={() => setIsEmpenho(false)}>
                                <CreditCard size={16} style={{ marginBottom: '4px', margin: 'auto' }} />
                                <p style={{ fontSize: '11px', fontWeight: 'bold' }}>LANÇAR DIRETO</p>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Fornecedor</label>
                            <input placeholder="Busque ou cadastre fornecedor..." style={inputStyle} />
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>C. Custo / Unidade</label>
                                <select style={inputStyle}>
                                    <option>Marketing Central</option>
                                    <option>Escola Paideia</option>
                                    <option>Infraestrutura</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Frente</label>
                                <select style={inputStyle}><option>PAIDEIA</option><option>OIKOS</option><option>BIBLOS</option></select>
                            </div>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Competência</label>
                                <input type="month" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Pagamento (Caixa)</label>
                                <input type="date" style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Valor</label>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="R$ 0,00" style={{ ...inputStyle, fontWeight: 'bold', border: '1px solid #333' }} />
                                <Info size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                        </div>

                        {isEmpenho && (
                            <div style={{ background: 'rgba(41, 121, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(41, 121, 255, 0.2)' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ShieldAlert size={18} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Reserva de Dotação</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            Ao empenhar, o valor será bloqueado no orçamento do Centro de Custo, impedindo novos gastos que excedam o planejado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 23, 68, 0.03)', borderRadius: '12px', border: '1px dashed var(--danger)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={20} color="var(--danger)" />
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <strong style={{ color: 'white' }}>Regra de Bloqueio:</strong> O sistema está configurado para <span style={{ color: 'var(--danger)' }}>BLOQUEAR</span> automaticamente lançamentos que excedam 100% da dotação.
                            </p>
                        </div>

                        <button className="btn btn-primary" style={{ padding: '16px', background: isEmpenho ? 'var(--primary)' : 'var(--danger)', borderColor: isEmpenho ? 'var(--primary)' : 'var(--danger)', marginTop: '10px' }}>
                            {isEmpenho ? 'Confirmar Empenho / Reserva' : 'Confirmar Lançamento Direto'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatusLabel({ status }: { status: string }) {
    const styles: any = {
        'PAGO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'BLOQUEADO': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--primary)' },
    };
    const style = styles[status] || { bg: '#333', color: '#AAA' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, backgroundColor: style.bg, color: style.color }}>{status}</span>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.7)', zIndex: 1000, overflowY: 'auto' };
const sidePanelHeader: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
