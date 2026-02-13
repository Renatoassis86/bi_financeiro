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
    {
        id: 'AL-003',
        titulo: 'Caixa Projetado < 0 (45 dias)',
        descricao: 'Forecast indica saldo negativo em Abril devido a concentração de pagamentos.',
        tipo: 'CAIXA',
        frente: 'CONSOLIDADO',
        centroCusto: 'Controladoria',
        severidade: 'CRÍTICA',
        status: 'PLANO_ACAO',
        data: '11/02/2026',
        responsavel: 'Felipe Santos',
        sla_horas: 8,
        sla_restante: 4,
        comentarios: 5,
        evidencias: 2,
        auditTrail: [
            { data: '11/02 10:00', usuario: 'Sistema', acao: 'Alerta gerado.' },
            { data: '11/02 11:00', usuario: 'Felipe Santos', acao: 'Reunião estratégica agendada.' },
            { data: '12/02 16:00', usuario: 'Controladoria', acao: 'Plano de remanejamento proposto.' }
        ]
    },
    {
        id: 'AL-004',
        titulo: 'Inadimplência > Limite (6%)',
        descricao: 'Volume de mensalidades atrasadas atingiu 8.5% na frente PAIDEIA.',
        tipo: 'COMERCIAL',
        frente: 'PAIDEIA',
        centroCusto: 'Financeiro',
        severidade: 'ALTA',
        status: 'NOVO',
        data: '13/02/2026',
        responsavel: 'Felipe Santos',
        sla_horas: 24,
        sla_restante: 22,
        comentarios: 1,
        evidencias: 0,
        auditTrail: [{ data: '13/02 08:00', usuario: 'Sistema', acao: 'Monitoramento de cobrança disparado.' }]
    },
    {
        id: 'AL-005',
        titulo: 'Alta Concentração de Receita',
        descricao: 'Cursos Online representam 42% do faturamento total (Limite: 40%).',
        tipo: 'BI',
        frente: 'CONSOLIDADO',
        centroCusto: 'Estratégia',
        severidade: 'MÉDIA',
        status: 'VERIFICADO',
        data: '10/02/2026',
        responsavel: 'Renato Assis',
        sla_horas: 48,
        sla_restante: 40,
        comentarios: 2,
        evidencias: 1,
        auditTrail: [{ data: '10/02 09:00', usuario: 'Sistema', acao: 'Analítico de concentração gerado.' }]
    },
];

export default function EnterpriseAlertsPage() {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<string>('TODAS');

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
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Inbox de Ocorrências</h3>
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
                        <input placeholder="Buscar alerta ou responsável..." style={{ ...inputStyle, width: '250px', paddingLeft: '36px' }} />
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    </div>
                </div>

                <div style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px' }}>Alerta / Severidade</th>
                                <th style={{ padding: '16px' }}>Status Workflow</th>
                                <th style={{ padding: '16px' }}>Responsável / Unidade</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>SLA Restante</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Interações</th>
                                <th style={{ padding: '16px', width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ALERTS_DATA.filter(a => filterSeverity === 'TODAS' || a.severidade === filterSeverity).map((alert, i) => (
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
                                    <td style={{ padding: '16px' }}>
                                        <WorkflowBadge status={alert.status} />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontSize: '13px' }}>{alert.responsavel}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Front: {alert.frente}</p>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: alert.sla_restante < 0 ? 'var(--danger)' : 'white' }}>
                                                {alert.sla_restante < 0 ? `ESTOURADO (${Math.abs(alert.sla_restante)}h)` : `${alert.sla_restante}h`}
                                            </span>
                                            <div style={{ width: '60px', height: '3px', background: '#222', borderRadius: '2px', marginTop: '4px' }}>
                                                <div style={{ width: Math.max(0, (alert.sla_restante / alert.sla_horas) * 100) + '%', height: '100%', background: alert.sla_restante < 1 ? 'var(--danger)' : 'var(--success)' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', color: 'var(--text-disabled)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                                <MessageSquare size={12} /> {alert.comentarios}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                                <Paperclip size={12} /> {alert.evidencias}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <ChevronRight size={18} color="#444" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Alert Details & Workflow Side Panel */}
            {selectedAlert && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', background: '#111', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{selectedAlert.id}</p>
                            <WorkflowBadge status={selectedAlert.status} />
                        </div>
                        <button onClick={() => setSelectedAlert(null)}><X size={20} /></button>
                    </div>

                    <h2 className="text-h2" style={{ marginBottom: '12px', fontSize: '20px' }}>{selectedAlert.titulo}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.5' }}>{selectedAlert.descricao}</p>

                    {/* Workflow Stepper */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '12px', left: '10px', right: '10px', height: '2px', background: '#222', zIndex: 0 }} />
                        {['NOVO', 'EM_ANALISE', 'PLANO_ACAO', 'RESOLVIDO'].map((s, idx) => (
                            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1, position: 'relative' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: isPast(s, selectedAlert.status) ? 'var(--primary)' : s === selectedAlert.status ? 'var(--primary)' : '#000',
                                    border: s === selectedAlert.status ? '4px solid rgba(0,230,118,0.2)' : '2px solid #222',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {isPast(s, selectedAlert.status) && <CheckCircle size={14} color="black" />}
                                </div>
                                <span style={{ fontSize: '9px', fontWeight: 700, color: s === selectedAlert.status ? 'white' : 'var(--text-disabled)' }}>{s.replace('_', ' ')}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tabs: Análise / Plano / Auditoria */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #222', marginBottom: '24px' }}>
                        <button style={{ ...tabStyle, borderBottom: '2px solid var(--primary)', color: 'white' }}>Plano de Ação</button>
                        <button style={{ ...tabStyle, opacity: 0.5 }}>Interações</button>
                        <button style={{ ...tabStyle, opacity: 0.5 }}>Histórico</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ padding: '16px', background: 'rgba(255,171,0,0.05)', borderRadius: '12px', border: '1px solid var(--warning)' }}>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertCircle size={14} /> Definição de Mitigação
                            </h4>
                            <textarea
                                placeholder="Descreva o plano de ação para resolver este alerta..."
                                className="input"
                                style={{ height: '80px', border: 'none', background: 'transparent', padding: 0, fontSize: '13px' }}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Evidências / Anexos</label>
                            <div style={{ border: '1px dashed #333', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                                <Plus size={20} color="#555" style={{ margin: '0 auto 8px' }} />
                                <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Arraste o relatório de análise ou fotos (PDF, PNG)</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <p style={labelStyle}>Trilha de Auditoria (Immutable)</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedAlert.auditTrail.map((log, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                                        <div style={{ minWidth: '70px', color: 'var(--text-disabled)' }}>{log.data}</div>
                                        <div style={{ fontWeight: 700, minWidth: '80px' }}>{log.usuario}</div>
                                        <div style={{ color: 'var(--text-secondary)' }}>{log.acao}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: '20px', padding: '16px' }}>
                            Mudar status para: RESOLVIDO
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatCard({ label, value, sub, color }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{label}</p>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0', color: color }}>{value}</h2>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{sub}</p>
        </div>
    );
}

function WorkflowBadge({ status }: { status: AlertStatus }) {
    const styles: any = {
        'NOVO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
        'EM_ANALISE': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'PLANO_ACAO': { bg: 'rgba(41, 121, 255, 0.1)', color: 'var(--secondary)' },
        'RESOLVIDO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
        'VERIFICADO': { bg: 'rgba(255, 255, 255, 0.1)', color: 'white' },
    };
    const s = styles[status] || { bg: '#333', color: '#999' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '9px', fontWeight: 800, background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color }} />
            {status.replace('_', ' ')}
        </span>
    );
}

function getSeverityColor(sev: string, bg = false) {
    if (sev === 'CRÍTICA') return bg ? 'rgba(255, 23, 68, 0.1)' : 'var(--danger)';
    if (sev === 'ALTA') return bg ? 'rgba(255, 145, 0, 0.1)' : 'var(--warning)';
    if (sev === 'MÉDIA') return bg ? 'rgba(41, 121, 255, 0.1)' : 'var(--secondary)';
    return bg ? 'rgba(255, 255, 255, 0.05)' : 'var(--text-disabled)';
}

function isPast(step: string, current: string) {
    const order = ['NOVO', 'EM_ANALISE', 'PLANO_ACAO', 'RESOLVIDO', 'VERIFICADO'];
    return order.indexOf(step) < order.indexOf(current);
}

const tagButtonStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', color: 'white', cursor: 'pointer', transition: '0.2s' };
const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', fontWeight: 'bold' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, overflowY: 'auto', display: 'flex', flexDirection: 'column' };
const tabStyle = { padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-disabled)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' };
