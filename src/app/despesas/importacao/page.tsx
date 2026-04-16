'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Upload, FileText, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Download, Info, Trash2,
    ShoppingCart, User
} from 'lucide-react';
import Link from 'next/link';

// --- TYPES ---
interface ExpenseRow {
    id: string;
    competencia: string;
    caixa: string;
    descricao: string;
    rubrica: string;
    centroCusto: string;
    fornecedor: string;
    valor: number;
    status: 'VALID' | 'ERROR';
}

export default function ImportacaoDespesas() {
    const [step, setStep] = useState<'UPLOAD' | 'CONFIG' | 'PREVIEW' | 'SUCCESS'>('UPLOAD');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewData, setPreviewData] = useState<ExpenseRow[]>([]);

    // --- ACTIONS ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setIsProcessing(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split(/\r?\n/);

                // Skip header and empty lines
                const parsedData: ExpenseRow[] = lines.slice(1)
                    .filter(line => line.trim() !== '')
                    .map((line, idx) => {
                        const cols = line.split(';');
                        return {
                            id: String(idx + 1),
                            competencia: cols[0]?.trim() || '',
                            caixa: cols[1]?.trim() || '',
                            descricao: cols[2]?.trim() || '',
                            rubrica: cols[3]?.trim() || '',
                            centroCusto: cols[4]?.trim() || '',
                            fornecedor: cols[5]?.trim() || '',
                            valor: parseFloat(cols[6]?.replace('.', '').replace(',', '.') || '0'),
                            status: cols[0] && cols[6] ? 'VALID' : 'ERROR'
                        };
                    });

                setPreviewData(parsedData);
                setIsProcessing(false);
                setStep('CONFIG');
            };
            reader.readAsText(file);
        }
    };

    const handleCommit = async () => {
        setIsProcessing(true);
        try {
            // 1. Fetch Reference Data
            const { data: fronts } = await supabase.from('fronts').select('id, name');
            const { data: accounts } = await supabase.from('accounts_plan').select('id, name');
            const { data: costCenters } = await supabase.from('cost_centers').select('id, name');
            const { data: entities } = await supabase.from('entities').select('id, name');

            // 2. Prepare entries
            const validRows = previewData.filter(r => r.status === 'VALID');

            for (const row of validRows) {
                // Mapping
                const frontId = fronts?.find(f => f.name.includes(row.centroCusto))?.id || fronts?.[0]?.id;
                const accountId = accounts?.find(a => a.name === row.rubrica)?.id;
                const ccId = costCenters?.find(cc => cc.name === row.centroCusto)?.id;
                const entityId = entities?.find(ent => ent.name === row.fornecedor)?.id;

                if (!accountId) {
                    console.warn(`Rubrica não encontrada para: ${row.rubrica}`);
                    continue;
                }

                // Create Entry (EXPENSE)
                const { data: entry, error: entryErr } = await supabase
                    .from('financial_entries')
                    .insert({
                        description: row.descricao,
                        type: 'EXPENSE',
                        front_id: frontId,
                        account_id: accountId,
                        cost_center_id: ccId,
                        entity_id: entityId,
                        total_amount: row.valor,
                        status: 'SETTLED' // Assumindo que o CSV de caixa já é pago
                    })
                    .select()
                    .single();

                if (entryErr) throw entryErr;

                // Create Installment
                const { error: instErr } = await supabase
                    .from('installments')
                    .insert({
                        entry_id: entry.id,
                        number: 1,
                        amount: row.valor,
                        due_date: new Date(row.caixa.split('/').reverse().join('-')),
                        competence_date: new Date(row.competencia.split('/').reverse().join('-') + '-01'),
                        status: 'PAID',
                        payment_date: new Date(row.caixa.split('/').reverse().join('-'))
                    });

                if (instErr) throw instErr;
            }

            setStep('SUCCESS');
        } catch (err) {
            console.error('Error committing expenses:', err);
            alert('Falha ao sincronizar despesas com o banco de dados.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "Competência;Data de Caixa;Descrição;Rubrica;Centro de Custo;Fornecedor;Valor\n";
        const rows = [
            "01/2026;15/01/2026;Pagamento Salário;Analista administrativo e financeiro - Isabela Rolim;ADM;Colaborador;4543,00",
            "01/2026;20/01/2026;Compra de Papelaria;PRODUÇÃO GRÁFICA / IMPRESSÃO;PROD;Papelaria Central;150,00"
        ].join("\n");
        const bom = "\uFEFF";
        const blob = new Blob([bom + headers + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "modelo_importacao_despesas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="reveal space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-8">
                <div>
                    <h1 className="text-h1" style={{ fontSize: '3.5rem' }}>
                        Importação de <span className="text-[var(--primary)]">Despesas</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Integração em massa de fluxos de caixa e despesas operacionais
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-ghost" onClick={downloadTemplate}>
                        <Download size={16} /> MODELO CSV
                    </button>
                    <Link href="/despesas" className="btn btn-primary">
                        LISTAR DESPESAS
                    </Link>
                </div>
            </div>

            {/* Steps Visualizer */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { id: 'UPLOAD', label: 'Upload CSV', icon: Upload },
                    { id: 'CONFIG', label: 'Mapeamento', icon: FileText },
                    { id: 'PREVIEW', label: 'Validação', icon: ArrowRight },
                    { id: 'SUCCESS', label: 'Finalizado', icon: CheckCircle2 },
                ].map((s, idx) => (
                    <div
                        key={s.id}
                        className={`p-4 border ${step === s.id ? 'border-[var(--primary)] bg-[var(--primary)]/[0.05]' : 'border-[var(--border-subtle)]'} flex items-center gap-3 transition-all`}
                    >
                        <s.icon size={18} className={step === s.id ? 'text-[var(--primary)]' : 'text-[var(--text-disabled)]'} />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${step === s.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-disabled)]'}`}>
                            {idx + 1}. {s.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Surface */}
            <div className="card min-h-[400px] flex items-center justify-center p-12">
                {step === 'UPLOAD' && (
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-20 h-20 bg-[var(--bg-input)] rounded-full flex items-center justify-center mx-auto border border-dashed border-[var(--border-active)]">
                            <Upload className="text-[var(--text-disabled)]" />
                        </div>
                        <h3 className="text-h3">Arraste seu arquivo ou selecione</h3>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Suporta .CSV seguindo o modelo padrão de controladoria
                        </p>
                        <label className="btn btn-primary cursor-pointer inline-flex items-center gap-2">
                            <input type="file" hidden onChange={handleFileUpload} />
                            SELECIONAR ARQUIVO
                        </label>
                    </div>
                )}

                {step === 'CONFIG' && (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-h3 flex items-center gap-2">
                                <FileText className="text-[var(--primary)]" size={20} />
                                Prévia dos Dados ({previewData.length} itens)
                            </h3>
                            <div className="flex gap-4">
                                <button className="btn btn-ghost" onClick={() => setStep('UPLOAD')}>CANCELAR</button>
                                <button className="btn btn-primary" onClick={() => setStep('PREVIEW')}>CONFIRMAR MAPEAMENTO</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)]">Competência</th>
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)]">Caixa</th>
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)]">Descrição</th>
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)]">Rubrica</th>
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)]">Fornecedor</th>
                                        <th className="p-4 text-[9px] font-black uppercase text-[var(--text-disabled)] text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row) => (
                                        <tr key={row.id} className="border-b border-[var(--border-subtle)] hover:bg-white/[0.01]">
                                            <td className="p-4 text-xs">{row.competencia}</td>
                                            <td className="p-4 text-xs">{row.caixa}</td>
                                            <td className="p-4 text-xs font-medium">{row.descricao}</td>
                                            <td className="p-4 text-xs text-[var(--secondary)]">{row.rubrica}</td>
                                            <td className="p-4 text-xs flex items-center gap-2"><User size={12} />{row.fornecedor}</td>
                                            <td className="p-4 text-xs text-right font-serif">
                                                {row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {step === 'PREVIEW' && (
                    <div className="text-center space-y-8 max-w-xl">
                        <div className="w-16 h-16 bg-[var(--primary)]/[0.1] text-[var(--primary)] rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-h2">Tudo pronto para processar?</h3>
                            <p className="text-[var(--text-secondary)]">
                                Vamos criar {previewData.length} registros de despesas no banco de dados.
                                Certifique-se que o centro de custo e a rubrica estão corretos.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-input)]">
                                <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-1">Total à Processar</p>
                                <p className="text-2xl font-serif">
                                    {previewData.reduce((acc, r) => acc + r.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-input)]">
                                <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-1">Registros</p>
                                <p className="text-2xl font-serif">{previewData.length}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center pt-4">
                            <button className="btn btn-ghost px-10" onClick={() => setStep('CONFIG')}>VOLTAR</button>
                            <button
                                className="btn btn-primary px-10 gap-3"
                                onClick={handleCommit}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                                {isProcessing ? 'EFETIVANDO...' : 'EFETIVAR DESPESAS'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-h2">Importação Concluída</h3>
                            <p className="text-[var(--text-secondary)]">Dados integrados com sucesso ao seu Supabase.</p>
                        </div>
                        <div className="flex justify-center gap-4 pt-4">
                            <button className="btn btn-ghost" onClick={() => setStep('UPLOAD')}>IMPORTAR MAIS</button>
                            <Link href="/despesas" className="btn btn-primary">VER DESPESAS</Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="flex gap-6 items-start opacity-60">
                <Info size={20} className="text-[var(--secondary)] flex-shrink-0" />
                <p className="text-xs leading-relaxed max-w-3xl text-[var(--text-secondary)]">
                    Nota: O processador de despesas vincula automaticamente cada linha à conta contábil correspondente na tabela <strong>accounts_plan</strong> usando o nome da rubrica. Registros sem fornecedor (Entity) serão criados como Despesas Genéricas.
                </p>
            </div>
        </div>
    );
}
