'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowUpRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, PieChart, BarChart3,
    FileSpreadsheet, CreditCard, LayoutGrid, Package
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
        descricao: 'Doação Individual - Oikos',
        cliente: 'Marcos Oliveira',
        modalidade: 'DOAÇÃO',
        produto: 'Fundo Social',
        frente: 'OIKOS',
        valor: 500.00,
        vencimento: '12/02/2026',
        status: 'RECEBIDO'
    },
    {
        id: 3,
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
    const [showNewEntry, setShowNewEntry] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header & Main Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Gestão de Receitas</h1>
                    <p className="text-body">Monitoramento de faturamento por modalidade, produto e frente</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileSpreadsheet size={16} /> Importar Planilha
                    </button>
                    <button onClick={() => setShowNewEntry(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Novo Lançamento
                    </button>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                {/* Revenue Mix */}
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Mix de Receita (Modalidade)</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie
                                    data={REVENUE_MIX}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {REVENUE_MIX.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }}
                                    formatter={(value: number) => `R$ ${value.toLocaleString()}`}
                                />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                        {REVENUE_MIX.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: item.color }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '20px' }}>Top Produtos / Serviços</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {TOP_PRODUCTS.map((prod, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{prod.name}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>R$ {prod.total.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(prod.total / 400000) * 100}%`,
                                        height: '100%',
                                        backgroundColor: i === 0 ? 'var(--primary)' : 'var(--secondary)'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delinquency & Health */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>Inadimplência (Vencidos)</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--danger)' }}>R$ 12.450</h2>
                        <p style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>↑ 4.2% em relação ao mês anterior</p>
                    </div>
                    <div style={{ width: '100%', height: '1px', backgroundColor: '#333' }} />
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>Taxa de Recompra / Recorrência</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--success)' }}>84.2%</h2>
                        <p style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>Alvo: 80%</p>
                    </div>
                </div>
            </div>

            {/* Main Grid & Filters */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                            <input
                                placeholder="Pesquisar faturamento..."
                                className="input-search"
                                style={{ width: '100%', background: '#0A0A0A', border: '1px solid #333', padding: '8px 12px 8px 36px', borderRadius: '8px', color: 'white', fontSize: '14px' }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        </div>
                        <select style={{ background: '#0A0A0A', border: '1px solid #333', color: 'var(--text-secondary)', padding: '0 12px', borderRadius: '8px', fontSize: '13px' }}>
                            <option>Todas as Frentes</option>
                            <option>PAIDEIA</option>
                            <option>OIKOS</option>
                            <option>BIBLOS</option>
                        </select>
                    </div>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '13px' }}>
                        <Filter size={14} style={{ marginRight: '8px' }} /> Ordenar por Vencimento
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', textTransform: 'uppercase', fontSize: '11px' }}>
                            <th style={{ padding: '16px 24px' }}>Favorecido / Descrição</th>
                            <th style={{ padding: '16px' }}>Modalidade</th>
                            <th style={{ padding: '16px' }}>Produto</th>
                            <th style={{ padding: '16px' }}>Frente</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px', width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_REVENUES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: '#111', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{entry.cliente}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.descricao}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{entry.modalidade}</span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Package size={14} color="var(--primary)" />
                                        <span>{entry.produto}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span className={`badge badge-${entry.frente.toLowerCase()}`} style={{ fontSize: '10px' }}>{entry.frente}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                                    R$ {entry.valor.toLocaleString()}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <StatusLabel status={entry.status} />
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <MoreHorizontal size={18} style={{ color: '#555', cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Side Panel for New Entry / Faturamento */}
            {showNewEntry && (
                <div style={{
                    position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px',
                    backgroundColor: '#0A0A0A', borderLeft: '1px solid #333', zIndex: 1000,
                    padding: '40px', boxShadow: '-24px 0 48px rgba(0,0,0,0.6)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 className="text-h2">Novo Faturamento</h2>
                        <button onClick={() => setShowNewEntry(false)} className="btn btn-ghost">X</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Modalidade de Entrada</label>
                            <select style={inputStyle}>
                                <option>Assinatura (Recorrente)</option>
                                <option>Venda Avulsa</option>
                                <option>Doação</option>
                                <option>Parceria / Patrocínio</option>
                                <option>Licenciamento</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Cliente / Favorecido</label>
                            <input placeholder="Digite o nome..." style={inputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Produto / Serviço</label>
                                <select style={inputStyle}>
                                    <option>Mensalidade Escolar</option>
                                    <option>Curso Liderança</option>
                                    <option>Evento Biblos</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Frente de Trabalho</label>
                                <select style={inputStyle}>
                                    <option>PAIDEIA</option>
                                    <option>OIKOS</option>
                                    <option>BIBLOS</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Valor Bruto</label>
                                <input placeholder="R$ 0,00" style={{ ...inputStyle, fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Vencimento</label>
                                <input type="date" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed #444' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <CreditCard size={18} color="var(--primary)" />
                                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Configurações de Cobrança</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px', border: '1px solid #333' }}>Única</button>
                                <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Parcelada</button>
                                <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px', border: '1px solid #333' }}>Recorrente</button>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>Confirmar Receita</button>
                            <button onClick={() => setShowNewEntry(false)} className="btn btn-ghost" style={{ flex: 0.5 }}>Cancelar</button>
                        </div>
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
        <span style={{
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
            backgroundColor: style.bg, color: style.color
        }}>
            {status}
        </span>
    );
}

const inputStyle = {
    width: '100%', backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px',
    padding: '12px', color: 'white', fontSize: '14px', outline: 'none'
};

const labelStyle = {
    fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase',
    marginBottom: '8px', display: 'block', fontWeight: 'bold'
};
