'use client';

import { useState, useMemo } from 'react';
import {
    ArrowRightLeft, History, CheckCircle2, AlertCircle,
    ArrowRight, Search, Filter, ShieldCheck, User,
    Calendar, FileText, Info, Plus, X, ArrowUpRight,
    TrendingDown, Zap, Shield, Ban, Check, Paperclip,
    ChevronRight, Calculator, AlertTriangle, ShieldAlert,
    Clock
} from 'lucide-react';

// --- TYPES & MOCK DATA ---

type ReallocationStatus = 'PENDENTE' | 'APROVACAO_NIVEL_1' | 'APROVACAO_NIVEL_2' | 'APROVADO' | 'REJEITADO';

interface AuditLog {
    data: string;
    usuario: string;
    acao: string;
    obs?: string;
}

interface Reallocation {
    id: string;
    data: string;
    usuario: string;
    valor: number;
    status: ReallocationStatus;
    origem: { cc: string; conta: string; frente: string; produto: string; saldoAtual: number };
    destino: { cc: string; conta: string; frente: string; produto: string; saldoAtual: number };
    justificativa: string;
    anexos: string[];
    auditTrail: AuditLog[];
}

const REALLOCATION_LIST: Reallocation[] = [
    {
        id: 'REM-001',
        data: '13/02/2026',
        usuario: 'Renato Assis',
        valor: 25000.00,
        status: 'APROVACAO_NIVEL_2',
        origem: { cc: 'Vendas', conta: 'Marketing Digital', frente: 'PAIDEIA', produto: 'Cursos Online', saldoAtual: 45000 },
        destino: { cc: 'Acadêmico', conta: 'Eventos Paideia', frente: 'PAIDEIA', produto: 'Ensino Regular', saldoAtual: 8000 },
        justificativa: 'Remanejamento necessário para cobrir custos extras da conferência de educadores. Excedeu limite de R$ 20k, requer aprovação dupla.',
        anexos: ['orcamento_conferencia.pdf'],
        auditTrail: [
            { data: '13/02 09:00', usuario: 'Renato Assis', acao: 'Solicitação Criada' },
            { data: '13/02 10:30', usuario: 'Controller A', acao: 'Aprovação Nível 1 Realizada', obs: 'Valor condizente com a necessidade do projeto.' }
        ]
    },
    {
        id: 'REM-002',
        data: '12/02/2026',
        usuario: 'Maria Silva',
        valor: 4200.00,
        status: 'APROVADO',
        origem: { cc: 'Infraestrutura', conta: 'Manutenção', frente: 'BIBLOS', produto: 'Sistemas', saldoAtual: 15600 },
        destino: { cc: 'TI Central', conta: 'Softwares', frente: 'BIBLOS', produto: 'Sistemas', saldoAtual: 3000 },
        justificativa: 'Compra de licenças extras de design.',
        anexos: [],
        auditTrail: [
            { data: '12/02 14:00', usuario: 'Maria Silva', acao: 'Solicitação Criada' },
            { data: '12/02 15:30', usuario: 'Controller B', acao: 'Aprovado' }
        ]
    },
];

const BUDGET_CONTEXT = [
    { cc: 'Vendas', orcamento: 500000, realizado: 420000, remanejado: -25000, disponivel: 55000 },
    { cc: 'Acadêmico', orcamento: 1200000, realizado: 1100000, remanejado: +30000, disponivel: 130000 },
    { cc: 'Infraestrutura', orcamento: 300000, realizado: 280000, remanejado: -10000, disponivel: 10000 },
];

export default function ReallocationGovernancePage() {
    const [selectedReloc, setSelectedReloc] = useState<Reallocation | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'LOG' | 'PENDING'>('PENDING');

    const filteredList = useMemo(() => {
        if (activeTab === 'PENDING') return REALLOCATION_LIST.filter(r => r.status.includes('PENDENTE') || r.status.includes('NIVEL'));
        return REALLOCATION_LIST;
    }, [activeTab]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Remanejamento com Governança</h1>
                    <p className="text-body">Ajustes orçamentários com dupla aprovação e impacto em tempo real</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setSelectedReloc(null); setIsPanelOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Novo Remanejamento
                    </button>
                </div>
            </div>

            {/* 2. Monthly Impact Panel */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Volume Remanejado (Mes)</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>R$ 158.400</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontSize: '11px' }}>
                        <AlertTriangle size={14} /> 12 solicitações pendentes de análise
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>Impacto na Execução por Centro de Custo</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {BUDGET_CONTEXT.map(bc => (
                            <div key={bc.cc}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                                    <span style={{ fontWeight: 600 }}>{bc.cc}</span>
                                    <span style={{ color: bc.remanejado < 0 ? 'var(--danger)' : 'var(--success)' }}>
                                        {bc.remanejado > 0 ? '+' : ''}{bc.remanejado.toLocaleString()} (Ajustado)
                                    </span>
                                </div>
                                <div style={{ height: '6px', background: '#111', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                                    <div style={{ width: (bc.realizado / bc.orcamento * 100) + '%', background: 'var(--primary)' }} />
                                    <div style={{ width: (Math.abs(bc.remanejado) / bc.orcamento * 100) + '%', background: bc.remanejado < 0 ? '#331111' : '#113311' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Main Workflow View */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ borderBottom: '1px solid #1A1A1A', display: 'flex', padding: '0 24px' }}>
                    <button onClick={() => setActiveTab('PENDING')} style={{ ...tabStyle, borderBottom: activeTab === 'PENDING' ? '2px solid var(--primary)' : 'none', color: activeTab === 'PENDING' ? 'white' : 'var(--text-disabled)' }}>Solicitações Pendentes</button>
                    <button onClick={() => setActiveTab('LOG')} style={{ ...tabStyle, borderBottom: activeTab === 'LOG' ? '2px solid var(--primary)' : 'none', color: activeTab === 'LOG' ? 'white' : 'var(--text-disabled)' }}>Histórico e Auditoria</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px' }}>ID / Origem</th>
                                <th style={{ padding: '16px' }}>Destino</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                                <th style={{ padding: '16px' }}>Solicitante</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Workflow</th>
                                <th style={{ padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map(item => (
                                <tr key={item.id} onClick={() => { setSelectedReloc(item); setIsPanelOpen(true); }} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01] cursor-pointer">
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ fontWeight: 700 }}>{item.id}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.origem.cc} • {item.origem.conta}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: 600 }}>{item.destino.cc}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.destino.conta}</p>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>R$ {item.valor.toLocaleString()}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={14} color="#555" />
                                            <span>{item.usuario}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <WorkflowBadge status={item.status} double={item.valor >= 20000} />
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <ChevronRight size={18} color="#444" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Side Panel: New Request / Approval */}
            {isPanelOpen && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 className="text-h2">{selectedReloc ? 'Análise de Remanejamento' : 'Novo Remanejamento'}</h2>
                        <button onClick={() => setIsPanelOpen(false)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>

                        {/* Alert for Dual Approval */}
                        {(!selectedReloc || selectedReloc.valor >= 20000) && (
                            <div style={{ padding: '16px', background: 'rgba(41,121,255,0.05)', borderRadius: '12px', border: '1px dashed var(--secondary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <ShieldAlert size={20} color="var(--secondary)" />
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    <strong>Fluxo de Governança:</strong> Valores {'>'} R$ 20.000 exigem aprovação de dois cargos distintos (Diretoria + Controladoria).
                                </p>
                            </div>
                        )}

                        {/* Steps: Source & Destination */}
                        <div style={{ padding: '20px', background: '#0D0D0D', borderRadius: '12px', border: '1px solid #222' }}>
                            <p style={labelStyle}>Remanejar DE (Origem)</p>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <select disabled={!!selectedReloc} style={inputStyle}><option>{selectedReloc?.origem.cc || 'Centro de Custo'}</option></select>
                                <select disabled={!!selectedReloc} style={inputStyle}><option>{selectedReloc?.origem.conta || 'Conta Orçamentária'}</option></select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                <span style={{ color: 'var(--text-disabled)' }}>Saldo Atual na Origem:</span>
                                <span style={{ fontWeight: 'bold' }}>R$ {selectedReloc?.origem.saldoAtual.toLocaleString() || '0,00'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}><ArrowRightLeft size={20} color="var(--primary)" /></div>

                        <div style={{ padding: '20px', background: '#0D0D0D', borderRadius: '12px', border: '1px solid #222' }}>
                            <p style={labelStyle}>Para (Destino)</p>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <select disabled={!!selectedReloc} style={inputStyle}><option>{selectedReloc?.destino.cc || 'Centro de Custo'}</option></select>
                                <select disabled={!!selectedReloc} style={inputStyle}><option>{selectedReloc?.destino.conta || 'Conta Orçamentária'}</option></select>
                            </div>
                        </div>

                        <InputGroup label="Valor do Remanejamento" icon={<Calculator size={14} />}>
                            <input disabled={!!selectedReloc} defaultValue={selectedReloc?.valor} placeholder="R$ 0,00" style={{ ...inputStyle, fontSize: '20px', fontWeight: 'bold', border: '1px solid var(--primary)', color: 'var(--primary)' }} />
                        </InputGroup>

                        <InputGroup label="Justificativa Estratégica" icon={<FileText size={14} />}>
                            <textarea disabled={!!selectedReloc} defaultValue={selectedReloc?.justificativa} placeholder="Descreva a necessidade do ajuste..." style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                        </InputGroup>

                        <InputGroup label="Documentação de Apoio" icon={<Paperclip size={14} />}>
                            <div style={{ border: '1px dashed #333', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                                {selectedReloc?.anexos.length ? (
                                    <span style={{ color: 'var(--secondary)', fontSize: '12px' }}>{selectedReloc.anexos[0]}</span>
                                ) : (
                                    <p style={{ fontSize: '11px', color: '#555' }}>Clique para anexar evidência (PDF/PNG)</p>
                                )}
                            </div>
                        </InputGroup>

                        {/* Workflow & Audit (Selected Only) */}
                        {selectedReloc && (
                            <div style={{ marginTop: '20px' }}>
                                <p style={labelStyle}>Trilha de Governança</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedReloc.auditTrail.map((log, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11px', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px' }}>
                                            <div style={{ minWidth: '70px', color: 'var(--text-disabled)' }}>{log.data}</div>
                                            <div style={{ fontWeight: 700 }}>{log.usuario}:</div>
                                            <div style={{ color: 'var(--text-secondary)' }}>{log.acao}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            {!selectedReloc && <button className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>Enviar Solicitação</button>}
                            {selectedReloc && selectedReloc.status.includes('NIVEL') && (
                                <>
                                    <button className="btn btn-primary" style={{ flex: 1, padding: '16px' }}><Check size={18} style={{ marginRight: 8 }} /> Aprovar Remanejamento</button>
                                    <button className="btn btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', padding: '16px' }}><Ban size={18} /></button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

function WorkflowBadge({ status, double }: { status: ReallocationStatus, double: boolean }) {
    const config: any = {
        'PENDENTE': { label: 'Aguardando', color: 'var(--warning)', icon: Clock },
        'APROVACAO_NIVEL_1': { label: 'Nível 1 de 2', color: 'var(--secondary)', icon: Shield },
        'APROVACAO_NIVEL_2': { label: 'Nível 2 de 2', color: 'var(--secondary)', icon: Shield },
        'APROVADO': { label: 'Concluído', color: 'var(--success)', icon: CheckCircle2 },
        'REJEITADO': { label: 'Rejeitado', color: 'var(--danger)', icon: Ban },
    };
    const { label, color, icon: Icon } = config[status] || { label: 'Processando', color: '#666', icon: Info };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 800, background: `${color}15`, color: color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={12} /> {label}
            </span>
            {double && status !== 'APROVADO' && (
                <span style={{ fontSize: '8px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Governança Dupla</span>
            )}
        </div>
    );
}

function InputGroup({ label, icon, children }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-disabled)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}

const tabStyle = { padding: '16px 20px', fontSize: '13px', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', transition: '0.2s' };
const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '500px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column' };
