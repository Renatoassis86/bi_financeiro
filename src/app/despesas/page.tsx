'use client';

import React, { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowDownRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, ShoppingCart,
    PieChart as PieIcon, BarChart3, FileText, CreditCard,
    Zap, Repeat, X, UploadCloud, Briefcase, ShieldAlert,
    Target, Info, ArrowUpRight, Settings2, Sliders
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
        status: 'BLOQUEADO',
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
];

export default function DespesasPage() {
    const [activeSidePanel, setActiveSidePanel] = useState<'NEW' | 'IMPORT' | 'SETTINGS' | null>(null);
    const [isEmpenho, setIsEmpenho] = useState(false);
    const [limitRule, setLimitRule] = useState<'BLOCK' | 'ALERT'>('BLOCK');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Strategy Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Gestão de Despesas & Empenho</h1>
                    <p className="text-body">Registro de saídas, compromissos futuros e governança orçamentária</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSidePanel('SETTINGS')} className="btn btn-ghost" style={{ border: '1px solid #333' }}>
                        <Sliders size={18} />
                    </button>
                    <button onClick={() => setActiveSidePanel('IMPORT')} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UploadCloud size={16} /> Importar DDA
                    </button>
                    <button onClick={() => setActiveSidePanel('NEW')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <Plus size={18} /> Novo Gasto
                    </button>
                </div>
            </div>

            {/* 2. Intelligence Bar - Budget & Suppliers */}
            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
                {/* Suppliers/Concentration Card */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="text-h3" style={{ fontSize: '13px' }}>Concentração por Fornecedor</h3>
                        <BarChart3 size={16} color="var(--text-disabled)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {TOP_SUPPLIERS.map((sup, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                                    <span style={{ fontWeight: 600 }}>{sup.name}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>R$ {sup.total.toLocaleString()} ({sup.perc}%)</span>
                                </div>
                                <div style={{ height: '5px', background: '#1A1A1A', borderRadius: '3px' }}>
                                    <div style={{ width: `${sup.perc}%`, height: '100%', backgroundColor: 'var(--danger)', borderRadius: '3px', opacity: 1 - i * 0.2 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Budget Monitor */}
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="text-h3" style={{ fontSize: '13px' }}>Monitoramento de Dotação (Centro de Custo)</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: limitRule === 'BLOCK' ? 'var(--danger)' : 'var(--warning)', fontWeight: 'bold' }}>
                            <ShieldAlert size={12} /> REGRA: {limitRule === 'BLOCK' ? 'BLOQUEIO ATIVO' : 'ALERTAR APENAS'}
                        </div>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {BUDGET_LIMITS.map((item, i) => (
                            <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', position: 'relative' }}>
                                <p style={{ fontSize: '10px', color: 'var(--text-disabled)', marginBottom: '4px' }}>{item.cc}</p>
                                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: item.alert ? 'var(--danger)' : 'white' }}>{item.consumido}%</h4>
                                <div style={{ height: '3px', background: '#222', marginTop: '12px', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(item.consumido, 100)}%`, height: '100%', backgroundColor: item.alert ? 'var(--danger)' : 'var(--primary)' }} />
                                </div>
                                {item.alert && <AlertCircle size={14} color="var(--danger)" style={{ position: 'absolute', top: '16px', right: '16px' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Operational List - Accrual & Cash Reporting */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <h3 className="text-h3" style={{ fontSize: '14px', marginRight: 'auto' }}>Lançamentos e Compromissos</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="badge badge-paideia">Competência</div>
                        <div className="badge badge-oikos">Caixa</div>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px 24px' }}>Favorecido</th>
                            <th style={{ padding: '16px' }}>Competência / Caixa</th>
                            <th style={{ padding: '16px' }}>C. Custo / Categoria</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor Gasto</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_EXPENSES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <p style={{ fontWeight: 600 }}>{entry.fornecedor}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.descricao}</p>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontSize: '12px', color: 'white' }}>{entry.competencia}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Pagt: {entry.caixa}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <p style={{ fontWeight: 500 }}>{entry.cc}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.frente}</p>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>R$ {entry.valor.toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <StatusBadge status={entry.status} />
                                </td>
                                <td style={{ padding: '16px 24px' }}><MoreHorizontal size={18} color="#444" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Settings Panel (SidePanel) */}
            {activeSidePanel === 'SETTINGS' && (
                <div style={sidePanelStyle}>
                    <div style={sideHeaderStyle}>
                        <h2 className="text-h2">Governança Orçamentária</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', color: 'var(--primary)' }}>Regra de Excedente</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div
                                    onClick={() => setLimitRule('BLOCK')}
                                    style={{ ...ruleCardStyle, borderColor: limitRule === 'BLOCK' ? 'var(--danger)' : '#222' }}
                                >
                                    <ShieldAlert size={20} color={limitRule === 'BLOCK' ? 'var(--danger)' : '#444'} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Bloquear Lançamento</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Impede o salvamento se o orçamento do C. Custo for 100% atingido.</p>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setLimitRule('ALERT')}
                                    style={{ ...ruleCardStyle, borderColor: limitRule === 'ALERT' ? 'var(--warning)' : '#222' }}
                                >
                                    <AlertCircle size={20} color={limitRule === 'ALERT' ? 'var(--warning)' : '#444'} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Apenas Alertar</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Permite o lançamento, mas gera notificação para a Controladoria.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase' }}>Limites por Categoria</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <CategoryLimitEntry label="Folha de Pagamento" limit="100%" />
                                <CategoryLimitEntry label="Marketing e Ads" limit="120%" canExceed />
                                <CategoryLimitEntry label="Manutenção Predial" limit="95%" />
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: 'auto' }}>Salvar Configurações</button>
                    </div>
                </div>
            )}

            {/* 5. New Entry/Empenho Panel */}
            {activeSidePanel === 'NEW' && (
                <div style={sidePanelStyle}>
                    <div style={sideHeaderStyle}>
                        <h2 className="text-h2">Novo Gasto / Empenho</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Toggle Empenho */}
                        <div style={{ display: 'flex', gap: '8px', background: '#0D0D0D', padding: '6px', borderRadius: '12px', border: '1px solid #222' }}>
                            <button onClick={() => setIsEmpenho(true)} style={{ ...toggleBtnStyle, ...(isEmpenho ? activeToggleStyle : {}) }}>RESERVAR (EMPENHO)</button>
                            <button onClick={() => setIsEmpenho(false)} style={{ ...toggleBtnStyle, ...(!isEmpenho ? activeToggleStyle : {}) }}>LANÇAR (EFETIVO)</button>
                        </div>

                        <div>
                            <label style={labelStyle}>Fornecedor / Favorecido</label>
                            <input placeholder="Busque ou inicie novo cadastro..." style={inputStyle} />
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Centro de Custo</label>
                                <select style={inputStyle}><option>Marketing</option><option>Escola Paideia</option></select>
                            </div>
                            <div>
                                <label style={labelStyle}>Categoria</label>
                                <select style={inputStyle}><option>Publicidade</option><option>Infra</option></select>
                            </div>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Mês Competência</label>
                                <input type="month" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Data Pagamento</label>
                                <input type="date" style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Valor Bruto</label>
                            <input placeholder="R$ 0,00" style={{ ...inputStyle, fontSize: '18px', fontWeight: 'bold' }} />
                        </div>

                        {isEmpenho ? (
                            <div style={{ background: 'rgba(41, 121, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(41, 121, 255, 0.2)', display: 'flex', gap: '12px' }}>
                                <Bookmark size={24} color="var(--primary)" />
                                <p style={{ fontSize: '11px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                                    <strong>Compromisso Futuro:</strong> Este valor será reservado no orçamento e bloqueado para outros gastos da mesma categoria.
                                </p>
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(255, 23, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 23, 68, 0.2)', display: 'flex', gap: '12px' }}>
                                <Zap size={24} color="var(--danger)" />
                                <p style={{ fontSize: '11px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                                    <strong>Lançamento Direto:</strong> Registro imediato de dívida no contas a pagar, com impacto instantâneo no financeiro.
                                </p>
                            </div>
                        )}

                        <button className="btn btn-primary" style={{ padding: '16px', marginTop: '12px', background: isEmpenho ? 'var(--primary)' : 'var(--danger)', borderColor: 'var(--primary)' }}>
                            {isEmpenho ? 'Confirmar Reserva de Verba' : 'Efetivar Lançamento'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'PAGO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'BLOQUEADO': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--primary)' },
    };
    const s = styles[status] || { bg: '#333', color: '#999' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: s.bg, color: s.color }}>{status}</span>
    );
}

function CategoryLimitEntry({ label, limit, canExceed }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: canExceed ? 'var(--warning)' : 'var(--primary)' }}>BLOQ: {limit}</span>
                <MoreHorizontal size={14} color="#333" />
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, overflowY: 'auto' };
const sideHeaderStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const ruleCardStyle: any = { padding: '16px', border: '1px solid #222', borderRadius: '12px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center', transition: '0.2s' };
const toggleBtnStyle: any = { flex: 1, padding: '10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' };
const activeToggleStyle: any = { background: '#222', color: 'white' };
