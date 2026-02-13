'use client';

import { useState } from 'react';
import {
    Bell, AlertTriangle, ShieldAlert, CheckCircle, Clock,
    Settings, Filter, Search, MoreHorizontal, Mail,
    Smartphone, Plus, X, ArrowRight, Gauge, Zap,
    TrendingDown, TrendingUp, DollarSign, Calendar,
    User, MessageSquare, Paperclip, History,
    ChevronRight, AlertCircle, FileText
} from 'lucide-react';

// --- ENTERPRISE ALERT TYPES ---

type AlertStatus = 'NOVO' | 'EM_ANALISE' | 'PLANO_ACAO' | 'RESOLVIDO' | 'VERIFICADO';
type Severity = 'BAIXA' | 'MÉDIA' | 'ALTA' | 'CRÍTICA';

interface AuditLog {
    data: string;
    usuario: string;
    acao: string;
}

interface Alert {
    id: string;
    titulo: string;
    descricao: string;
    tipo: string;
    frente: string;
    centroCusto: string;
    severidade: Severity;
    status: AlertStatus;
    data: string;
    responsavel: string;
    sla_horas: number;
    sla_restante: number;
    comentarios: number;
    evidencias: number;
    auditTrail: AuditLog[];
}

const ALERTS_DATA: Alert[] = [
    {
        id: 'AL-001',
        titulo: 'Execução de Despesas > 100%',
        descricao: 'O Centro de Custo [Pedagógico] atingiu 112% do orçamento mensal.',
        tipo: 'ORÇAMENTO',
        frente: 'PAIDEIA',
        centroCusto: 'Pedagógico',
        severidade: 'CRÍTICA',
        status: 'NOVO',
        data: '13/02/2026',
        responsavel: 'Maria Silva',
        sla_horas: 4,
        sla_restante: 2.5,
        comentarios: 0,
        evidencias: 0,
        auditTrail: [{ data: '13/02 11:20', usuario: 'Sistema', acao: 'Alerta gerado por motor de regras.' }]
    },
    {
        id: 'AL-002',
        titulo: 'Receita < 85% do Previsto',
        descricao: 'Frente [BIBLOS] performando abaixo da meta crítica de faturamento.',
        tipo: 'RECEITA',
        frente: 'BIBLOS',
        centroCusto: 'Comercial',
        severidade: 'ALTA',
        status: 'EM_ANALISE',
        data: '12/02/2026',
        responsavel: 'Renato Assis',
        sla_horas: 12,
        sla_restante: -3, // SLA estourado
        comentarios: 3,
        evidencias: 1,
        auditTrail: [
            { data: '12/02 09:00', usuario: 'Sistema', acao: 'Alerta gerado.' },
            { data: '12/02 14:30', usuario: 'Renato Assis', acao: 'Iniciada análise de churn.' }
        ]
    },
    // ... rest of ALERTS_DATA
];

export default function EnterpriseAlertsPage() {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<string>('TODAS');
    const [currentView, setCurrentView] = useState<'INBOX' | 'RULES'>('INBOX');

    const ALERT_RULES = [
        { id: 'R-001', nome: 'Monitor de Estouro Orçamentário', criterio: 'Realizado > Orçado * 1.15', severidade: 'CRÍTICA', status: 'ATIVO', canal: ['Push', 'Email'] },
        { id: 'R-002', nome: 'Deteção de Inadimplência', criterio: 'Atraso > 5 dias && Valor > R$ 500', severidade: 'ALTA', status: 'ATIVO', canal: ['Sms'] },
        { id: 'R-003', nome: 'Queda de Receita Corrente', criterio: 'Mensal < Média(3m) * 0.8', severidade: 'ALTA', status: 'PAUSADA', canal: ['Slack'] },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Strategy Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Workflow de Controladoria</h1>
                    <p className="text-body">Gestão de ocorrências, SLA e auditoria de decisões financeiras</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}>
                        <History size={16} /> Auditoria Geral
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} /> Configurar Notificações
                    </button>
                </div>
            </div>

            {/* 2. SLA & Workload Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard label="Alertas Críticos" value="02" sub="Atenção Imediata" color="var(--danger)" />
                <StatCard label="SLA Estourado" value="01" sub="Atraso na resposta" color="var(--warning)" />
                <StatCard label="Em Plano de Ação" value="04" sub="Em execução" color="var(--secondary)" />
                <StatCard label="Tempo Médio Res." value="6.2h" sub="-12% vs semana ant." color="var(--success)" />
            </div>

            {/* 3. Workflow Dashboard */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ borderBottom: '1px solid #1A1A1A', display: 'flex', padding: '0 24px' }}>
                    <button
                        onClick={() => setCurrentView('INBOX')}
                        style={{ ...tabStyle, borderBottom: currentView === 'INBOX' ? '2px solid var(--primary)' : 'none', color: currentView === 'INBOX' ? 'white' : 'var(--text-disabled)' }}
                    >
                        Inbox de Ocorrências
                    </button>
                    <button
                        onClick={() => setCurrentView('RULES')}
                        style={{ ...tabStyle, borderBottom: currentView === 'RULES' ? '2px solid var(--primary)' : 'none', color: currentView === 'RULES' ? 'white' : 'var(--text-disabled)' }}
                    >
                        Configuração de Regras
                    </button>
                </div>

                {currentView === 'INBOX' ? (
                    <>
                        <div style={{ padding: '24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['TODAS', 'CRÍTICA', 'ALTA', 'MÉDIA'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFilterSeverity(s)}
                                            style={{ ...tagButtonStyle, background: filterSeverity === s ? '#222' : 'transparent', border: filterSeverity === s ? '1px solid var(--primary)' : '1px solid #222' }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="Buscar alerta ou responsável..." style={{ ...inputStyle, width: '250px', paddingLeft: '32px' }} />
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                        <th style={{ padding: '16px 24px' }}>Alerta / Severidade</th>
                                        <th style={{ padding: '16px' }}>Status Workflow</th>
                                        <th style={{ padding: '16px' }}>Responsável / Unidade</th>
                                        <th style={{ padding: '16px', textAlign: 'center' }}>SLA Restante</th>
                                        <th style={{ padding: '16px', textAlign: 'center' }}>Interações</th>
                                        <th style={{ padding: '16px 24px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ALERTS_DATA.filter(a => filterSeverity === 'TODAS' || a.severidade === filterSeverity).map((alert) => (
                                        <tr key={alert.id} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01] cursor-pointer" onClick={() => setSelectedAlert(alert)}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        backgroundColor: getSeverityColor(alert.severidade, true),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: getSeverityColor(alert.severidade)
                                                    }}>
                                                        <ShieldAlert size={16} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 700, fontSize: '13px' }}>{alert.titulo}</p>
                                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{alert.id} • {alert.tipo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}><WorkflowBadge status={alert.status} /></td>
                                            <td style={{ padding: '16px' }}>
                                                <p style={{ fontSize: '13px' }}>{alert.responsavel}</p>
                                                <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Front: {alert.frente}</p>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{alert.sla_restante}h</span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>{alert.comentarios}</td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}><ChevronRight size={18} color="#444" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Motor de Regras Automáticas</p>
                            <button className="btn btn-primary"><Plus size={14} style={{ marginRight: 8 }} /> Nova Regra</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 24px' }}>Regra</th>
                                    <th style={{ padding: '16px' }}>Critério</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ALERT_RULES.map(rule => (
                                    <tr key={rule.id} style={{ borderBottom: '1px solid #1A1A1A' }}>
                                        <td style={{ padding: '16px 24px' }}>{rule.nome}</td>
                                        <td style={{ padding: '16px' }}>{rule.criterio}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>{rule.status}</td>
                                        <td style={{ padding: '16px 24px' }}><MoreHorizontal size={18} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* side panel placeholder */}
            {selectedAlert && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <h3>{selectedAlert.id}</h3>
                        <button onClick={() => setSelectedAlert(null)}><X size={20} /></button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatCard({ label, value, sub, color }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{label}</p>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</h2>
            <p style={{ fontSize: '10px' }}>{sub}</p>
        </div>
    );
}

function WorkflowBadge({ status }: { status: AlertStatus }) {
    return <span style={{ fontSize: '9px', fontWeight: 800 }}>{status}</span>;
}

function getSeverityColor(sev: string, bg = false) {
    if (sev === 'CRÍTICA') return bg ? 'rgba(255, 23, 68, 0.1)' : 'var(--danger)';
    return bg ? '#111' : '#888';
}

const tagButtonStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', color: 'white', cursor: 'pointer' };
const inputStyle = { background: '#0D0D0D', border: '1px solid #222', padding: '10px', borderRadius: '8px', color: 'white', fontSize: '13px' };
const tabStyle = { padding: '16px 24px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '400px', background: '#000', borderLeft: '1px solid #1A1A1A', padding: '40px', zIndex: 1000 };
