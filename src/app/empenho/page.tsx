'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, Download, FileCheck, ShieldAlert, History,
    TrendingDown, PieChart, Info, X, Check, ArrowRight, User,
    Clock, FileText, Building2, Package, Tag, AlertCircle, Ban,
    CheckCircle2, Send, DollarSign, Calendar
} from 'lucide-react';

// --- TYPES & CONSTANTS ---

type EmpenhoStatus = 'RASCUNHO' | 'SUBMETIDO' | 'APROVADO' | 'EXECUTADO' | 'CANCELADO';

interface AuditLog {
    data: string;
    usuario: string;
    acao: string;
}

interface Empenho {
    id: string;
    titulo: string;
    valor: number;
    conta: string;
    centroCusto: string;
    frente: string;
    produto: string;
    competencia: string;
    fornecedor: string;
    justificativa: string;
    status: EmpenhoStatus;
    criadoEm: string;
    criadoPor: string;
    auditTrail: AuditLog[];
}

const INITIAL_EMPENHOS: Empenho[] = [
    {
        id: 'EMP-001',
        titulo: 'Serviços de Marketing Digital - Q1',
        valor: 45000.00,
        conta: 'Marketing / Publicidade',
        centroCusto: 'Vendas',
        frente: 'PAIDEIA',
        produto: 'Cursos Online',
        competencia: '03/2026',
        fornecedor: 'Agência Digital XYZ',
        justificativa: 'Reserva para campanhas de lançamento do semestre letivo.',
        status: 'APROVADO',
        criadoEm: '10/02/2026',
        criadoPor: 'Renato Assis',
        auditTrail: [
            { data: '10/02 09:00', usuario: 'Renato Assis', acao: 'Criado rascunho.' },
            { data: '10/02 14:00', usuario: 'Renato Assis', acao: 'Submetido para aprovação.' },
            { data: '11/02 10:30', usuario: 'Controladoria', acao: 'Aprovado (Reserva Orçamentária Confirmada).' }
        ]
    },
    {
        id: 'EMP-002',
        titulo: 'Material Didático Escolar 2026',
        valor: 120000.00,
        conta: 'Material Pedagógico',
        centroCusto: 'Acadêmico',
        frente: 'PAIDEIA',
        produto: 'Ensino Regular',
        competencia: '02/2026',
        fornecedor: 'Editora Nacional',
        justificativa: 'Aquisição de livros e materiais para o ano letivo.',
        status: 'EXECUTADO',
        criadoEm: '05/02/2026',
        criadoPor: 'Maria Silva',
        auditTrail: [
            { data: '05/02 08:00', usuario: 'Maria Silva', acao: 'Criado rascunho.' },
            { data: '05/02 10:00', usuario: 'Controladoria', acao: 'Aprovado.' },
            { data: '12/02 16:00', usuario: 'Financeiro', acao: 'Executado (Pagamento Realizado).' }
        ]
    },
    {
        id: 'EMP-003',
        titulo: 'Upgrade Infra AWS - Produção',
        valor: 15600.00,
        conta: 'Tecnologia / Cloud',
        centroCusto: 'TI',
        frente: 'BIBLOS',
        produto: 'Plataforma Digital',
        competencia: '04/2026',
        fornecedor: 'Amazon Web Services',
        justificativa: 'Necessário para suportar aumento de tráfego projetado.',
        status: 'SUBMETIDO',
        criadoEm: '12/02/2026',
        criadoPor: 'Felipe Santos',
        auditTrail: [
            { data: '12/02 11:00', usuario: 'Felipe Santos', acao: 'Submetido para aprovação.' }
        ]
    }
];

export default function EmpenhoPage() {
    const [empenhos, setEmpenhos] = useState<Empenho[]>(INITIAL_EMPENHOS);
    const [selectedEmpenho, setSelectedEmpenho] = useState<Empenho | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // --- HELPER LOGIC ---

    const budgetMetrics = {
        disponivel: 750000,
        comprometido: empenhos.filter(e => e.status === 'APROVADO' || e.status === 'SUBMETIDO').reduce((acc, curr) => acc + curr.valor, 0),
        realizado: empenhos.filter(e => e.status === 'EXECUTADO').reduce((acc, curr) => acc + curr.valor, 0)
    };

    const handleStatusChange = (id: string, newStatus: EmpenhoStatus) => {
        setEmpenhos(prev => prev.map(e => {
            if (e.id === id) {
                const log: AuditLog = {
                    data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    usuario: 'Controladoria',
                    acao: `Status alterado para ${newStatus}.`
                };
                return { ...e, status: newStatus, auditTrail: [...e.auditTrail, log] };
            }
            return e;
        }));
        // Proactively update selected view
        if (selectedEmpenho?.id === id) {
            setSelectedEmpenho({ ...selectedEmpenho, status: newStatus });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Empenho & Reserva Orçamentária</h1>
                    <p className="text-body">Bloqueio formal de verba para compromissos futuros</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setSelectedEmpenho(null); setIsPanelOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Novo Empenho
                    </button>
                </div>
            </div>

            {/* 2. Budget Impact Bar */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-end' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Governança de Dotação</p>
                        <h3 className="text-h3" style={{ fontSize: '16px' }}>Saúde Orçamentária Paideia / Consolidado</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', textAlign: 'right' }}>
                        <div><p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Disponível</p><p style={{ fontWeight: 'bold' }}>R$ {budgetMetrics.disponivel.toLocaleString()}</p></div>
                        <div><p style={{ fontSize: '10px', color: 'var(--warning)' }}>Comprometido (Empenho)</p><p style={{ fontWeight: 'bold', color: 'var(--warning)' }}>R$ {budgetMetrics.comprometido.toLocaleString()}</p></div>
                        <div><p style={{ fontSize: '10px', color: 'var(--success)' }}>Realizado (Pago)</p><p style={{ fontWeight: 'bold', color: 'var(--success)' }}>R$ {budgetMetrics.realizado.toLocaleString()}</p></div>
                    </div>
                </div>
                <div style={{ height: '12px', background: '#111', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: '40%', height: '100%', background: 'var(--success)', opacity: 0.8 }} />
                    <div style={{ width: `${(budgetMetrics.comprometido / (budgetMetrics.disponivel + budgetMetrics.comprometido + budgetMetrics.realizado)) * 100}%`, height: '100%', background: 'var(--warning)', opacity: 0.6 }} />
                </div>
            </div>

            {/* 3. Main List */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '11px' }}>Todos</button>
                        <button className="btn btn-ghost" style={{ border: '1px solid #222', fontSize: '11px', color: 'var(--warning)' }}>Pendentes</button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input placeholder="Filtrar por fornecedor ou título..." style={{ ...inputStyle, width: '300px', paddingLeft: '32px' }} />
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px' }}>Cód / Título</th>
                                <th style={{ padding: '16px' }}>Centro de Custo</th>
                                <th style={{ padding: '16px' }}>Fornecedor</th>
                                <th style={{ padding: '16px' }}>Competência</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor Empenhado</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {empenhos.map(emp => (
                                <tr key={emp.id} onClick={() => { setSelectedEmpenho(emp); setIsPanelOpen(true); }} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01] cursor-pointer">
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ fontWeight: 700 }}>{emp.titulo}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{emp.id}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p>{emp.centroCusto}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Front: {emp.frente}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>{emp.fornecedor}</td>
                                    <td style={{ padding: '16px' }}>{emp.competencia}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>R$ {emp.valor.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <StatusBadge status={emp.status} />
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

            {/* 4. Side Panel Details & Workflow */}
            {isPanelOpen && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 className="text-h2">{selectedEmpenho ? 'Detalhes do Empenho' : 'Novo Empenho (Reserva)'} </h2>
                        <button onClick={() => setIsPanelOpen(false)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>

                        {/* Status Stepper (if selected) */}
                        {selectedEmpenho && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222', marginBottom: '8px' }}>
                                <Step status={selectedEmpenho.status} step="RASCUNHO" label="Criação" />
                                <ArrowRight size={12} color="#333" style={{ marginTop: 6 }} />
                                <Step status={selectedEmpenho.status} step="SUBMETIDO" label="Análise" />
                                <ArrowRight size={12} color="#333" style={{ marginTop: 6 }} />
                                <Step status={selectedEmpenho.status} step="APROVADO" label="Reserva" />
                                <ArrowRight size={12} color="#333" style={{ marginTop: 6 }} />
                                <Step status={selectedEmpenho.status} step="EXECUTADO" label="Pago" />
                            </div>
                        )}

                        {/* Form / Details */}
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <InputGroup label="Título do Empenho" icon={<FileText size={14} />}>
                                <input disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} defaultValue={selectedEmpenho?.titulo} placeholder="Ex: Upgrade Servidores Q2" style={inputStyle} />
                            </InputGroup>
                            <InputGroup label="Valor da Reserva" icon={<DollarSign size={14} />}>
                                <input disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} defaultValue={selectedEmpenho?.valor} placeholder="R$ 0,00" style={{ ...inputStyle, fontWeight: 'bold', color: 'var(--primary)' }} />
                            </InputGroup>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <InputGroup label="Centro de Custo" icon={<Building2 size={14} />}>
                                <select disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} style={inputStyle}>
                                    <option>{selectedEmpenho?.centroCusto || 'Selecione...'}</option>
                                </select>
                            </InputGroup>
                            <InputGroup label="Unidade (Front)" icon={<Tag size={14} />}>
                                <select disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} style={inputStyle}>
                                    <option>{selectedEmpenho?.frente || 'PAIDEIA'}</option>
                                </select>
                            </InputGroup>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                            <InputGroup label="Fornecedor / Favorecido" icon={<User size={14} />}>
                                <input disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} defaultValue={selectedEmpenho?.fornecedor} placeholder="Nome do Fornecedor" style={inputStyle} />
                            </InputGroup>
                            <InputGroup label="Comp. Prevista" icon={<Calendar size={14} />}>
                                <input disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} defaultValue={selectedEmpenho?.competencia} placeholder="MM/AAAA" style={inputStyle} />
                            </InputGroup>
                        </div>

                        <InputGroup label="Justificativa Orçamentária" icon={<Info size={14} />}>
                            <textarea disabled={!!selectedEmpenho && selectedEmpenho.status !== 'RASCUNHO'} defaultValue={selectedEmpenho?.justificativa} placeholder="Por que este empenho é necessário?" style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                        </InputGroup>

                        {/* Audit Trail */}
                        {selectedEmpenho && (
                            <div style={{ marginTop: '20px' }}>
                                <p style={labelStyle}>Trilha de Auditoria (Governança)</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedEmpenho.auditTrail.map((log, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11px', background: 'rgba(255,255,255,0.01)', padding: '8px', borderRadius: '4px' }}>
                                            <div style={{ minWidth: '70px', color: 'var(--text-disabled)' }}><Clock size={10} style={{ display: 'inline', marginRight: 4 }} />{log.data}</div>
                                            <div style={{ fontWeight: 700 }}>{log.usuario}:</div>
                                            <div style={{ color: 'var(--text-secondary)' }}>{log.acao}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Workflow Actions */}
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            {!selectedEmpenho && (
                                <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }}><Send size={18} style={{ marginRight: 8 }} /> Criar e Submeter</button>
                            )}
                            {selectedEmpenho?.status === 'SUBMETIDO' && (
                                <>
                                    <button onClick={() => handleStatusChange(selectedEmpenho.id, 'APROVADO')} className="btn btn-primary" style={{ flex: 1, padding: '14px' }}><CheckCircle2 size={18} style={{ marginRight: 8 }} /> Aprovar Reserva</button>
                                    <button onClick={() => handleStatusChange(selectedEmpenho.id, 'CANCELADO')} className="btn btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', padding: '14px' }}><Ban size={18} /></button>
                                </>
                            )}
                            {selectedEmpenho?.status === 'APROVADO' && (
                                <>
                                    <button onClick={() => handleStatusChange(selectedEmpenho.id, 'EXECUTADO')} className="btn btn-primary" style={{ flex: 1, padding: '14px', background: 'var(--success)', color: 'black' }}><Check size={18} style={{ marginRight: 8 }} /> Marcar como Executado</button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

function StatusBadge({ status }: { status: EmpenhoStatus }) {
    const styles: any = {
        'RASCUNHO': { bg: 'rgba(255,255,255,0.05)', color: '#666' },
        'SUBMETIDO': { bg: 'rgba(255,171,0,0.1)', color: 'var(--warning)' },
        'APROVADO': { bg: 'rgba(41,121,255,0.1)', color: 'var(--secondary)' },
        'EXECUTADO': { bg: 'rgba(0,230,118,0.1)', color: 'var(--success)' },
        'CANCELADO': { bg: 'rgba(255,23,68,0.1)', color: 'var(--danger)' },
    };
    const s = styles[status] || { bg: '#222', color: '#999' };
    return (
        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, background: s.bg, color: s.color }}>{status}</span>
    );
}

function Step({ status, step, label }: { status: EmpenhoStatus, step: string, label: string }) {
    const order = ['RASCUNHO', 'SUBMETIDO', 'APROVADO', 'EXECUTADO'];
    const isActive = status === step;
    const isCompleted = order.indexOf(status) > order.indexOf(step);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: isCompleted ? 'var(--primary)' : isActive ? 'var(--primary)' : 'transparent',
                border: '2px solid' + (isActive || isCompleted ? 'var(--primary)' : '#333'),
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {isCompleted && <Check size={12} color="black" />}
            </div>
            <span style={{ fontSize: '9px', color: isActive ? 'white' : 'var(--text-disabled)', fontWeight: 700 }}>{label}</span>
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

function ChevronRight(props: any) { return <ArrowRight {...props} /> }

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '12px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '520px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column' };
