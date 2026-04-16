'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus, Search, MoreHorizontal, ChevronRight, ChevronDown,
    Folder, FileText, ArrowLeft, Download, PlusCircle,
    Save, X, Pencil, Trash2, ListTree, PackageSearch
} from 'lucide-react';
import Link from 'next/link';

interface AccountNode {
    id: string;
    parent_id: string | null;
    code: string;
    name: string;
    type: string;
    level: number;
    children?: AccountNode[];
}

export default function PlanoContasPage() {
    const [accounts, setAccounts] = useState<AccountNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Partial<AccountNode> | null>(null);

    const fetchAccounts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('accounts_plan')
            .select('*')
            .order('code', { ascending: true });

        if (data) {
            // Build tree structure
            const accountMap: { [key: string]: AccountNode } = {};
            const roots: AccountNode[] = [];

            data.forEach(acc => {
                accountMap[acc.id] = { ...acc, children: [] };
            });

            data.forEach(acc => {
                if (acc.parent_id && accountMap[acc.parent_id]) {
                    accountMap[acc.parent_id].children?.push(accountMap[acc.id]);
                } else {
                    roots.push(accountMap[acc.id]);
                }
            });

            setAccounts(roots);
            // Auto expand roots
            setExpanded(roots.map(r => r.id));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const toggleExpand = (id: string) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (!editingAccount?.name || !editingAccount?.code || !editingAccount?.type) return;

        const payload = {
            ...editingAccount,
            name: editingAccount.name.replace('&', 'E'), // Enforce no '&'
            level: editingAccount.level || 1
        };

        const { error } = await supabase
            .from('accounts_plan')
            .upsert(payload);

        if (!error) {
            setIsModalOpen(false);
            setEditingAccount(null);
            fetchAccounts();
        } else {
            alert('Erro ao salvar conta: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta conta? Subcontas também podem ser afetadas.')) return;
        const { error } = await supabase.from('accounts_plan').delete().eq('id', id);
        if (!error) fetchAccounts();
    };

    const renderRow = (item: AccountNode, depth = 0) => {
        const isFolder = item.children && item.children.length > 0;
        const isExpanded = expanded.includes(item.id);

        // Filter logic
        if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.code.includes(search)) {
            // Check if any children match
            const childrenMatch = item.children?.some(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));
            if (!childrenMatch) return null;
        }

        return (
            <div key={item.id} className="reveal">
                <div
                    className="group border-b border-white/[0.03] hover:bg-white/[0.02] flex items-center transition-all"
                    style={{ padding: '16px 32px' }}
                >
                    {/* Indentation */}
                    <div style={{ width: depth * 32 }} />

                    {/* Expand Toggle */}
                    <div
                        className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/5 rounded-full transition-colors"
                        onClick={() => isFolder && toggleExpand(item.id)}
                    >
                        {isFolder ? (
                            isExpanded ? <ChevronDown size={14} className="text-[var(--primary)]" /> : <ChevronRight size={14} />
                        ) : <div className="w-1 h-1 rounded-full bg-[var(--text-disabled)]" />}
                    </div>

                    {/* Code */}
                    <div className="w-[140px] font-mono text-xs font-black tracking-widest text-[var(--accent-cyan)] opacity-70">
                        {item.code}
                    </div>

                    {/* Name */}
                    <div className="flex-1 flex items-center gap-4">
                        {isFolder ? <Folder size={18} className="text-[var(--primary)] opacity-40" /> : <ListTree size={18} className="text-[var(--text-disabled)] opacity-20" />}
                        <span className={`text-sm ${depth === 0 ? 'font-black uppercase tracking-tighter text-white' : 'font-medium text-[var(--text-secondary)]'}`}>
                            {item.name}
                        </span>
                    </div>

                    {/* Type Badge */}
                    <div className="w-[120px] text-center">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-md border tracking-widest uppercase ${item.type === 'RECEITA' ? 'bg-[var(--accent-lime)]/10 text-[var(--accent-lime)] border-[var(--accent-lime)]/20' :
                                'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] border-[var(--accent-pink)]/20'
                            }`}>
                            {item.type}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="w-[120px] flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--text-muted)] hover:text-white"
                            onClick={() => {
                                setEditingAccount(item);
                                setIsModalOpen(true);
                            }}
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--danger)]/40 hover:text-[var(--danger)]"
                            onClick={() => handleDelete(item.id)}
                        >
                            <Trash2 size={14} />
                        </button>
                        <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--primary)]"
                            onClick={() => {
                                setEditingAccount({ parent_id: item.id, level: item.level + 1, type: item.type, code: item.code + '.' });
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                {isFolder && isExpanded && item.children?.map((child: AccountNode) => renderRow(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className="reveal space-y-12 w-full">

            {/* Header: Quiet Luxury High-End */}
            <header className="flex flex-col md:flex-row justify-between items-start gap-10 border-b border-[var(--border-subtle)] pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full" />
                        <h2 className="text-caption !text-[var(--primary)] font-black">Cadastros Base</h2>
                    </div>
                    <div>
                        <h1 className="h1">Plano de <span className="text-[var(--primary)]">Contas</span></h1>
                        <p className="text-[var(--text-secondary)] text-sm font-medium mt-3 max-w-2xl leading-relaxed">
                            Gestão hierárquica das naturezas financeiras. Esta estrutura governa a consolidação do DRE e o mapeamento de BI.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="btn btn-ghost">
                        <Download size={16} />
                        <span>Exportar Matriz</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        setEditingAccount({ type: 'RECEITA', level: 1 });
                        setIsModalOpen(true);
                    }}>
                        <PlusCircle size={18} />
                        <span>Criar Nova Conta</span>
                    </button>
                </div>
            </header>

            {/* Analysis & Filter Surface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 card p-0 overflow-hidden flex items-center border-dashed">
                    <div className="p-8 border-r border-white/5 flex items-center gap-6 min-w-[300px]">
                        <PackageSearch size={32} className="text-[var(--primary)] opacity-40" />
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Busca Inteligente</p>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filtrar por nome ou código..."
                                className="bg-transparent border-none text-white text-base font-bold outline-none w-full mt-1"
                            />
                        </div>
                    </div>
                    <div className="p-8 flex gap-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--accent-lime)] uppercase tracking-widest">Receitas</span>
                            <span className="text-xl font-black text-white">12 <span className="text-[10px] opacity-20">Ativas</span></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--accent-pink)] uppercase tracking-widest">Despesas</span>
                            <span className="text-xl font-black text-white">30 <span className="text-[10px] opacity-20">Ativas</span></span>
                        </div>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-input)] p-8 flex flex-col justify-center border-l-4 border-l-[var(--accent-purple)]">
                    <p className="text-[10px] font-black text-[var(--accent-purple)] uppercase tracking-widest mb-1">Dica Pro</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                        Mantenha o código (Ex: 1.1.02) padronizado para garantir a correta agregação nos relatórios de BI.
                    </p>
                </div>
            </div>

            {/* Main Hierarchy Viewport */}
            <div className="card p-0 overflow-hidden bg-[var(--bg-card)]/40 backdrop-blur-3xl border-white/5 rounded-2xl shadow-2xl">
                <div className="bg-white/5 border-b border-white/5 flex items-center p-8">
                    <div className="w-10 h-1 flex-shrink-0" />
                    <div className="w-[140px] text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.2em]">Código</div>
                    <div className="flex-1 text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.2em]">Nome da Conta</div>
                    <div className="w-[120px] text-center text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.2em]">Natureza</div>
                    <div className="w-[120px] text-right text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.2em]">Ações</div>
                </div>

                <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-sm font-black text-[var(--text-disabled)] uppercase tracking-widest">Consolidando Estrutura...</p>
                        </div>
                    ) : (
                        accounts.map(acc => renderRow(acc))
                    )}
                </div>
            </div>

            {/* Modal: Account Management */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md">
                    <div className="card w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start">
                            <h2 className="h3">{editingAccount?.id ? 'Editar Conta' : 'Nova Conta'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-disabled)] hover:text-white"><X /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-disabled)]">Descrição da Natureza</label>
                                <input
                                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[var(--primary)] p-4 text-white text-sm font-bold rounded-xl outline-none"
                                    value={editingAccount?.name || ''}
                                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                                    placeholder="Ex: Consultoria Técnica"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-disabled)]">Código Hierárquico</label>
                                    <input
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[var(--primary)] p-4 text-white text-sm font-black tracking-widest rounded-xl outline-none"
                                        value={editingAccount?.code || ''}
                                        onChange={(e) => setEditingAccount({ ...editingAccount, code: e.target.value })}
                                        placeholder="1.1.001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-disabled)]">Tipo de Conta</label>
                                    <select
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[var(--primary)] p-4 text-white text-sm font-bold rounded-xl outline-none"
                                        value={editingAccount?.type || 'RECEITA'}
                                        onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value })}
                                    >
                                        <option value="RECEITA">RECEITA</option>
                                        <option value="DESPESA">DESPESA</option>
                                        <option value="ATIVO">ATIVO</option>
                                        <option value="PASSIVO">PASSIVO</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary flex-1" onClick={handleSave}>
                                <Save size={16} />
                                Salvar Conta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
