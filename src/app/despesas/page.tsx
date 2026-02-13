'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowDownRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle, ShoppingCart
} from 'lucide-react';

const EXPENSES = [
    {
        id: 1,
        descricao: 'Fornecedor de TI - Licenças Microsoft',
        favorecido: 'Microsoft BR',
        frente: 'DIVERSOS',
        conta: 'Softwares',
        valor: 4500.00,
        vencimento: '20/02/2026',
        status: 'PENDENTE'
    },
    {
        id: 2,
        descricao: 'Manutenção de Ar-condicionado',
        favorecido: 'Clima Tech',
        frente: 'PAIDEIA',
        conta: 'Infraestrutura',
        valor: 1200.00,
        vencimento: '10/02/2026',
        status: 'PAGO'
    },
    {
        id: 3,
        descricao: 'Compra de Material de Escritório',
        favorecido: 'Kalunga',
        frente: 'PAIDEIA',
        conta: 'Material Higiene',
        valor: 850.00,
        vencimento: '05/02/2026',
        status: 'ATRASADO'
    },
    {
        id: 4,
        descricao: 'Marketing Digital - Jan/2026',
        favorecido: 'Meta Ads',
        frente: 'OIKOS',
        conta: 'Publicidade',
        valor: 12500.00,
        vencimento: '28/02/2026',
        status: 'AGENDADO'
    },
];

export default function DespesasPage() {
    const [showNewEntry, setShowNewEntry] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Despesas e Saídas</h1>
                    <p className="text-body">Gestão de pagamentos, fornecedores e custos operacionais</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Exportar
                    </button>
                    <button onClick={() => setShowNewEntry(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        <Plus size={18} /> Nova Despesa
                    </button>
                </div>
            </div>

            {/* Mini Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '12px' }}>
                        <ArrowDownRight size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Total Programado</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 212.4k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '12px' }}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>A Pagar (15d)</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 38.5k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '12px' }}>
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Vencido</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 4.2k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white', padding: '12px', borderRadius: '12px' }}>
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Pago (Mês)</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 156.9k</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <input
                            placeholder="Pesquisar por fornecedor, descrição..."
                            style={{
                                width: '100%',
                                background: '#0A0A0A',
                                border: '1px solid #333',
                                padding: '10px 12px 10px 40px',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px'
                            }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #333' }}>
                        <Filter size={16} /> Filtros
                    </button>
                </div>
            </div>

            {/* Main List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-disabled)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '16px 24px' }}>Descrição / Favorecido</th>
                            <th style={{ padding: '16px' }}>Frente/Centro Custo</th>
                            <th style={{ padding: '16px' }}>Vencimento</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px', width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {EXPENSES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: '#111', borderRadius: '8px', color: 'var(--danger)' }}>
                                            <ShoppingCart size={16} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'white' }}>{entry.descricao}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>{entry.favorecido}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className={`badge badge-${entry.frente.toLowerCase()}`} style={{ alignSelf: 'flex-start' }}>{entry.frente}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{entry.conta}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <Calendar size={14} />
                                        <span>{entry.vencimento}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, fontSize: '15px' }}>
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

            {/* New Entry Sidebar UI (Simulated) */}
            {showNewEntry && (
                <div style={{
                    position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px',
                    backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', zIndex: 100,
                    padding: '40px', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)', overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 className="text-h2">Nova Despesa</h2>
                        <button onClick={() => setShowNewEntry(false)} className="btn btn-ghost" style={{ padding: '8px' }}>X</button>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Descrição</label>
                            <input placeholder="Ex: Pagamento Fornecedor AWS" style={formInputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Frente</label>
                                <select style={formInputStyle}>
                                    <option>PAIDEIA</option>
                                    <option>OIKOS</option>
                                    <option>BIBLOS</option>
                                    <option>DIVERSOS</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Centro de Custo</label>
                                <select style={formInputStyle}>
                                    <option>TI / Tecnologia</option>
                                    <option>Marketing</option>
                                    <option>Infraestrutura</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Favorecido / Fornecedor</label>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="Nome ou CNPJ" style={{ ...formInputStyle, paddingLeft: '40px' }} />
                                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Valor</label>
                                <input placeholder="R$ 0,00" style={{ ...formInputStyle, fontWeight: 'bold', border: '1px solid var(--danger)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Vencimento</label>
                                <input type="date" style={formInputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Tipo de Lançamento</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1, border: '1px solid #333', fontSize: '13px' }}>Único</button>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '13px' }}>Parcelado / Fixo</button>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn btn-primary" style={{ flex: 1, padding: '14px', backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>Confirmar Saída</button>
                            <button type="button" onClick={() => setShowNewEntry(false)} className="btn btn-ghost" style={{ border: '1px solid #333' }}>Cancelar</button>
                        </div>
                    </form>
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
    const style = styles[status];
    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: style.bg,
            color: style.color
        }}>
            {status}
        </span>
    );
}

const formInputStyle = {
    width: '100%',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
    color: 'white',
    outline: 'none',
    fontSize: '14px'
};
