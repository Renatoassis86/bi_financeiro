'use client';

import { useState } from 'react';
import {
    ArrowRightLeft, History, CheckCircle2, AlertCircle,
    ArrowRight, Search, Filter, ShieldCheck, User,
    Calendar, FileText, Info, Plus, X, ArrowUpRight
} from 'lucide-react';

const REALLOCATION_HISTORY = [
    {
        id: 'REQ-001',
        data: '13/02/2026',
        usuario: 'Renato Assis',
        valor: 15000.00,
        status: 'APROVADO',
        origem: { cc: 'Vendas', conta: 'Marketing Digital' },
        destino: { cc: 'Acadêmico', conta: 'Eventos Paideia' },
        motivo: 'Reforço para conferência anual devido ao aumento de inscrições.'
    },
    {
        id: 'REQ-002',
        data: '12/02/2026',
        usuario: 'Maria Silva',
        valor: 5200.00,
        status: 'PENDENTE',
        origem: { cc: 'Infraestrutura', conta: 'Manutenção' },
        destino: { cc: 'TI Central', conta: 'Softwares' },
        motivo: 'Upgrade emergencial de servidores.'
    },
];

const BUDGET_STATUS = [
    { cc: 'Vendas', disponivel: 45000, reservado: 12000 },
    { cc: 'Acadêmico', disponivel: 8000, reservado: 5000 },
    { cc: 'Infraestrutura', disponivel: 15600, reservado: 3000 },
];

export default function RemanejamentoPage() {
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [activeTab, setActiveTab] = useState<'HISTORY' | 'APPROVALS'>('HISTORY');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Remanejamento Orçamentário</h1>
                    <p className="text-body">Gestão de ajustes de verba entre centros de custo com rastreabilidade total</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowNewRequest(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRightLeft size={18} /> Novo Remanejamento
                    </button>
                </div>
            </div>

            {/* 2. Budget "Termômetros" Summary */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {BUDGET_STATUS.map((item, i) => (
                    <div key={i} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{item.cc}</span>
                            <Info size={14} color="var(--text-disabled)" />
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Saldo Disponível</p>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>R$ {item.disponivel.toLocaleString()}</h2>
                        <div style={{ height: '4px', background: '#222', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Reallocation Tabs & Main View */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ borderBottom: '1px solid var(--border-subtle)', display: 'flex', padding: '0 24px' }}>
                    <button
                        onClick={() => setActiveTab('HISTORY')}
                        style={{ ...tabStyle, borderBottom: activeTab === 'HISTORY' ? '2px solid var(--primary)' : 'none', color: activeTab === 'HISTORY' ? 'white' : 'var(--text-disabled)' }}
                    >
                        Trilha de Auditoria (Log)
                    </button>
                    <button
                        onClick={() => setActiveTab('APPROVALS')}
                        style={{ ...tabStyle, borderBottom: activeTab === 'APPROVALS' ? '2px solid var(--primary)' : 'none', color: activeTab === 'APPROVALS' ? 'white' : 'var(--text-disabled)' }}
                    >
                        Fila de Aprovação
                        <span style={{ marginLeft: '8px', background: 'var(--danger)', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '10px' }}>1</span>
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-disabled)', fontSize: '11px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 0' }}>Data / ID</th>
                                <th style={{ padding: '12px' }}>Ajuste (Origem → Destino)</th>
                                <th style={{ padding: '12px' }}>Solicitante</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '12px', width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {REALLOCATION_HISTORY.filter(h => activeTab === 'HISTORY' || (activeTab === 'APPROVALS' && h.status === 'PENDENTE')).map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '16px 0' }}>
                                        <p style={{ fontWeight: 600 }}>{item.id}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.data}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ fontSize: '11px' }}>
                                                <p style={{ color: 'var(--text-disabled)' }}>{item.origem.cc}</p>
                                                <p style={{ fontWeight: 600 }}>{item.origem.conta}</p>
                                            </div>
                                            <ArrowRight size={14} color="var(--primary)" />
                                            <div style={{ fontSize: '11px' }}>
                                                <p style={{ color: 'var(--text-disabled)' }}>{item.destino.cc}</p>
                                                <p style={{ fontWeight: 600 }}>{item.destino.conta}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={14} color="var(--text-disabled)" />
                                            <span>{item.usuario}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                                        R$ {item.valor.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <button className="btn btn-ghost" style={{ padding: '4px' }}>
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Slide-over for New Request */}
            {showNewRequest && (
                <div style={sidePanelStyle}>
                    <div style={sidePanelHeader}>
                        <h2 className="text-h2">Solicitar Remanejamento</h2>
                        <button onClick={() => setShowNewRequest(false)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,171,0,0.05)', border: '1px dashed var(--warning)', display: 'flex', gap: '12px' }}>
                            <ShieldCheck size={20} color="var(--warning)" />
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <strong>Atenção:</strong> Ajustes acima de R$ 5.000,00 exigem aprovação obrigatória da <span style={{ color: 'white', fontWeight: 'bold' }}>Controladoria Paideia</span>.
                            </p>
                        </div>

                        {/* Step 1: Origin */}
                        <div>
                            <label style={labelStyle}>Origem (De onde sai a verba?)</label>
                            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '12px' }}>
                                <select style={inputStyle}><option>C. Custo Vendas</option></select>
                                <select style={inputStyle}><option>Marketing Digital (SALDO: R$ 45k)</option></select>
                            </div>
                        </div>

                        {/* Icon divider */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ArrowRightLeft size={20} color="var(--primary)" />
                        </div>

                        {/* Step 2: Destination */}
                        <div>
                            <label style={labelStyle}>Destino (Para onde vai a verba?)</label>
                            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '12px' }}>
                                <select style={inputStyle}><option>C. Custo Acadêmico</option></select>
                                <select style={inputStyle}><option>Eventos Paideia (DISPONÍVEL: R$ 8k)</option></select>
                            </div>
                        </div>

                        {/* Step 3: Value */}
                        <div>
                            <label style={labelStyle}>Valor do Ajuste</label>
                            <input placeholder="R$ 0,00" style={{ ...inputStyle, fontSize: '18px', fontWeight: 'bold', border: '1px solid var(--primary)' }} />
                        </div>

                        {/* Step 4: Justification */}
                        <div>
                            <label style={labelStyle}>Justificativa / Motivo</label>
                            <textarea
                                placeholder="Descreva por que este remanejamento é necessário..."
                                style={{ ...inputStyle, height: '100px', resize: 'none' }}
                            />
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <button className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                                Enviar para Aprovação
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'APROVADO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'PENDENTE': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'REJEITADO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
    };
    const s = styles[status] || { bg: '#333', color: '#999' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: s.bg, color: s.color }}>{status}</span>
    );
}

const tabStyle = { padding: '16px 20px', fontSize: '13px', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', transition: '0.2s' };
const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, overflowY: 'auto' };
const sidePanelHeader: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
function ChevronRight(props: any) { return <ArrowUpRight {...props} /> }
