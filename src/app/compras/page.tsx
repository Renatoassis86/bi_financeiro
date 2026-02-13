'use client';

import { useState } from 'react';
import {
    ShoppingCart, Package, Truck, Search, Plus,
    Filter, ChevronRight, X, Check, FileText,
    DollarSign, Building2, User, Clock, AlertCircle,
    Link as LinkIcon, Paperclip, Send, ArrowRight,
    ClipboardList, CheckCircle2, History, Activity
} from 'lucide-react';

// --- TYPES & MOCK DATA ---

type PurchaseStatus = 'REQUISICAO' | 'COTACAO' | 'APROVACAO' | 'ORDEM_COMPRA' | 'CONCLUIDO';

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
}

const INITIAL_REQUESTS: PurchaseRequest[] = [
    { id: 'REQ-881', item: 'Licenças Adobe CC (2026)', quantidade: 5, valorEstimado: 12500, centroCusto: 'Marketing', solicitante: 'Renato Assis', status: 'COTACAO', data: '13/02/2026' },
    { id: 'REQ-882', item: 'MacBook Pro M3 - Lab TI', quantidade: 2, valorEstimado: 32000, centroCusto: 'TI', solicitante: 'Felipe Santos', status: 'APROVACAO', data: '12/02/2026' },
    { id: 'REQ-883', item: 'Reformas Cadeiras Auditório', quantidade: 50, valorEstimado: 15000, centroCusto: 'Infra', solicitante: 'Maria Silva', status: 'REQUISICAO', data: '13/02/2026' },
];

export default function ComprasSuprimentosPage() {
    const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS);
    const [selectedReq, setSelectedReq] = useState<PurchaseRequest | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Compras & Suprimentos</h1>
                    <p className="text-body">Gestão de requisições integrada ao Fluxo de Empenho</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setSelectedReq(null); setIsPanelOpen(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Nova Requisição
                    </button>
                </div>
            </div>

            {/* 2. Process Stepper Overview */}
            <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <ProcessStep icon={<ClipboardList size={20} />} label="Requisição" count={12} active />
                    <ProcessStep icon={<ShoppingCart size={20} />} label="Cotação" count={5} />
                    <ProcessStep icon={<CheckCircle2 size={20} />} label="Aprovação" count={3} />
                    <ProcessStep icon={<Truck size={20} />} label="Ordem Compra" count={8} />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Volume em Aberto</p>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>R$ 158.400,00</h3>
                </div>
            </div>

            {/* 3. Main List */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                        <input placeholder="Buscar por item ou ID..." style={{ ...inputStyle, width: '300px', paddingLeft: '32px' }} />
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '11px' }}><Filter size={14} style={{ marginRight: 8 }} /> Filtros</button>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', fontSize: '11px' }}><History size={14} style={{ marginRight: 8 }} /> Histórico</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '16px 24px' }}>ID / Item</th>
                                <th style={{ padding: '16px' }}>C. Custo</th>
                                <th style={{ padding: '16px' }}>Solicitante</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor Estimado</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id} onClick={() => { setSelectedReq(req); setIsPanelOpen(true); }} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01] cursor-pointer">
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ fontWeight: 700 }}>{req.item}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{req.id}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>{req.centroCusto}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#222', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{req.solicitante[0]}</div>
                                            {req.solicitante}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>R$ {req.valorEstimado.toLocaleString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <PurchaseBadge status={req.status} />
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

            {/* 4. Side Panel: Request Detail & Empenho Trigger */}
            {isPanelOpen && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 className="text-h2">{selectedReq ? 'Análise de Suprimento' : 'Nova Requisição'}</h2>
                        <button onClick={() => setIsPanelOpen(false)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>

                        {/* Integration Alert */}
                        <div style={{ padding: '16px', background: 'rgba(41,121,255,0.05)', borderRadius: '12px', border: '1px dashed var(--secondary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <LinkIcon size={20} color="var(--secondary)" />
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <strong>Fluxo Integrado:</strong> Ao aprovar esta compra, o sistema reservará automaticamente o orçamento criando um <strong>Empenho</strong>.
                            </p>
                        </div>

                        <InputGroup label="Item / Descrição do Pedido" icon={<Package size={14} />}>
                            <input defaultValue={selectedReq?.item} placeholder="Ex: Mobiliário para o novo laboratório" style={inputStyle} />
                        </InputGroup>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <InputGroup label="Qtd / Unidade" icon={<Activity size={14} />}>
                                <input defaultValue={selectedReq?.quantidade} placeholder="0" style={inputStyle} />
                            </InputGroup>
                            <InputGroup label="Valor Unit. Estimado" icon={<DollarSign size={14} />}>
                                <input defaultValue={selectedReq?.valorEstimado} placeholder="R$ 0,00" style={inputStyle} />
                            </InputGroup>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <InputGroup label="Centro de Custo" icon={<Building2 size={14} />}>
                                <select style={inputStyle}><option>{selectedReq?.centroCusto || 'Selecione...'}</option></select>
                            </InputGroup>
                            <InputGroup label="Compromisso Previsto" icon={<Clock size={14} />}>
                                <input type="month" style={inputStyle} />
                            </InputGroup>
                        </div>

                        <InputGroup label="Justificativa da Necessidade" icon={<FileText size={14} />}>
                            <textarea placeholder="Por que esta compra é essencial agora?" style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                        </InputGroup>

                        {/* Quotations UI (Simplified) */}
                        <div style={{ marginTop: '20px' }}>
                            <p style={labelStyle}>Cotações de Fornecedores</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <QuotationRow supplier="Excelência Suprimentos" value={12500} status="VENCEDORA" />
                                <QuotationRow supplier="Global Office Tech" value={13200} status="REJEITADA" />
                                <button className="btn btn-ghost" style={{ border: '1px dashed #333', fontSize: '11px' }}><Plus size={12} style={{ marginRight: 8 }} /> Adicionar Cotação</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            {!selectedReq && (
                                <button className="btn btn-primary" style={{ flex: 1, padding: '16px' }}><Send size={18} style={{ marginRight: 8 }} /> Enviar Requisição</button>
                            )}
                            {selectedReq && selectedReq.status === 'APROVACAO' && (
                                <>
                                    <button className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>
                                        <CheckCircle2 size={18} style={{ marginRight: 8 }} /> Aprovar e Gerar Empenho
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

function ProcessStep({ icon, label, count, active }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: active ? 1 : 0.4 }}>
            <div style={{ color: active ? 'var(--primary)' : 'white' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{count}</p>
            </div>
        </div>
    );
}

function PurchaseBadge({ status }: { status: PurchaseStatus }) {
    const config: any = {
        'REQUISICAO': { label: 'Requisição', color: '#888' },
        'COTACAO': { label: 'Cotação', color: 'var(--warning)' },
        'APROVACAO': { label: 'Aprovação', color: 'var(--secondary)' },
        'ORDEM_COMPRA': { label: 'Ordem Compra', color: 'var(--success)' },
        'CONCLUIDO': { label: 'Recebido', color: 'var(--primary)' },
    };
    const s = config[status] || config.REQUISICAO;
    return (
        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, background: `${s.color}15`, color: s.color }}>{s.label}</span>
    );
}

function QuotationRow({ supplier, value, status }: any) {
    return (
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid #1A1A1A', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{supplier}</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>R$ {value.toLocaleString()}</p>
            </div>
            <span style={{ fontSize: '9px', color: status === 'VENCEDORA' ? 'var(--success)' : '#555', fontWeight: 700 }}>{status}</span>
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
