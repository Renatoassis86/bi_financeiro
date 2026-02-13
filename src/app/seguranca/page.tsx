'use client';

import { useState, useMemo } from 'react';
import {
    Shield, Users, Lock, Key, Eye, EyeOff,
    History, UserPlus, Search, Filter, ShieldCheck,
    ShieldAlert, UserCheck, Trash2, Edit2,
    ArrowRight, ShieldX, Database, Activity,
    ChevronRight, MoreHorizontal, User, Download
} from 'lucide-react';
import { useGlobalFilters, UserRole } from '@/contexts/GlobalFilterContext';

// --- MOCK DATA ---

const PERMISSOES_LIST = [
    { id: 'u-001', nome: 'Renato Assis', role: 'ADMIN', lastAccess: '10 min atrás', status: 'ATIVO' },
    { id: 'u-002', nome: 'Maria Silva', role: 'CONTROLADORIA', lastAccess: '1 hora atrás', status: 'ATIVO' },
    { id: 'u-003', nome: 'Felipe Santos', role: 'GESTOR_FRENTE', front: 'PAIDEIA', lastAccess: '2 dias atrás', status: 'ATIVO' },
    { id: 'u-004', nome: 'Joana Darc', role: 'GESTOR_CC', cc: ['Marketing', 'Vendas'], lastAccess: '15 min atrás', status: 'ATIVO' },
    { id: 'u-005', nome: 'Carlos Eduardo', role: 'LEITOR', lastAccess: '5 dias atrás', status: 'INATIVO' },
];

const AUDIT_LOGS = [
    { id: 1, data: '13/02 11:20', usuario: 'Maria Silva', acao: 'Aprovação de Remanejamento', recurso: 'RE-012', ip: '192.168.1.45' },
    { id: 2, data: '13/02 10:45', usuario: 'Renato Assis', acao: 'Configuração de Motor de Alerta', recurso: 'Alertas', ip: '192.168.1.10' },
    { id: 3, data: '13/02 09:15', usuario: 'Felipe Santos', acao: 'Acesso Negado (Tentativa de ver Oikos)', recurso: 'DRE Oikos', ip: '10.0.0.12' },
];

export default function SecurityRBACPage() {
    const { user: currentUser, setUser: setCurrentUser } = useGlobalFilters();
    const [activeTab, setActiveTab] = useState<'USERS' | 'LOGS' | 'ROLES'>('USERS');
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);

    const simulateRole = (role: UserRole, nome: string, front?: string) => {
        setCurrentUser({
            id: 'simulated',
            nome,
            role,
            frontRestrito: front
        });
        alert(`Simulando Perfil: ${role} (${nome})`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Segurança & Governança (RBAC)</h1>
                    <p className="text-body">Controle de acesso baseado em perfis e trilha de auditoria completa</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid #333' }}>
                        <Activity size={16} /> Ver Atividades em Tempo Real
                    </button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={18} /> Adicionar Usuário
                    </button>
                </div>
            </div>

            {/* 2. Security Overview Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <SecurityStat label="Usuários Ativos" value="24" icon={<Users size={16} />} color="var(--primary)" />
                <SecurityStat label="Tentativas de Acesso" value="342" icon={<Shield size={16} />} color="var(--secondary)" />
                <SecurityStat label="Alertas de Segurança" value="02" icon={<ShieldAlert size={16} />} color="var(--danger)" />
                <SecurityStat label="Auditoria Sanitizada" value="100%" icon={<ShieldCheck size={16} />} color="var(--success)" />
            </div>

            {/* 3. Main Security Tabs */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid #1A1A1A' }}>
                    <button onClick={() => setActiveTab('USERS')} style={{ ...tabStyle, borderBottom: activeTab === 'USERS' ? '2px solid var(--primary)' : 'none', color: activeTab === 'USERS' ? 'white' : 'var(--text-disabled)' }}>Usuários e Perfis</button>
                    <button onClick={() => setActiveTab('LOGS')} style={{ ...tabStyle, borderBottom: activeTab === 'LOGS' ? '2px solid var(--primary)' : 'none', color: activeTab === 'LOGS' ? 'white' : 'var(--text-disabled)' }}>Logs de Auditoria</button>
                    <button onClick={() => setActiveTab('ROLES')} style={{ ...tabStyle, borderBottom: activeTab === 'ROLES' ? '2px solid var(--primary)' : 'none', color: activeTab === 'ROLES' ? 'white' : 'var(--text-disabled)' }}>Matriz de Permissões</button>
                </div>

                {activeTab === 'USERS' && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="Buscar usuário por nome ou email..." style={{ ...inputStyle, width: '350px', paddingLeft: '36px' }} />
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-disabled)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Sua sessão atual: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{currentUser.nome} ({currentUser.role})</span>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '16px 20px' }}>Usuário</th>
                                    <th style={{ padding: '16px' }}>Perfil / Role</th>
                                    <th style={{ padding: '16px' }}>Escopo / Restrição</th>
                                    <th style={{ padding: '16px' }}>Último Acesso</th>
                                    <th style={{ padding: '16px', textAlign: 'center' }}>Simular</th>
                                    <th style={{ padding: '16px 20px', width: '100px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSOES_LIST.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-white/[0.01]">
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>{u.nome.split(' ').map(n => n[0]).join('')}</div>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{u.nome}</p>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <RoleBadge role={u.role as UserRole} />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {u.front ? (
                                                <span style={{ fontSize: '11px', color: 'var(--secondary)' }}>Somente Frente: <strong>{u.front}</strong></span>
                                            ) : u.cc ? (
                                                <span style={{ fontSize: '11px', color: 'var(--warning)' }}>CC: <strong>{u.cc.join(', ')}</strong></span>
                                            ) : (
                                                <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Acesso Global</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '12px' }}>{u.lastAccess}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <button onClick={() => simulateRole(u.role as UserRole, u.nome, u.front)} className="btn btn-ghost" style={{ padding: '6px', fontSize: '10px', height: 'auto' }} title="Testar ambiente como este usuário">
                                                <Key size={14} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn btn-ghost" style={{ padding: '4px' }}><Edit2 size={14} /></button>
                                                <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--danger)' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'LOGS' && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Trilha de Auditoria (Últimas 24h)</h3>
                            <button className="btn btn-ghost" style={{ fontSize: '11px', border: '1px solid #222' }}><Download size={14} style={{ marginRight: 8 }} /> Exportar CSV para Compliance</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {AUDIT_LOGS.map(log => (
                                <div key={log.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid #1A1A1A', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.acao.includes('Negado') ? 'var(--danger)' : 'var(--primary)' }} />
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 600 }}>{log.acao}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Recurso: {log.recurso} • IP: {log.ip}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 700 }}>{log.usuario}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{log.data}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'ROLES' && (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <Lock size={48} color="#333" style={{ margin: '0 auto 20px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Matriz de Permissões Enterprise</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 32px' }}>
                            A edição da matriz de permissões requer autenticação de dois fatores e é restrita ao perfil de Diretor de Tecnologia.
                        </p>
                        <button className="btn btn-primary">Solicitar Acesso à Matriz</button>
                    </div>
                )}
            </div>

            {/* 4. Security Policies Notice */}
            <div className="card" style={{ background: 'rgba(255, 23, 68, 0.03)', borderColor: 'rgba(255, 23, 68, 0.2)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <ShieldX size={32} color="var(--danger)" />
                <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Aviso de Compliance</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Todas as movimentações financeiras acima de R$ 50.000 são logadas e enviadas para o comitê de auditoria externa automaticamente. Tentativas de acesso não autorizado são bloqueadas após 3 falhas.
                    </p>
                </div>
            </div>

        </div>
    );
}

function RoleBadge({ role }: { role: UserRole }) {
    const config: any = {
        'ADMIN': { bg: 'rgba(255,255,255,0.1)', color: 'white' },
        'CONTROLADORIA': { bg: 'rgba(0,230,118,0.1)', color: 'var(--success)' },
        'OPERACIONAL': { bg: 'rgba(41,121,255,0.1)', color: 'var(--secondary)' },
        'GESTOR_FRENTE': { bg: 'rgba(255,171,0,0.1)', color: 'var(--warning)' },
        'GESTOR_CC': { bg: 'rgba(255,87,34,0.1)', color: '#FF5722' },
        'LEITOR': { bg: 'rgba(255,255,255,0.05)', color: '#666' },
    };
    const { bg, color } = config[role] || { bg: '#222', color: '#888' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, background: bg, color: color }}>{role}</span>
    );
}

function SecurityStat({ label, value, icon, color }: any) {
    return (
        <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{label}</p>
                <div style={{ color: color }}>{icon}</div>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</h2>
        </div>
    );
}

const tabStyle = { padding: '16px 20px', fontSize: '13px', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', transition: '0.2s' };
const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
