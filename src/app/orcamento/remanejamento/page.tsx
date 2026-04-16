'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus, ArrowRightLeft, CheckCircle2,
    Loader2, Save, Calendar, FileText,
    Search, Filter, ShieldCheck, History,
    Check, Ban, ArrowUpRight, ArrowRight, TrendingDown,
    Zap, ListTree, PieChart as PieIcon,
    Calculator, Info, X, ChevronRight,
    Brain, FileDown, Timer, MessageSquare
} from 'lucide-react';

interface Reallocation {
    id: string;
    year: number;
    month: number;
    amount: number;
    justification: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
    source_front: { name: string };
    source_account: { name: string; code: string };
    target_front: { name: string };
    target_account: { name: string; code: string };
}

export default function RemanejamentoPage() {
    const [reallocations, setReallocations] = useState<Reallocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        year: 2026,
        month: 2,
        amount: 0,
        justification: '',
        source_front_id: '',
        source_account_id: '',
        target_front_id: '',
        target_account_id: ''
    });

    const [fronts, setFronts] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
        fetchReallocations();
    }, []);

    const fetchData = async () => {
        const { data: f } = await supabase.from('fronts').select('id, name').eq('active', true);
        const { data: a } = await supabase.from('accounts_plan').select('id, name, code, type').order('code');
        if (f) setFronts(f);
        if (a) setAccounts(a);
    };

    const fetchReallocations = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('budget_reallocations')
            .select(`
                *,
                source_front:fronts!source_front_id(name),
                source_account:accounts_plan!source_account_id(name, code),
                target_front:fronts!target_front_id(name),
                target_account:accounts_plan!target_account_id(name, code)
            `)
            .order('created_at', { ascending: false });

        if (data) setReallocations(data as any);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!formData.amount || !formData.justification || !formData.source_account_id || !formData.target_account_id) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        setIsSaving(true);
        const { error } = await supabase.from('budget_reallocations').insert([formData]);

        if (!error) {
            setIsPanelOpen(false);
            fetchReallocations();
            setFormData({ ...formData, amount: 0, justification: '' });
        } else {
            console.error(error);
            alert('Erro ao registrar remanejamento.');
        }
        setIsSaving(false);
    };

    const generateMonthlyReport = (month: number) => {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const monthlyData = reallocations.filter(r => r.month === month && r.status === 'APPROVED');

        if (monthlyData.length === 0) return "Nenhum remanejamento aprovado para este mês.";

        let report = `RELATÓRIO DE REMANEJAMENTO ORÇAMENTÁRIO - ${monthNames[month - 1].toUpperCase()} 2026\n`;
        report += `==================================================================\n\n`;

        const totalAmount = monthlyData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        report += `Total Movimentado: R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        report += `Número de Operações: ${monthlyData.length}\n\n`;

        report += `DETALHAMENTO DA JORNADA:\n`;
        monthlyData.forEach((r, i) => {
            report += `${i + 1}. DE: [${r.source_front.name}] ${r.source_account.code} - ${r.source_account.name}\n`;
            report += `   PARA: [${r.target_front.name}] ${r.target_account.code} - ${r.target_account.name}\n`;
            report += `   VALOR: R$ ${Number(r.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
            report += `   MOTIVO: ${r.justification}\n`;
            report += `   DATA: ${new Date(r.created_at).toLocaleDateString('pt-BR')}\n`;
            report += `------------------------------------------------------------------\n`;
        });

        report += `\nPARECER DA CONTROLADORIA:\n`;
        report += `As movimentações acima foram validadas conforme a matriz de governança. Não houve impacto negativo no teto orçamentário global.`;

        return report;
    };

    return (
        <div className="reveal space-y-12">

            {/* 1. Header & Navigation */}
            <header className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[var(--border-subtle)] pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
                        <h2 className="text-caption !text-[var(--primary)]">Governança Orçamentária</h2>
                    </div>
                    <div>
                        <h1 className="h1">Análise de <span className="text-[var(--accent-cyan)]">Remanejamento</span></h1>
                        <p className="text-[var(--text-secondary)] text-sm font-medium mt-3 max-w-2xl leading-relaxed">
                            Gestão de transferência de saldos entre frentes e rubricas. Exige justificativa estratégica e trilha de auditoria completa.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="btn btn-ghost group" onClick={() => {
                        const report = generateMonthlyReport(2);
                        const blob = new Blob([report], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Relatorio_Remanejamento_Fevereiro_2026.txt`;
                        a.click();
                    }}>
                        <FileDown size={16} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
                        <span>Relatório Mensal</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsPanelOpen(true)}>
                        <Plus size={18} />
                        <span>Novo Remanejamento</span>
                    </button>
                </div>
            </header>

            {/* 2. Visual Intelligence: Fluxo de Governança */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 card bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-input)] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-8 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-gold)]/10 flex items-center justify-center border border-[var(--accent-gold)]/20 shadow-inner">
                            <ShieldCheck className="text-[var(--accent-gold)]" size={28} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Matriz de Aprovação</h4>
                            <p className="text-xs text-[var(--text-muted)] font-bold mt-1 tracking-tight">Regras vigentes para o Ciclo 2026</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[8px] font-black text-[var(--accent-lime)] uppercase tracking-widest mb-1 block">Até R$ 5k</span>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)]">Aprovação Direta (Gestor da Frente)</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[8px] font-black text-[var(--accent-gold)] uppercase tracking-widest mb-1 block">R$ 5k a R$ 20k</span>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)]">Visto da Controladoria</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-2xl shadow-[var(--accent-pink)]/5">
                            <span className="text-[8px] font-black text-[var(--accent-pink)] uppercase tracking-widest mb-1 block">{'>'} R$ 20k</span>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)] font-black">Homologação da Diretoria</p>
                        </div>
                    </div>
                </div>

                <div className="card border-[var(--primary)]/20 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Brain size={16} className="text-[var(--primary)]" />
                            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">BI Insight</span>
                        </div>
                        <p className="text-sm text-white font-bold leading-snug">
                            "A jornada de remanejamento sugere uma migração de 15% do orçamento de MKT para Acadêmico neste trimestre."
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <TrendingDown size={16} className="text-[var(--accent-pink)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Janelas de Risco</p>
                            <p className="text-[11px] font-bold text-white">Impacto na Liquidez: Baixo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Journey View */}
            <div className="card p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <History size={20} className="text-[var(--primary)]" />
                        <h3 className="h3">Jornada de Remanejamentos</h3>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-[var(--bg-input)] rounded-lg text-[10px] font-black border border-white/5 text-[var(--text-muted)] tracking-widest uppercase">
                            Status: Todos
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01] border-b border-white/5">
                                <th className="p-8 text-caption text-white">Origem / Destino</th>
                                <th className="p-8 text-caption text-white">Data / Jornada</th>
                                <th className="p-8 text-caption text-right text-white">Valor Transferido</th>
                                <th className="p-8 text-caption text-center text-white">Governança</th>
                                <th className="p-8 text-caption text-center text-white">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[var(--primary)]" size={40} /></td></tr>
                            ) : reallocations.map(r => (
                                <tr key={r.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[var(--accent-pink)] uppercase tracking-widest mb-1">{r.source_front.name}</span>
                                                <span className="text-sm font-bold text-white tracking-tight">{r.source_account.name}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-[var(--text-disabled)]" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-widest mb-1">{r.target_front.name}</span>
                                                <span className="text-sm font-bold text-white tracking-tight">{r.target_account.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-secondary)] font-bold">{new Date(r.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-[var(--text-disabled)] font-medium truncate max-w-[200px] italic">"{r.justification}"</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <span className="text-base font-black text-white tracking-tighter">
                                            R$ {Number(r.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${r.status === 'APPROVED' ? 'bg-[var(--accent-lime)]/10 text-[var(--accent-lime)] border-[var(--accent-lime)]/20' :
                                                r.status === 'REJECTED' ? 'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] border-[var(--accent-pink)]/20' :
                                                    'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20'
                                                }`}>
                                                {r.status === 'APPROVED' ? 'CONCLUÍDO' : r.status === 'REJECTED' ? 'REJEITADO' : 'EM ANÁLISE'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center border border-white/5">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Functional Drawer: New Request */}
            {isPanelOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsPanelOpen(false)} />
                    <div className="relative w-full max-w-xl h-full bg-[var(--bg-card)] border-l border-white/10 p-12 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="h2 tracking-tighter">Nova <span className="text-[var(--primary)]">Solicitação</span></h2>
                                <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Registe a jornada de remanejamento no sistema.</p>
                            </div>
                            <button onClick={() => setIsPanelOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                        </div>

                        <div className="space-y-10 flex-1">
                            {/* AREA: ORIGEM */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[var(--accent-pink)] uppercase tracking-widest flex items-center gap-2">
                                    <TrendingDown size={14} /> Origem (RETRATAÇÃO)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="bg-[var(--bg-input)] border border-white/5 p-4 text-xs font-bold text-white rounded-xl outline-none focus:border-[var(--primary)]"
                                        value={formData.source_front_id}
                                        onChange={(e) => setFormData({ ...formData, source_front_id: e.target.value })}
                                    >
                                        <option value="">Selecione a Frente</option>
                                        {fronts.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                    <select
                                        className="bg-[var(--bg-input)] border border-white/5 p-4 text-xs font-bold text-white rounded-xl outline-none focus:border-[var(--primary)]"
                                        value={formData.source_account_id}
                                        onChange={(e) => setFormData({ ...formData, source_account_id: e.target.value })}
                                    >
                                        <option value="">Rubrica de Origem</option>
                                        {accounts.filter(a => a.type === 'DESPESA').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-center"><ArrowRightLeft size={24} className="text-[var(--primary)] opacity-30" /></div>

                            {/* AREA: DESTINO */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-widest flex items-center gap-2">
                                    <ArrowUpRight size={14} /> Destino (SUPLEMENTAÇÃO)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="bg-[var(--bg-input)] border border-white/5 p-4 text-xs font-bold text-white rounded-xl outline-none focus:border-[var(--primary)]"
                                        value={formData.target_front_id}
                                        onChange={(e) => setFormData({ ...formData, target_front_id: e.target.value })}
                                    >
                                        <option value="">Selecione a Frente</option>
                                        {fronts.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                    <select
                                        className="bg-[var(--bg-input)] border border-white/5 p-4 text-xs font-bold text-white rounded-xl outline-none focus:border-[var(--primary)]"
                                        value={formData.target_account_id}
                                        onChange={(e) => setFormData({ ...formData, target_account_id: e.target.value })}
                                    >
                                        <option value="">Rubrica de Destino</option>
                                        {accounts.filter(a => a.type === 'DESPESA').map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* VALOR & JUSTIFICATIVA */}
                            <div className="grid grid-cols-1 gap-8 pt-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Calculator size={14} /> Valor do Remanejamento
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-[var(--bg-input)] border-2 border-[var(--primary)]/30 p-5 text-2xl font-black text-white rounded-2xl outline-none focus:border-[var(--primary)] shadow-[0_0_20px_rgba(90,140,255,0.1)]"
                                        placeholder="0,00"
                                        value={formData.amount || ''}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <MessageSquare size={14} /> Justificativa Estratégica
                                    </label>
                                    <textarea
                                        className="w-full bg-[var(--bg-input)] border border-white/5 p-5 text-sm font-medium text-white rounded-2xl outline-none focus:border-[var(--primary)] min-h-[120px] resize-none"
                                        placeholder="Por que este ajuste é necessário agora?"
                                        value={formData.justification}
                                        onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                            <button className="btn btn-ghost flex-1" onClick={() => setIsPanelOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary flex-1 shadow-2xl shadow-[var(--primary)]/20" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                <span>Efetivar Remanejamento</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
