'use client';

import { useState } from 'react';
import {
    ShoppingCart, Package, Truck, Search, Plus,
    Filter, ChevronRight, X, Check, FileText,
    DollarSign, Building2, User, Clock, AlertCircle,
    Link as LinkIcon, Paperclip, Send, ArrowRight,
    ClipboardList, CheckCircle2, History, Activity,
    ShieldCheck, Eye, Layers, Zap
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
            { role: 'Gestor CC', user: 'Maria Silva', status: 'PENDENTE' },
            { role: 'Controladoria', user: 'Felipe Santos', status: 'PENDENTE' }
        ]
    },
    {
        id: 'REQ-882', item: 'MacBook Pro M3 - Lab TI', quantidade: 2, valorEstimado: 32000, centroCusto: 'TI', solicitante: 'Felipe Santos', status: 'APROVACAO_GESTOR_CC', data: '12/02/2026',
        workflow: [
            { role: 'Solicitante', user: 'Felipe Santos', status: 'APROVADO', date: '12/02 09:00' },
            { role: 'Gestor CC', user: 'Carlos Alberto', status: 'APROVADO', date: '12/02 14:30' },
            { role: 'Controladoria', user: 'Renato Assis', status: 'PENDENTE' }
        ]
    },
];

export default function ComprasSuprimentosPage() {
    const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS);
    const [selectedReq, setSelectedReq] = useState<PurchaseRequest | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header with Global Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Compras & Suprimentos</h1>
                    <p className="text-body">Gestão de requisições com aprovação multinível e trigger de empenho</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setSelectedReq(null); setIsPanelOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Nova Requisição
                    </button>
                </div>
            </div>

            {/* 2. Approval Queue Summary */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <WorkflowStat label="Minhas Aprovações" value="03" sub="Ações pendentes" color="var(--warning)" icon={<ShieldCheck size={18} />} />
                <WorkflowStat label="Aguardando Outros" value="12" sub="Tracking ativo" color="var(--secondary)" icon={<Clock size={18} />} />
                <WorkflowStat label="Empenhos Gerados" value="08" sub="Sync Fin. OK" color="var(--success)" icon={<Layers size={18} />} />
                <WorkflowStat label="Valor sob Gestão" value="R$ 158k" sub="Mês corrente" color="var(--primary)" icon={<DollarSign size={18} />} />
            </div>

            {/* 3. Main List with Workflow Column */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                        <input placeholder="Buscar por item ou ID..." style={{ ...inputStyle, width: '300px', paddingLeft: '32px' }} />
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '11px' }}><Filter size={14} style={{ marginRight: 8 }} /> Filtros</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '16px 24px' }}>Item / ID</th>
                                <th style={{ padding: '16px' }}>C. Custo / Solicitante</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor Est.</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Workflow Status</th>
                                <th style={{ padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id} onClick={() => { setSelectedReq(req); setIsPanelOpen(true); }} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01] cursor-pointer">
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ fontWeight: 700, fontSize: '13px' }}>{req.item}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{req.id}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: 600 }}>{req.centroCusto}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Por: {req.solicitante}</p>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>R$ {req.valorEstimado.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                            {req.workflow.map((w, idx) => (
                                                <div key={idx} title={`${w.role}: ${w.status}`} style={{ width: '12px', height: '12px', borderRadius: '50%', background: w.status === 'APROVADO' ? 'var(--success)' : w.status === 'REJEITADO' ? 'var(--danger)' : '#222', border: '1px solid #333' }} />
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '9px', marginTop: '6px', color: 'var(--text-disabled)' }}>{req.status.replace(/_/g, ' ')}</p>
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

            {/* 4. Side Panel: Multi-Stage Approval */}
            {isPanelOpen && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Detalhes do Suprimento</p>
                            <h2 className="text-h2" style={{ color: 'var(--primary)' }}>{selectedReq ? selectedReq.id : 'Novo Pedido'}</h2>
                        </div>
                        <button onClick={() => setIsPanelOpen(false)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>

                        {/* Status Tracker */}
                        <div style={{ padding: '20px', background: '#0D0D0D', borderRadius: '12px', border: '1px solid #222' }}>
                            <p style={labelStyle}>Trilha de Aprovação</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                                {selectedReq?.workflow.map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: step.status === 'APROVADO' ? 'var(--success)' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {step.status === 'APROVADO' ? <Check size={12} color="black" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#444' }} />}
                                            </div>
                                            {idx < (selectedReq?.workflow.length || 0) - 1 && <div style={{ width: '1px', height: '24px', background: '#222', margin: '4px 0' }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 700 }}>{step.role}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{step.user} • {step.status}</p>
                                            {step.date && <p style={{ fontSize: '10px', color: 'var(--primary)' }}>{step.date}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <InputGroup label="Item do Pedido" icon={<Package size={14} />}>
                            <input defaultValue={selectedReq?.item} style={inputStyle} />
                        </InputGroup>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <InputGroup label="Valor Total Est." icon={<DollarSign size={14} />}>
                                <div style={{ ...inputStyle, background: '#111', fontWeight: 800 }}>R$ {selectedReq?.valorEstimado.toLocaleString()}</div>
                            </InputGroup>
                            <InputGroup label="Centro de Custo" icon={<Building2 size={14} />}>
                                <div style={inputStyle}>{selectedReq?.centroCusto}</div>
                            </InputGroup>
                        </div>

                        {/* Financial Impact Integration */}
                        <div style={{ padding: '16px', background: 'rgba(0,230,118,0.03)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Zap size={14} color="var(--primary)" />
                                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>ESTIMATIVA DE EMPENHO</p>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                O orçamento do CC [{selectedReq?.centroCusto}] possui <strong>R$ 42.000</strong> disponível. Esta compra comprometerá <strong>29.7%</strong> do sado restante.
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', gap: '12px' }}>
                            {selectedReq?.status === 'APROVACAO_GESTOR_CC' && (
                                <>
                                    <button className="btn btn-primary" style={{ flex: 1, padding: '16px', fontWeight: 800 }}>
                                        <CheckCircle2 size={18} style={{ marginRight: 8 }} /> APROVAR (FINANCEIRO)
                                    </button>
                                    <button className="btn btn-ghost" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', padding: '16px' }}>
                                        <X size={18} />
                                    </button>
                                </>
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
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color }}>{icon}</span>
                <span style={{ fontSize: '10px', background: `${color}10`, color, padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>LIVE</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{value}</h2>
            <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{sub}</p>
        </div>
    );
}

function InputGroup({ label, icon, children }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '500px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column' };
