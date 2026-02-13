'use client';

import { useState } from 'react';
import {
    BarChart3, BookOpen, Database, Filter, Info,
    Layers, Package, Building2, Tag, Calendar,
    PieChart, TrendingUp, ChevronRight, Search,
    ShieldCheck, Calculator, Download, ExternalLink,
    Table as TableIcon, FileText, Globe
} from 'lucide-react';

// --- TYPES & CONSTANTS ---

interface MetricDefinition {
    id: string;
    nome: string;
    categoria: 'OPERACIONAL' | 'ESTRATEGICO' | 'LIQUIDEZ';
    definicao: string;
    formula: string;
    dimensoes: string[];
    responsavel: string;
}

const METRICS_GLOSSARY: MetricDefinition[] = [
    {
        id: 'M-001',
        nome: 'Geração de Caixa Operacional',
        categoria: 'LIQUIDEZ',
        definicao: 'Resultado das entradas e saídas de caixa decorrentes das atividades principais da entidade.',
        formula: '(Entradas Operacionais) - (Saídas Operacionais)',
        dimensoes: ['Período', 'Unidade (Front)', 'Produto'],
        responsavel: 'Tesouraria'
    },
    {
        id: 'M-002',
        nome: 'Margem de Contribuição',
        categoria: 'ESTRATEGICO',
        definicao: 'Quanto sobra da Receita Líquida após pagar custos e despesas variáveis.',
        formula: 'Receita Líquida - (Custos Variáveis + Despesas Variáveis)',
        dimensoes: ['Produto', 'Unidade (Front)'],
        responsavel: 'Controladoria'
    },
    {
        id: 'M-003',
        nome: 'Execução Orçamentária (%)',
        categoria: 'OPERACIONAL',
        definicao: 'Relação percentual entre o valor Realizado (Competência) e o Orçado.',
        formula: '(Valor Realizado / Valor Orçado) * 100',
        dimensoes: ['Centro de Custo', 'Conta', 'Período'],
        responsavel: 'Controladoria'
    },
    {
        id: 'M-004',
        nome: 'Burning Rate',
        categoria: 'LIQUIDEZ',
        definicao: 'Velocidade com que a entidade consome seu saldo de caixa para despesas recorrentes.',
        formula: '(Saídas Operacionais Totais) / 30 dias',
        dimensoes: ['Período'],
        responsavel: 'Diretoria Financeira'
    }
];

export default function DataMartPage() {
    const [activeTab, setActiveTab] = useState<'GLOSSARY' | 'SCHEMA' | 'EXPLORER'>('EXPLORER');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Data Mart Financeiro</h1>
                    <p className="text-body">Motor de métricas padronizadas e catálogo de dados (Single Source of Truth)</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}>
                        <Download size={16} style={{ marginRight: 8 }} /> Exportar Metadados
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={18} /> Sincronizar Data Mart
                    </button>
                </div>
            </div>

            {/* 2. Unified Metric Indicators */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <DataStat label="Entidades Mapeadas" value="1.240" sub="Fornecedores / Alunos" icon={<Globe size={16} />} />
                <DataStat label="Linhas de Fato" value="158.4k" sub="Transações Processadas" icon={<TableIcon size={16} />} />
                <DataStat label="Dimensões Ativas" value="06" sub="Date, Front, CC, Prod..." icon={<Layers size={16} />} />
                <DataStat label="Acordo de Precisão" value="99.9%" sub="Reconciliação Auditada" icon={<ShieldCheck size={16} />} />
            </div>

            {/* 3. Navigation Tabs */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #1A1A1A' }}>
                    <Tab active={activeTab === 'EXPLORER'} onClick={() => setActiveTab('EXPLORER')} label="Explorador de Dados" icon={<BarChart3 size={16} />} />
                    <Tab active={activeTab === 'GLOSSARY'} onClick={() => setActiveTab('GLOSSARY')} label="Glossário da Controladoria" icon={<BookOpen size={16} />} />
                    <Tab active={activeTab === 'SCHEMA'} onClick={() => setActiveTab('SCHEMA')} label="Schema & Metadados" icon={<Database size={16} />} />
                </div>

                {activeTab === 'EXPLORER' && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input placeholder="Filtrar métricas ou dimensões..." style={{ ...inputStyle, paddingLeft: '36px' }} />
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                            <select style={{ ...inputStyle, width: '200px' }}><option>Data (Competência)</option></select>
                            <select style={{ ...inputStyle, width: '200px' }}><option>Visão Consolidada</option></select>
                        </div>

                        {/* Data Mart Visual Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', textTransform: 'uppercase', fontSize: '10px' }}>
                                        <th style={{ padding: '16px' }}>Dimensões (Granularidade)</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Orçado (Strategic)</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Realizado (Comp)</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Caixa (Pagos)</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Compromissos</th>
                                        <th style={{ padding: '16px', textAlign: 'center' }}>Higiene de Dados</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { dim: 'PAIDEIA • Ensino Regular • Comercial', orc: 450000, real: 420000, caixa: 390000, comp: 25000 },
                                        { dim: 'BIBLOS • Sistemas • TI Central', orc: 120000, real: 115000, caixa: 115000, comp: 5000 },
                                        { dim: 'OIKOS • Aluguel Eventos • Operacional', orc: 80000, real: 92000, caixa: 45000, comp: 0 },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01]">
                                            <td style={{ padding: '16px' }}>
                                                <p style={{ fontWeight: 600 }}>{row.dim}</p>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ {row.orc.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>R$ {row.real.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--success)' }}>R$ {row.caixa.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--warning)' }}>R$ {row.comp.toLocaleString()}</td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,230,118,0.1)', color: 'var(--success)' }}>Validado</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'GLOSSARY' && (
                    <div style={{ padding: '24px' }}>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {METRICS_GLOSSARY.map(metric => (
                                <div key={metric.id} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', background: 'rgba(255,255,255,0.03)', fontSize: '10px', color: 'var(--text-disabled)' }}>{metric.id}</div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                        <Calculator size={16} color="var(--primary)" />
                                        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{metric.nome}</h3>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>{metric.definicao}</p>
                                    <div style={{ background: '#090909', padding: '12px', borderRadius: '8px', border: '1px solid #222', marginBottom: '16px' }}>
                                        <p style={{ fontSize: '10px', color: 'var(--text-disabled)', marginBottom: '4px', textTransform: 'uppercase' }}>Fórmula de Cálculo</p>
                                        <code style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{metric.formula}</code>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {metric.dimensoes.map(d => <span key={d} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: '#1A1A1A', color: 'var(--text-disabled)' }}>{d}</span>)}
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Dono: {metric.responsavel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'SCHEMA' && (
                    <div style={{ padding: '40px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Estrutura de Dimensões e Fatos</h3>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                            <SchemaCard title="Dimensões (Eixos)" items={['Date (Hierarchy)', 'Accounts (COA)', 'Cost Centers', 'Fronts (Business Unit)', 'Products', 'Entities (CRM)']} icon={<Filter size={20} />} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={32} color="#222" /></div>
                            <SchemaCard title="Fatos (Métricas)" items={['Sum(Budget)', 'Sum(Realized)', 'Sum(CashFlow)', 'Count(Transactions)', 'Avg(Ticket)', 'Sum(Commitment)']} icon={<TrendingUp size={20} />} />
                        </div>
                        <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255,171,0,0.02)', border: '1px dashed var(--warning)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Info size={24} color="var(--warning)" />
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Regra de Negócio: Reconciliação</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        O Data Mart realiza uma tarefa de "cleansing" a cada 6 horas, cruzando logs de auditoria com lançamentos contábeis para garantir que nenhuma transação seja duplicada entre os fatos de "Caixa" e "Competência".
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

function DataStat({ label, value, sub, icon }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ color: 'var(--primary)' }}>{icon}</div>
                <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{label}</p>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{value}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{sub}</p>
        </div>
    );
}

function Tab({ active, onClick, label, icon }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px',
                fontSize: '13px', fontWeight: 700, background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid var(--primary)' : 'none',
                color: active ? 'white' : 'var(--text-disabled)',
                transition: '0.2s', cursor: 'pointer'
            }}
        >
            {icon} {label}
        </button>
    );
}

function SchemaCard({ title, items, icon }: any) {
    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                {icon} <h4 style={{ fontWeight: 700 }}>{title}</h4>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((it: string) => (
                    <li key={it} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} /> {it}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const inputStyle = { background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
