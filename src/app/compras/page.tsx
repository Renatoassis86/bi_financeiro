'use client';

import { useState } from 'react';
import {
    ShoppingCart, Package, Truck, Search, Plus,
    Filter, ChevronRight, X, Check, FileText,
    DollarSign, Building2, User, Clock, AlertCircle,
    Link as LinkIcon, Paperclip, Send, ArrowRight,
    ClipboardList, CheckCircle2, History, Activity,
    ShieldCheck, Eye, Layers, Zap, Sparkles
} from 'lucide-react';

// --- TYPES & MOCK DATA ---

type PurchaseStatus = 'REQUISICAO' | 'COTACAO' | 'ANALISE_TECNICA' | 'APROVACAO_GESTOR_CC' | 'APROVACAO_FINANCEIRO' | 'ORDEM_COMPRA' | 'CONCLUIDO';

interface ApprovalStep {
    role: string;
    user: string;
    status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
    date?: string;
}

interface PurchaseRequest {
    id: string;
    item: string;
    quantidade: number;
    valorEstimado: number;
    centroCusto: string;
    solicitante: string;
    status: PurchaseStatus;
    data: string;
    empenhoRef?: string;
    workflow: ApprovalStep[];
}

const INITIAL_REQUESTS: PurchaseRequest[] = [
    {
        id: 'REQ-881', item: 'Licenças Adobe CC (2026)', quantidade: 5, valorEstimado: 12500, centroCusto: 'Marketing', solicitante: 'Renato Assis', status: 'COTACAO', data: '13/02/2026',
        workflow: [
            { role: 'Solicitante', user: 'Renato Assis', status: 'APROVADO', date: '13/02 10:00' },
            { role: 'Gestor de CC', user: 'Maria Silva', status: 'PENDENTE' },
            { role: 'Financeiro', user: 'Felipe Santos', status: 'PENDENTE' }
        ]
    },
    {
        id: 'REQ-882', item: 'MacBook Pro M3 Max - Lab TI', quantidade: 2, valorEstimado: 48000, centroCusto: 'Tecnologia', solicitante: 'Carlos Eduardo', status: 'APROVACAO_GESTOR_CC', data: '12/02/2026',
        workflow: [
            { role: 'Solicitante', user: 'Carlos Eduardo', status: 'APROVADO', date: '12/02 09:00' },
            { role: 'Gestor de CC', user: 'Carlos Alberto', status: 'APROVADO', date: '12/02 14:30' },
            { role: 'Financeiro', user: 'Renato Assis', status: 'PENDENTE' }
        ]
    },
];

export default function ComprasSuprimentosPage() {
    const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS);
    const [selectedReq, setSelectedReq] = useState<PurchaseRequest | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal">

            {/* 1. Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-active)'
            }}>
                <div>
                    <h1 className="text-h1" style={{ fontSize: '3rem' }}>
                        Compras & <span style={{ color: 'var(--text-primary)' }}>Suprimentos</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Gestão de requisições com fluxo multinível e trigger de empenho automático
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => { setSelectedReq(null); setIsPanelOpen(true); }} className="btn btn-primary">
                        <Plus size={16} /> NOVA REQUISIÇÃO
                    </button>
                </div>
            </div>

            {/* 2. Workflow Stats Grid */}
            <div className="grid-stats">
                <WorkflowStat label="MINHAS APROVAÇÕES" value="03" sub="Ações em espera" icon={<ShieldCheck size={18} />} color="var(--secondary)" />
                <WorkflowStat label="AGUARDANDO TERCEIROS" value="12" sub="Tracking ativo" icon={<Clock size={18} />} color="var(--text-disabled)" />
                <WorkflowStat label="EMPENHOS GERADOS" value="08" sub="Sincronizados com BI" icon={<Zap size={18} />} color="var(--primary)" />
                <WorkflowStat label="VALOR SOB GESTÃO" value="R$ 158k" sub="Mês de Fevereiro" icon={<DollarSign size={18} />} color="var(--primary)" />
            </div>

            {/* 3. Main Request List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-h3" style={{ color: 'var(--text-primary)' }}>Requisições Pendentes</h3>
                    <div style={{ position: 'relative' }}>
                        <input placeholder="Filtrar por item ou ID..." style={inputStyle} />
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', borderBottom: '1px solid var(--border-active)' }}>
                            <th style={{ padding: '16px 32px' }}>Item do Pedido / ID</th>
                            <th style={{ padding: '16px' }}>Centro de Custo</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Valor Estimado</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>Workflow Status</th>
                            <th style={{ padding: '16px 32px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id} onClick={() => { setSelectedReq(req); setIsPanelOpen(true); }} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="hover:bg-white/[0.01] cursor-pointer">
                                <td style={{ padding: '16px 32px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'white' }}>{req.item}</p>
                                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 800 }}>{req.id}</p>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>{req.centroCusto}</p>
                                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Solicitado por {req.solicitante}</p>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: 900, color: 'var(--primary)' }}>
                                    R$ {req.valorEstimado.toLocaleString()}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                        {req.workflow.map((w, idx) => (
                                            <div key={idx} style={{ width: '10px', height: '10px', background: w.status === 'APROVADO' ? 'var(--primary)' : w.status === 'REJEITADO' ? 'var(--accent)' : '#111', border: '1px solid #222' }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '9px', marginTop: '6px', color: 'var(--text-disabled)', fontWeight: 800 }}>{req.status.replace(/_/g, ' ')}</p>
                                </td>
                                <td style={{ padding: '16px 32px', textAlign: 'right' }}>
                                    <ChevronRight size={18} color="#222" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Side Panel: Multi-Stage Approval */}
            {isPanelOpen && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
                        <div>
                            <p style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Workflow de Suprimentos</p>
                            <h2 className="text-h2" style={{ fontSize: '2rem', marginTop: '4px' }}>{selectedReq ? selectedReq.id : 'Novo Pedido'}</h2>
                        </div>
                        <button onClick={() => setIsPanelOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#333' }}><X size={24} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1, overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">

                        {/* Status Tracker */}
                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '24px' }}>Trilha de Auditoria</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {selectedReq?.workflow.map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ width: '16px', height: '16px', background: step.status === 'APROVADO' ? 'var(--primary)' : '#111', border: '1px solid #222' }} />
                                            {idx < (selectedReq?.workflow.length || 0) - 1 && <div style={{ width: '1px', height: '30px', background: '#111' }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 800, color: step.status === 'PENDENTE' ? 'var(--text-disabled)' : 'white' }}>{step.role}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{step.user} • {step.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <InputGroup label="ITEM SOLICITADO PARA COMPRA" icon={<Package size={14} />}>
                            <div style={readOnlyField}>{selectedReq?.item}</div>
                        </InputGroup>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <InputGroup label="VALOR TOTAL ESTIMADO" icon={<DollarSign size={14} />}>
                                <div style={{ ...readOnlyField, color: 'var(--primary)', fontWeight: 900, fontSize: '16px' }}>R$ {selectedReq?.valorEstimado.toLocaleString()}</div>
                            </InputGroup>
                            <InputGroup label="CENTRO DE CUSTO" icon={<Building2 size={14} />}>
                                <div style={readOnlyField}>{selectedReq?.centroCusto}</div>
                            </InputGroup>
                        </div>

                        {/* Financial Impact */}
                        <div style={{ padding: '24px', background: 'rgba(184,155,109,0.05)', border: '1px solid var(--secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Zap size={14} color="var(--secondary)" />
                                <p style={{ fontSize: '11px', fontWeight: 900, color: 'var(--secondary)', textTransform: 'uppercase' }}>Projeção de Disponibilidade</p>
                            </div>
                            <p style={{ fontSize: '12px', color: 'white', lineHeight: 1.6 }}>
                                O orçamento disponível para [<strong>{selectedReq?.centroCusto}</strong>] é de R$ 42.000. Esta operação consumirá <strong>114% do saldo disponível</strong>, requerendo remanejamento tático.
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                            {selectedReq?.status === 'APROVACAO_GESTOR_CC' ? (
                                <>
                                    <button className="btn btn-primary" style={{ padding: '20px' }}>
                                        EFETIVAR E GERAR EMPENHO
                                    </button>
                                    <button className="btn btn-ghost" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                                        REJEITAR
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-ghost" style={{ gridColumn: 'span 2', padding: '16px' }}>
                                    FECHAR DETALHES
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

function WorkflowStat({ label, value, sub, icon, color }: any) {
    return (
        <div className="card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
                <div style={{ width: '4px', height: '4px', background: color }} />
            </div>
            <p style={{ fontSize: '9px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</p>
            <h2 style={{ fontSize: '24px', fontWeight: 400, fontFamily: 'var(--font-serif)', color: 'white' }}>{value}</h2>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '6px', fontWeight: 600 }}>{sub}</p>
        </div>
    );
}

function InputGroup({ label, icon, children }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '9px', color: 'var(--text-disabled)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.1em' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle = {
    background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
    padding: '10px 12px 10px 36px', borderRadius: '2px', fontSize: '11px',
    color: 'white', outline: 'none', width: '220px'
};

const readOnlyField = {
    padding: '16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', fontSize: '14px'
};

const sidePanelStyle: any = {
    position: 'fixed', right: 0, top: 0, bottom: 0, width: '550px',
    backgroundColor: 'var(--bg-sidebar)', borderLeft: '1px solid var(--border-subtle)',
    padding: '60px', boxShadow: '-30px 0 90px rgba(0,0,0,0.9)', zIndex: 1000,
    display: 'flex', flexDirection: 'column'
};
