'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowDownRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, ShoppingCart,
    PieChart as PieIcon, BarChart3, FileText, CreditCard,
    Zap, Repeat, X, UploadCloud, Briefcase
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const EXPENSE_NATURE = [
    { name: 'Custo Variável', value: 145000, color: 'var(--danger)' },
    { name: 'Custo Fixo', value: 210000, color: 'var(--secondary)' },
    { name: 'Investimento', value: 85000, color: 'var(--primary)' },
];

const TOP_SUPPLIERS = [
    { name: 'Microsoft BR', total: 45000, natureza: 'FIXO' },
    { name: 'Clima Tech', total: 12000, natureza: 'VARIÁVEL' },
    { name: 'Kalunga', total: 8500, natureza: 'VARIÁVEL' },
    { name: 'Meta Ads', total: 25000, natureza: 'VARIÁVEL' },
];

const RECENT_EXPENSES = [
    {
        id: 1,
        descricao: 'Licenças Microsoft 365',
        fornecedor: 'Microsoft BR',
        natureza: 'FIXO',
        frente: 'DIVERSOS',
        conta: 'TI / Softwares',
        valor: 4500.00,
        vencimento: '20/02/2026',
        status: 'PENDENTE'
    },
    {
        id: 2,
        descricao: 'Manutenção Preventiva AC',
        fornecedor: 'Clima Tech',
        natureza: 'VARIÁVEL',
        frente: 'PAIDEIA',
        conta: 'Infraestrutura',
        valor: 1200.00,
        vencimento: '10/02/2026',
        status: 'PAGO'
    },
    {
        id: 3,
        descricao: 'Marketing Digital - Jan/26',
        fornecedor: 'Meta Ads',
        natureza: 'VARIÁVEL',
        frente: 'OIKOS',
        conta: 'Publicidade',
        valor: 12500.00,
        vencimento: '28/02/2026',
        status: 'AGENDADO'
    },
];

export default function DespesasPage() {
    const [activeSidePanel, setActiveSidePanel] = useState<'NEW' | 'IMPORT' | null>(null);
    const [expenseNature, setExpenseNature] = useState<'FIXO' | 'VARIAVEL'>('FIXO');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Gestão de Despesas</h1>
                    <p className="text-body">Controle de saídas por natureza, fornecedor e frente de trabalho</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSidePanel('IMPORT')} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Importar Boletos
                    </button>
                    <button onClick={() => setActiveSidePanel('NEW')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <Plus size={18} /> Nova Despesa
                    </button>
                </div>
            </div>

            {/* 2. Analytics Tier */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Natureza do Gasto</h3>
                    <div style={{ height: '180px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={EXPENSE_NATURE} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {EXPENSE_NATURE.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                        {EXPENSE_NATURE.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.color }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Principais Fornecedores</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {TOP_SUPPLIERS.map((sup, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                                    <span style={{ fontWeight: 600 }}>{sup.name}</span>
                                    <span style={{ color: 'var(--danger)' }}>R$ {sup.total.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                                    <div style={{ width: `${(sup.total / 50000) * 100}%`, height: '100%', backgroundColor: sup.natureza === 'FIXO' ? 'var(--secondary)' : 'var(--danger)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Clock size={14} color="var(--secondary)" />
                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Próximos Pagamentos (7d)</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>R$ 38.540</h2>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ 85%</span> das despesas fixas provisionadas.
                    </p>
                    <button className="btn btn-ghost" style={{ marginTop: '16px', fontSize: '11px', width: 'fit-content', border: '1px solid #333' }}>Consultar Fluxo Semanal</button>
                </div>
            </div>

            {/* 3. Filter & List Tier */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input placeholder="Buscar despesa ou fornecedor..." style={inputStyle} />
                        <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}><Filter size={16} /></button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '11px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px 24px' }}>Descrição / Fornecedor</th>
                            <th style={{ padding: '16px' }}>Natureza</th>
                            <th style={{ padding: '16px' }}>Conta / C.Custo</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Vencimento</th>
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
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: entry.natureza === 'FIXO' ? 'var(--secondary)' : 'var(--danger)' }}>{entry.natureza}</span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '12px' }}>{entry.conta}</span>
                                    </div>
                                    <span style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{entry.frente}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>R$ {entry.valor.toLocaleString()}</td>
                                <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{entry.vencimento}</td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <StatusLabel status={entry.status} />
                                </td>
                                <td style={{ padding: '16px 24px' }}><MoreHorizontal size={18} color="#444" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Side Panels */}
            {activeSidePanel === 'NEW' && (
                <div style={sidePanelStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Nova Despesa</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Fornecedor / Credor</label>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="Busque fornecedor cadastrado..." style={{ ...inputStyle, paddingLeft: '40px' }} />
                                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Descrição do Gasto</label>
                            <input placeholder="Ex: Compra de Material de Limpeza" style={inputStyle} />
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Natureza</label>
                                <div style={{ display: 'flex', gap: '4px', background: '#0D0D0D', padding: '4px', borderRadius: '8px', border: '1px solid #222' }}>
                                    <button onClick={() => setExpenseNature('FIXO')} style={{ ...tabStyle, ...(expenseNature === 'FIXO' ? { background: '#222', color: 'white' } : {}) }}>FIXO</button>
                                    <button onClick={() => setExpenseNature('VARIAVEL')} style={{ ...tabStyle, ...(expenseNature === 'VARIAVEL' ? { background: '#222', color: 'white' } : {}) }}>VARIÁVEL</button>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Frente</label>
                                <select style={inputStyle}><option>PAIDEIA</option><option>OIKOS</option><option>BIBLOS</option></select>
                            </div>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Valor</label>
                                <input placeholder="R$ 0,00" style={{ ...inputStyle, fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vencimento</label>
                                <input type="date" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px dashed #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Repeat size={16} color="var(--primary)" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Configurar Recorrência</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="checkbox" id="recur" />
                                <label htmlFor="recur" style={{ fontSize: '12px', color: 'white' }}>Repetir este lançamento mensalmente</label>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ padding: '16px', background: 'var(--danger)', borderColor: 'var(--danger)', marginTop: '20px' }}>Confirmar Despesa</button>
                    </div>
                </div>
            )}

            {activeSidePanel === 'IMPORT' && (
                <div style={sidePanelStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Importar Boletos</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ border: '2px dashed #333', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <UploadCloud size={48} color="var(--danger)" opacity={0.4} />
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '15px' }}>Upload de Arquivos DDA / PDF</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)', marginTop: '4px' }}>Arraste seus boletos ou o arquivo de remessa</p>
                        </div>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '12px' }}>Selecionar Pasta</button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatusLabel({ status }: { status: string }) {
    const styles: any = {
        'PAGO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)' },
        'AGENDADO': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'ATRASADO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
    };
    const style = styles[status] || { bg: '#333', color: '#AAA' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, backgroundColor: style.bg, color: style.color }}>{status}</span>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.7)', zIndex: 1000 };
const sidePanelHeader: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const tabStyle: any = { flex: 1, padding: '8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', border: 'none', background: 'transparent', color: 'var(--text-disabled)', cursor: 'pointer', transition: '0.2s' };
