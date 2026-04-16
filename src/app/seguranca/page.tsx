'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Users, Shield, ShieldAlert, ShieldCheck,
    Search, UserPlus, MoreVertical, Key,
    Mail, Calendar, BadgeCheck, ChevronRight, Lock
} from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'controller' | 'manager' | 'viewer';
    created_at: string;
}

export default function GestaoSeguranca() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [activeTab, setActiveTab] = useState<'USERS' | 'AUDIT'>('USERS');

    const auditLogs = [
        { id: 1, user: 'isabela.rolim@cidadeviva.org', action: 'Alteração Orçamentária', target: 'Rubrica: Salários ADM', date: '13/02/2026 19:42', oldVal: 'R$ 4.200', newVal: 'R$ 4.543' },
        { id: 2, user: 'admin@cidadeviva.org', action: 'Fechamento de Mês', target: 'Competência: Janeiro/2026', date: '13/02/2026 19:30', oldVal: 'ABERTO', newVal: 'TRANCADO' },
        { id: 3, user: 'contato@paideia.edu', action: 'Inclusão de Receita', target: 'Lote #882 - Mensalidades', date: '12/02/2026 14:15', oldVal: '-', newVal: 'R$ 125.000' },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('role', { ascending: true });

            if (data) setUsers(data as UserProfile[]);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) {
            fetchUsers();
            alert('Permissão atualizada com sucesso!');
        }
    };

    const getRoleConfig = (role: string) => {
        switch (role) {
            case 'admin': return { label: 'Administrador', icon: ShieldAlert, color: '#F43F5E', desc: 'Acesso total ao sistema e configurações críticas.' };
            case 'controller': return { label: 'Controladoria', icon: ShieldCheck, color: 'var(--primary)', desc: 'Gestão de orçamento, fechamentos e BI analítico.' };
            case 'manager': return { label: 'Gerente (Unidade)', icon: Shield, color: 'var(--accent-azure)', desc: 'Visualização de dashboards e inputs operacionais.' };
            default: return { label: 'Visualizador', icon: BadgeCheck, color: 'var(--text-disabled)', desc: 'Acesso restrito a relatórios e visualizações básicas.' };
        }
    };

    return (
        <div className="reveal space-y-16 pb-20">
            {/* Header - SPACIOUS */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Lock className="text-[var(--primary)]" size={16} />
                        <h2 className="text-caption text-[var(--primary)] tracking-[0.4em] text-sm">Security & Compliance Hub</h2>
                    </div>
                    <h1 className="h1">Controle de <span className="text-[var(--primary)]">Acessos</span></h1>
                    <p className="text-lg font-medium text-[var(--text-secondary)] opacity-80 max-w-2xl leading-relaxed">
                        Gestão centralizada de privilégios, auditoria de logs e política de segurança institucional.
                    </p>
                </div>
                <button className="btn btn-primary !px-12 shadow-xl shadow-[var(--primary)]/20">
                    <UserPlus size={18} />
                    <span>CONVIDAR USUÁRIO</span>
                </button>
            </header>

            {/* Matrix of Permissions - SPACIOUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {['admin', 'controller', 'manager', 'viewer'].map(r => {
                    const config = getRoleConfig(r);
                    return (
                        <div key={r} className="card border-t-4" style={{ borderTopColor: config.color }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-white/5" style={{ color: config.color }}>
                                    <config.icon size={24} />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-white">{config.label}</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                                {config.desc}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Tabs & Table Section */}
            <div className="space-y-10">
                <div className="flex gap-12 border-b border-white/5">
                    {['USERS', 'AUDIT'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-6 text-xs font-black uppercase tracking-[0.25em] transition-all border-b-2 ${activeTab === tab ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text-disabled)] hover:text-white'}`}
                        >
                            {tab === 'USERS' ? 'Colaboradores' : 'Registro de Auditoria'}
                        </button>
                    ))}
                </div>

                {activeTab === 'USERS' ? (
                    <div className="card !p-0 overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-white/5 bg-[#1D222B]">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Matriz de Usuários Ativos</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-[10px] uppercase font-black text-[var(--text-disabled)] tracking-[0.2em]">
                                    <tr>
                                        <th className="p-8">Colaborador</th>
                                        <th className="p-8">Nível de Acesso</th>
                                        <th className="p-8">Data Cadastro</th>
                                        <th className="p-8 text-right">Ações de Segurança</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(user => {
                                        const roleInfo = getRoleConfig(user.role);
                                        return (
                                            <tr key={user.id} className="hover:bg-white/[0.01] transition-all group">
                                                <td className="p-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-[var(--bg-input)] rounded-2xl flex items-center justify-center font-black text-[var(--primary)] text-lg border border-white/5 shadow-inner">
                                                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-black text-white">{user.full_name || 'Usuário s/ nome'}</span>
                                                            <span className="text-[11px] text-[var(--text-disabled)] lowercase flex items-center gap-2">
                                                                <Mail size={12} /> {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex items-center gap-3 bg-[var(--bg-input)] px-4 py-2.5 rounded-xl border border-white/5 w-fit">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleInfo.color }} />
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-white">{roleInfo.label}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex items-center gap-3 text-[var(--text-muted)] font-bold text-xs">
                                                        <Calendar size={14} />
                                                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button className="btn !p-3 bg-white/5 border-white/5 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"><Key size={16} /></button>
                                                        <button className="btn !p-3 bg-white/5 border-white/5 hover:bg-white/10"><MoreVertical size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="card !p-0 overflow-hidden shadow-2xl">
                        <div className="p-10 border-b border-white/5 bg-[#1D222B]">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Logs de Auditoria Interna</h3>
                        </div>
                        <div className="overflow-x-auto">
                            {/* ... Audit table (similar spacing) ... */}
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-[10px] uppercase font-black text-[var(--text-disabled)] tracking-[0.2em]">
                                    <tr>
                                        <th className="p-8">Timestamp</th>
                                        <th className="p-8">Usuário</th>
                                        <th className="p-8">Ação Analítica</th>
                                        <th className="p-8 text-right">Variatória</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-white/[0.01] transition-all">
                                            <td className="p-8 text-xs text-[var(--text-disabled)] font-bold">{log.date}</td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black border border-white/10">UI</div>
                                                    <span className="text-xs font-black text-white">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/5 px-3 py-1.5 rounded-lg border border-[var(--primary)]/10">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] text-[var(--text-disabled)] line-through opacity-40">{log.oldVal}</span>
                                                    <span className="text-xs text-[var(--success)] font-black">{log.newVal}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-10 bg-[var(--danger)]/5 border border-dashed border-[var(--danger)]/20 rounded-2xl flex gap-8 items-center">
                <ShieldAlert className="text-[var(--danger)]" size={32} />
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-[var(--danger)] tracking-widest">Aviso de Auditoria Ativa</p>
                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">Todas as operações de alteração de papéis e permissões são registradas permanentemente para compliance com as normas de governança da Cidade Viva Education.</p>
                </div>
            </div>
        </div>
    );
}
