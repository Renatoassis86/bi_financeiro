'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowUpRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, PieChart, BarChart3,
    FileSpreadsheet, CreditCard, LayoutGrid, Package,
    UploadCloud, X, ChevronRight, Info
} from 'lucide-react';
import {
    PieChart as RechartsPie, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const REVENUE_MIX = [
    { name: 'Assinaturas', value: 450000, color: 'var(--primary)' },
    { name: 'Vendas Avulsas', value: 120000, color: 'var(--secondary)' },
    { name: 'Doações', value: 85000, color: 'var(--warning)' },
    { name: 'Eventos', value: 210000, color: 'var(--success)' },
    { name: 'Licenciamento', value: 95000, color: '#A855F7' },
];

const TOP_PRODUCTS = [
    { name: 'Mensalidade Escolar', total: 380000, frente: 'PAIDEIA' },
    { name: 'Curso Liderança', total: 125000, frente: 'OIKOS' },
    { name: 'Material Didático', total: 98000, frente: 'PAIDEIA' },
    { name: 'Conferência Anual', total: 85000, frente: 'BIBLOS' },
];

const RECENT_REVENUES = [
    {
        id: 1,
        descricao: 'Assinatura Plano Master',
        cliente: 'Ana Paula Silva',
        modalidade: 'ASSINATURA',
        produto: 'Educação Continuada',
        frente: 'PAIDEIA',
        valor: 1250.00,
        vencimento: '15/02/2026',
        status: 'PENDENTE'
    },
    {
        id: 2,
        descricao: 'Ingresso Conferência Biblos',
        cliente: 'João Pereira',
        modalidade: 'EVENTO',
        produto: 'Inscrição VIP',
        frente: 'BIBLOS',
        valor: 850.00,
        vencimento: '10/02/2026',
        status: 'ATRASADO'
    },
];

export default function ReceitasPage() {
    const [activeSidePanel, setActiveSidePanel] = useState<'NEW' | 'IMPORT' | null>(null);
    const [billingType, setBillingType] = useState<'UNICA' | 'PARCELADA' | 'RECORRENTE'>('UNICA');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Gestão de Receitas</h1>
                    <p className="text-body">Faturamento por modalidade, produto e frente de trabalho</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSidePanel('IMPORT')} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileSpreadsheet size={16} /> Importar Recebíveis
                    </button>
                    <button onClick={() => { setActiveSidePanel('NEW'); setBillingType('UNICA'); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Novo Lançamento
                    </button>
                </div>
            </div>

            {/* 2. Analytics Dashboard Tier */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Mix de Faturamento</h3>
                    <div style={{ height: '180px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie data={REVENUE_MIX} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {REVENUE_MIX.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '11px' }} />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                        {REVENUE_MIX.slice(0, 4).map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.color }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Top Produtos (Performance)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {TOP_PRODUCTS.map((prod, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                                    <span style={{ fontWeight: 600 }}>{prod.name}</span>
                                    <span style={{ color: 'var(--primary)' }}>R$ {prod.total.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                                    <div style={{ width: `${(prod.total / 400000) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', opacity: 1 - i * 0.2 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertCircle size={14} color="var(--danger)" />
                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Créditos em Atraso</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--danger)' }}>R$ 12.450</h2>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>↑ 12%</span> em relação à meta de adimplência.
                    </p>
                    <button className="btn btn-ghost" style={{ marginTop: '16px', fontSize: '11px', width: 'fit-content', border: '1px solid #333' }}>Ver Relatório de Cobrança</button>
                </div>
            </div>

            {/* 3. Filter & List Tier */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input placeholder="Buscar por cliente ou produto..." style={inputStyle} />
                        <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}><Filter size={16} /></button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '11px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px 24px' }}>Cliente / Documento</th>
                            <th style={{ padding: '16px' }}>Produto</th>
                            <th style={{ padding: '16px' }}>Frente</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor Bruto</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Vencimento</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_REVENUES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <p style={{ fontWeight: 600 }}>{entry.cliente}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.descricao}</p>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={14} opacity={0.5} />
                                        {entry.produto}
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span className={`badge badge-${entry.frente.toLowerCase()}`}>{entry.frente}</span>
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

            {/* 4. Side Panel: NEW ENTRY / FATURAMENTO */}
            {activeSidePanel === 'NEW' && (
                <div style={sidePanelBaseStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Novo Faturamento</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Cliente / Favorecido</label>
                            <input placeholder="Procure por nome ou CPF..." style={inputStyle} />
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Produto</label>
                                <select style={inputStyle}><option>Mensalidades</option><option>Curso</option></select>
                            </div>
                            <div>
                                <label style={labelStyle}>Frente</label>
                                <select style={inputStyle}><option>PAIDEIA</option><option>OIKOS</option></select>
                            </div>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Valor Bruto</label>
                                <input placeholder="R$ 0,00" style={{ ...inputStyle, fontWeight: 'bold', border: '1px solid var(--primary)' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vencimento Base</label>
                                <input type="date" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <CreditCard size={18} color="var(--primary)" />
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Modelo de Cobrança</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                {(['UNICA', 'PARCELADA', 'RECORRENTE'] as const).map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setBillingType(m)}
                                        style={{ ...tabButtonStyle, ...(billingType === m ? { background: 'var(--primary)', color: 'black' } : {}) }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            {billingType === 'PARCELADA' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Número de Parcelas</label>
                                        <input type="number" defaultValue={2} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Intervalo (Dias)</label>
                                        <input type="number" defaultValue={30} style={inputStyle} />
                                    </div>
                                </div>
                            )}
                            {billingType === 'RECORRENTE' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Info size={14} color="var(--text-disabled)" />
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fatura será gerada mensalmente até cancelamento.</span>
                                </div>
                            )}
                        </div>

                        <button className="btn btn-primary" style={{ padding: '16px', marginTop: '12px' }}>Confirmar e Gerar Fatura</button>
                    </div>
                </div>
            )}

            {/* 5. Side Panel: IMPORT */}
            {activeSidePanel === 'IMPORT' && (
                <div style={sidePanelBaseStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Importar Recebíveis</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>
                    <div style={{ border: '2px dashed #333', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <UploadCloud size={48} color="var(--primary)" opacity={0.5} />
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '15px' }}>Arraste seu arquivo Excel/CSV</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)', marginTop: '4px' }}>Ou clique para selecionar de seu computador</p>
                        </div>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '12px' }}>Selecionar Arquivo</button>
                    </div>
                    <div style={{ marginTop: '32px' }}>
                        <h4 style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '12px' }}>Formatos Suportados</h4>
                        <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} /> Planilha de Mensalidades (Padrão Paideia)</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} /> Exportação de Gateway (Vindi/Asaas)</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} /> Arquivo CNAB (Retorno Bancário)</li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatusLabel({ status }: { status: string }) {
    const styles: any = {
        'RECEBIDO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)' },
        'ATRASADO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
    };
    const style = styles[status] || { bg: '#333', color: '#AAA' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, backgroundColor: style.bg, color: style.color }}>{status}</span>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelBaseStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', zLayout: 1000, padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.7)', zIndex: 1000 };
const sidePanelHeader: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const tabButtonStyle: any = { flex: 1, padding: '8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #333', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' };
