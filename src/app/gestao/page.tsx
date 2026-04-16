'use client';

import { useState } from 'react';
import {
    LayoutDashboard, PieChart, Banknote, Landmark,
    ArrowRightLeft, FileCheck2, ClipboardList,
    Settings, ShieldCheck, ChevronRight, Sparkles,
    CalendarDays, Target, TrendingUp, AlertCircle,
    Download
} from 'lucide-react';
import Link from 'next/link';

export default function CentralDeGestao() {
    const [monthStatus, setMonthStatus] = useState<'OPEN' | 'CLOSING' | 'CLOSED'>('OPEN');
    const [exporting, setExporting] = useState(false);

    const handleExportPackage = async () => {
        setExporting(true);
        // Simulação de geração de PDF e ZIP
        await new Promise(resolve => setTimeout(resolve, 4000));

        const blob = new Blob(["Simulated ZIP Content: DRE.pdf, Fluxo.pdf, Balanco.pdf"], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pacote_fechamento_jan_2026.zip";
        a.click();

        setExporting(false);
        alert('PACOTE DE FECHAMENTO EXPORTADO: DRE, Fluxo de Caixa e Balanço Consolidados.');
    };

    const handleClosing = async () => {
        if (!confirm('Deseja realmente iniciar o fechamento de Janeiro/2026? Isso irá trancar novos lançamentos.')) return;

        setMonthStatus('CLOSING');

        // Simulação de fechamento no Supabase
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            // Em um app real: await supabase.from('closed_periods').insert({ year: 2026, month: 1 })
            setMonthStatus('CLOSED');
            alert('FECHAMENTO CONCLUÍDO: Janeiro/2026 está trancado para auditoria. DRE final gerada.');
        } catch (err) {
            setMonthStatus('OPEN');
            alert('Erro ao processar fechamento.');
        }
    };

    const menuItems = [
        {
            category: "ESTRATÉGIA & BI",
            items: [
                { title: "Painel de Analytics", desc: "Visão 360º de KPIs e performance de unidades", icon: PieChart, link: "/dashboard/analytics", color: "var(--primary)" },
                { title: "DRE Gerencial", desc: "Resultado por competência e margens operacionais", icon: ClipboardList, link: "/relatorios/dre", color: "var(--secondary)" },
                { title: "Fluxo de Caixa", desc: "Gestão de liquidez diária e projeção de saldo", icon: Banknote, link: "/relatorios/fluxo-caixa", color: "#3B82F6" },
            ]
        },
        {
            category: "PLANEJAMENTO & OPERAÇÕES",
            items: [
                { title: "Estruturador de Orçamento", desc: "Definição de metas e plano mestre (PMP)", icon: Target, link: "/orcamento/estruturador", color: "var(--primary)" },
                { title: "Input de Receitas", desc: "Importação e conciliação de faturamento", icon: ArrowRightLeft, link: "/receitas/importacao", color: "var(--secondary)" },
                { title: "Input de Despesas", desc: "Processamento de contas a pagar e custos", icon: Landmark, link: "/despesas/importacao", color: "#F43F5E" },
            ]
        },
        {
            category: "SEGURANÇA & CONFIGURAÇÕES",
            items: [
                { title: "Controle de Acesso", desc: "Gestão de permissões e auditoria", icon: ShieldCheck, link: "/seguranca", color: "var(--text-disabled)" },
                { title: "Plano de Contas", desc: "Configurações técnicas do ERP", icon: Settings, link: "#", color: "var(--text-disabled)" },
            ]
        }
    ];

    return (
        <div className="reveal space-y-12 pb-20">
            {/* Command Header */}
            <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] p-10 rounded-sm">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={120} />
                </div>

                <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[var(--primary)] mb-4">
                            <LayoutDashboard size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center v1.0</span>
                        </div>
                        <h1 className="text-h1" style={{ fontSize: '3.5rem' }}>Hub de <span className="text-[var(--text-disabled)] font-light">Gestão</span></h1>
                        <p className="text-[var(--text-secondary)] max-w-xl">
                            Consolidado de ferramentas de inteligência financeira e controle operacional da Cidade Viva Education.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="bg-black/20 p-6 border border-white/5 rounded-sm text-right min-w-[240px]">
                            <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-2">Período de Competência</p>
                            <div className="flex items-center justify-end gap-3 mb-4">
                                <CalendarDays className="text-[var(--primary)]" size={18} />
                                <span className="text-xl font-serif">Janeiro 2026</span>
                            </div>
                            <button
                                className={`w-full py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${monthStatus === 'OPEN' ? 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black' :
                                    monthStatus === 'CLOSED' ? 'border-green-500 bg-green-500/10 text-green-500 cursor-default' :
                                        'opacity-50 grayscale pointer-events-none'
                                    }`}
                                onClick={handleClosing}
                                disabled={monthStatus !== 'OPEN'}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {monthStatus === 'CLOSED' ? <ShieldCheck size={12} /> : <FileCheck2 size={12} />}
                                    {monthStatus === 'OPEN' ? 'Iniciar Fechamento Mensal' :
                                        monthStatus === 'CLOSING' ? 'Processando Fechamento...' :
                                            'Mês Trancado (Auditado)'}
                                </div>
                            </button>

                            {monthStatus === 'CLOSED' && (
                                <div className="mt-4 pt-4 border-t border-white/5 reveal">
                                    <button
                                        className="btn btn-primary w-full text-[10px] font-black gap-2 ring-1 ring-white/10"
                                        onClick={handleExportPackage}
                                        disabled={exporting}
                                    >
                                        {exporting ? <Sparkles size={12} className="animate-spin" /> : <Download size={12} />}
                                        {exporting ? 'GERANDO PDFS...' : 'EXPORTAR PACOTE ZIP'}
                                    </button>
                                    <p className="text-[8px] text-center mt-2 text-green-500/60 uppercase font-black tracking-tighter">
                                        Snapshots gerados em 13/02/2026
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {menuItems.map((group) => (
                    <div key={group.category} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] bg-[var(--border-active)] flex-1"></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-disabled)] whitespace-nowrap">
                                {group.category}
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {group.items.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.link}
                                    className="group block p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/[0.02] transform translate-x-8 -translate-y-8 rotate-45 group-hover:bg-[var(--primary)]/[0.05] transition-all"></div>

                                    <div className="flex items-start gap-5 relative z-10">
                                        <div
                                            className="w-12 h-12 rounded-sm flex items-center justify-center border border-white/5 bg-white/5 group-hover:scale-110 transition-transform"
                                            style={{ color: item.color }}
                                        >
                                            <item.icon size={22} />
                                        </div>
                                        <div className="space-y-1 pr-6">
                                            <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Alerts / To-Do */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--bg-input)] p-8 border border-[var(--border-subtle)] border-dashed">
                <div className="flex gap-4">
                    <AlertCircle className="text-[var(--secondary)] flex-shrink-0" size={20} />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">Pendências de Conciliação</p>
                        <p className="text-xs text-[var(--text-secondary)]">Existem 12 lançamentos importados que ainda não possuem centro de custo definido.</p>
                        <button className="text-[10px] font-black uppercase text-[var(--secondary)] pt-2 block hover:underline">Resolver Agora →</button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <TrendingUp className="text-[var(--primary)] flex-shrink-0" size={20} />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">Insight de Orçamento</p>
                        <p className="text-xs text-[var(--text-secondary)]">A receita da frente BIBLOS está 15% acima da projeção para o período atual.</p>
                        <button className="text-[10px] font-black uppercase text-[var(--primary)] pt-2 block hover:underline">Ver BI Analítico →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
