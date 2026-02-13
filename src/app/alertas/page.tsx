'use client';

import { useState } from 'react';
import {
    Bell, AlertTriangle, ShieldAlert, CheckCircle, Clock,
    Settings, Filter, Search, MoreHorizontal, Mail,
    Smartphone, Plus, X, ArrowRight, Gauge, Zap,
    TrendingDown, TrendingUp, DollarSign, Calendar
} from 'lucide-react';

const ALERTS_LIST = [
    {
        id: 'AL-001',
        titulo: 'Estouro de Verba Acadêmica',
        descricao: 'A execução do C. Custo Acadêmico atingiu 105% do previsto para Fevereiro.',
        tipo: 'ORÇAMENTO',
        severidade: 'CRÍTICA',
        status: 'NOVO',
        data: '13/02/2026',
        responsavel: 'Maria Silva'
    },
    {
        id: 'AL-002',
        titulo: 'Queda na Receita de Assinaturas',
        descricao: 'Receita realizada está 15% abaixo do projetado para a frente PAIDEIA.',
        tipo: 'RECEITA',
        severidade: 'ALTA',
        status: 'EM_ANALISE',
        data: '12/02/2026',
        responsavel: 'Renato Assis'
    },
    {
        id: 'AL-003',
        titulo: 'Vencidos Ultrapassaram Limite',
        descricao: 'O volume de recebíveis vencidos > 30 dias ultrapassou R$ 50.000,00.',
        tipo: 'INADIMPLENCIA',
        severidade: 'MÉDIA',
        status: 'NOVO',
        data: '11/02/2026',
        responsavel: 'Felipe Santos'
    },
];

const RULES_DATA = [
    { id: 1, condicao: 'Execução > 100%', acao: 'Bloquear/Alertar', status: true },
    { id: 2, condicao: 'Receita < 90%', acao: 'Notificar Controladoria', status: true },
    { id: 3, condicao: 'Vencidos > R$ 10k', acao: 'Mandar p/ Cobrança', status: true },
    { id: 4, condicao: 'Var. MoM > 20%', acao: 'Acionar Auditoria', status: false },
];

export default function AlertasPage() {
    const [activeSidePanel, setActiveSidePanel] = useState<'NEW_RULE' | 'ALERT_DETAILS' | null>(null);
    const [filterStatus, setFilterStatus] = useState('TODOS');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Quick Strategy Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Alertas de Controladoria</h1>
                    <p className="text-body">Monitoramento autônomo e motor de regras para governança financeira</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSidePanel('NEW_RULE')} className="btn btn-ghost" style={{ border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={16} /> Configurar Regras
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} /> Resolver Em Massa
                    </button>
                </div>
            </div>

            {/* 2. Rule Engine Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard label="Alertas Ativos" value="08" sub="Últimos 7 dias" color="var(--danger)" />
                <StatCard label="Em Análise" value="03" sub="Aguardando ação" color="var(--warning)" />
                <StatCard label="Taxa de Resolução" value="72%" sub="+5% vs mês ant." color="var(--success)" />
                <StatCard label="Regras Ativas" value="12" sub="Monitoramento 24h" color="var(--primary)" />
            </div>

            {/* 3. Main Alerts Dashboard */}
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Alerts List */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 className="text-h3" style={{ fontSize: '14px' }}>Fila de Ocorrências</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setFilterStatus('NOVO')} style={{ ...tagButtonStyle, background: filterStatus === 'NOVO' ? 'var(--primary)' : 'transparent' }}>Novos</button>
                            <button onClick={() => setFilterStatus('TODOS')} style={{ ...tagButtonStyle, background: filterStatus === 'TODOS' ? '#111' : 'transparent' }}>Todos</button>
                        </div>
                    </div>

                    <div style={{ padding: '8px 0' }}>
                        {ALERTS_LIST.map((alert, i) => (
                            <div key={alert.id} style={{
                                padding: '20px 24px',
                                borderBottom: i === ALERTS_LIST.length - 1 ? 'none' : '1px solid #1A1A1A',
                                display: 'flex',
                                gap: '20px',
                                transition: '0.2s',
                                cursor: 'pointer'
                            }} className="hover:bg-white/[0.02]">
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    backgroundColor: getSeverityColor(alert.severidade, true),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: getSeverityColor(alert.severidade)
                                }}>
                                    <ShieldAlert size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h4 style={{ fontWeight: 700, fontSize: '14px' }}>{alert.titulo}</h4>
                                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{alert.data}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>{alert.descricao}</p>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                                            <User size={12} /> {alert.responsavel}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                                            <Gauge size={12} /> {alert.tipo}
                                        </div>
                                        <StatusBadge status={alert.status} />
                                    </div>
                                </div>
                                <MoreHorizontal size={18} color="#444" style={{ marginTop: '4px' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rule Engine Config Preview */}
                <div className="card">
                    <h3 className="text-h3" style={{ fontSize: '14px', marginBottom: '24px' }}>Motor de Regras (If/Then)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {RULES_DATA.map(rule => (
                            <div key={rule.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Zap size={14} color={rule.status ? 'var(--primary)' : 'var(--text-disabled)'} />
                                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{rule.condicao}</span>
                                    </div>
                                    <div style={{ width: '28px', height: '14px', background: rule.status ? 'var(--primary)' : '#333', borderRadius: '10px', position: 'relative' }}>
                                        <div style={{ width: '10px', height: '10px', background: rule.status ? 'black' : '#999', borderRadius: '50%', position: 'absolute', right: rule.status ? '2px' : '16px', top: '2px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    <ArrowRight size={12} /> {rule.acao}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setActiveSidePanel('NEW_RULE')} className="btn btn-ghost" style={{ width: '100%', marginTop: '20px', border: '1px dashed #333' }}>
                        <Plus size={16} /> Nova Regra
                    </button>
                </div>

            </div>

            {/* 4. Side Panel: Configure New Rule */}
            {activeSidePanel === 'NEW_RULE' && (
                <div style={sidePanelStyle}>
                    <div style={sideHeaderStyle}>
                        <h2 className="text-h2">Configurar Motor de Regras</h2>
                        <button onClick={() => setActiveSidePanel(null)}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>Passo 1</p>
                            <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>Defina a Condição (If)</h4>
                            <select style={inputStyle}>
                                <option>Execução Orçamentária (%)</option>
                                <option>Receita vs Planejado (%)</option>
                                <option>Volume de Inadimplência (R$)</option>
                                <option>Variação Mensal contra Mês Ant. (%)</option>
                            </select>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <select style={{ ...inputStyle, flex: 0.5 }}><option>{'>'}</option><option>{'<'}</option><option>{'='}</option></select>
                                <input type="text" placeholder="Ex: 100" style={{ ...inputStyle, flex: 1 }} />
                            </div>
                        </div>

                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>Passo 2</p>
                            <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>Defina a Ação (Then)</h4>
                            <select style={inputStyle}>
                                <option>Notificar Controladoria (In-App)</option>
                                <option>Enviar E-mail de Alerta</option>
                                <option>Bloquear Novos Lançamentos</option>
                                <option>Acionar Fluxo de Cobrança</option>
                            </select>
                        </div>

                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '4px' }}>Canais</p>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked /> <Mail size={14} /> E-mail
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked /> <Bell size={14} /> App
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" /> <Smartphone size={14} /> SMS
                                </label>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ padding: '16px', marginTop: '20px' }}>Ativar Regra de Monitoramento</button>
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

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'NOVO': { bg: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' },
        'EM_ANALISE': { bg: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning)' },
        'RESOLVIDO': { bg: 'rgba(0, 230, 118, 0.1)', color: 'var(--success)' },
    };
    const s = styles[status] || { bg: '#333', color: '#999' };
    return (
        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, background: s.bg, color: s.color }}>{status}</span>
    );
}

function getSeverityColor(sev: string, bg = false) {
    if (sev === 'CRÍTICA') return bg ? 'rgba(255, 23, 68, 0.1)' : 'var(--danger)';
    if (sev === 'ALTA') return bg ? 'rgba(255, 145, 0, 0.1)' : 'var(--warning)';
    return bg ? 'rgba(41, 121, 255, 0.1)' : 'var(--secondary)';
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
const labelStyle = { fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };
const tagButtonStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', border: 'none', color: 'white', cursor: 'pointer' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', backgroundColor: '#090909', borderLeft: '1px solid #222', padding: '40px', boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000 };
const sideHeaderStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
