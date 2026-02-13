'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, MoreHorizontal,
    ArrowUpRight, Calendar, Bookmark, Building2, User,
    CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

const ENTRIES = [
    {
        id: 1,
        descricao: 'Mensalidade Escolar - Turma 01',
        cliente: 'Ana Paula Silva',
        frente: 'PAIDEIA',
        conta: 'Mensalidades',
        valor: 1250.00,
        vencimento: '15/02/2026',
        status: 'PENDENTE'
    },
    {
        id: 2,
        descricao: 'Doação Recorrente - Plano Oikos',
        cliente: 'Igreja Central',
        frente: 'OIKOS',
        conta: 'Doações',
        valor: 5000.00,
        vencimento: '12/02/2026',
        status: 'RECEBIDO'
    },
    {
        id: 3,
        descricao: 'Evento Conferência Mulheres',
        cliente: 'Inscritos Individuais',
        frente: 'BIBLOS',
        conta: 'Eventos',
        valor: 8450.00,
        vencimento: '10/02/2026',
        status: 'ATRASADO'
    },
    {
        id: 4,
        descricao: 'Venda de Apostilas - 1º Semestre',
        cliente: 'Externos',
        frente: 'PAIDEIA',
        conta: 'Venda Material',
        valor: 120.00,
        vencimento: '22/02/2026',
        status: 'PENDENTE'
    },
];

export default function ReceitasPage() {
    const [showNewEntry, setShowNewEntry] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Receitas e Entradas</h1>
                    <p className="text-body">Gestão de faturamento, doações e recebíveis do ecossistema</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Exportar
                    </button>
                    <button onClick={() => setShowNewEntry(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Nova Receita
                    </button>
                </div>
            </div>

            {/* Mini Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '12px' }}>
                        <ArrowUpRight size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Previsto Total</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 145.2k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)', padding: '12px', borderRadius: '12px' }}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>A Receber (30d)</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 42.8k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '12px' }}>
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Vencido</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 12.4k</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '12px' }}>
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Recebido (Mês)</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 90.6k</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <input
                            placeholder="Pesquisar por cliente, descrição ou documento..."
                            className="input-search"
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
                            <th style={{ padding: '16px' }}>Frente/Conta</th>
                            <th style={{ padding: '16px' }}>Vencimento</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '16px 24px', width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ENTRIES.map(entry => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: '#111', borderRadius: '8px', color: 'var(--primary)' }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'white' }}>{entry.descricao}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>{entry.cliente}</p>
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
                        <h2 className="text-h2">Nova Receita</h2>
                        <button onClick={() => setShowNewEntry(false)} className="btn btn-ghost" style={{ padding: '8px' }}>X</button>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Descrição</label>
                            <input placeholder="Ex: Mensalidade Fevereiro" style={formInputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Frente</label>
                                <select style={formInputStyle}>
                                    <option>PAIDEIA</option>
                                    <option>OIKOS</option>
                                    <option>BIBLOS</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Plano de Contas</label>
                                <select style={formInputStyle}>
                                    <option>Mensalidades</option>
                                    <option>Doações</option>
                                    <option>Eventos</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Cliente / Favorecido</label>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="Nome ou CPF/CNPJ" style={{ ...formInputStyle, paddingLeft: '40px' }} />
                                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Valor Total</label>
                                <input placeholder="R$ 0,00" style={{ ...formInputStyle, fontWeight: 'bold', border: '1px solid var(--primary)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-disabled)', marginBottom: '8px', display: 'block' }}>Vencimento</label>
                                <input type="date" style={formInputStyle} />
                            </div>
                        </div>

                        <div style={{ padding: '16px', border: '1px dashed #333', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Configuração de Parcelas</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '13px' }}>Gerar</span>
                                <input type="number" defaultValue={1} style={{ width: '60px', ...formInputStyle, padding: '6px' }} />
                                <span style={{ fontSize: '13px' }}>parcela(s) mensalmente.</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>Salvar Lançamento</button>
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
        'RECEBIDO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)' },
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
