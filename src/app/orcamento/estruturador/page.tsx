'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus, Trash2, ChevronDown, ChevronRight, Upload, Save,
    Link, Link2Off, Database, FileText, Download,
    ArrowRight, Sparkles, Filter, Settings, Info, X, Tag, Search, CheckCircle2,
    Calculator, Brain, Home
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TAXONOMY } from './taxonomy';

// --- TYPES ---

interface BudgetNode {
    id: string;
    parentId: string | null;
    label: string;
    level: number;
    value: number;
    accountCode: string;
    costCenter: string;
    isOpen: boolean;
    classifications?: {
        [key: string]: string[];
    };
}

export default function VinculadorOrcamentario() {
    const [nodes, setNodes] = useState<BudgetNode[]>([
        // --- RECEITAS (DEFAULT) ---
        { id: 'R1', parentId: null, label: 'RECEITAS TOTAIS', level: 0, value: 0, accountCode: '4.1', costCenter: 'CVE', isOpen: true },
        { id: 'R2', parentId: 'R1', label: 'Receitas PAIDEIA', level: 1, value: 0, accountCode: '4.1.01', costCenter: 'PAIDEIA', isOpen: true },
        { id: 'R3', parentId: 'R1', label: 'Receitas PAIDEIA Complementar', level: 1, value: 0, accountCode: '4.1.02', costCenter: 'PAIDEIA', isOpen: true },
        { id: 'R4', parentId: 'R1', label: 'Receitas OIKOS', level: 1, value: 0, accountCode: '4.1.03', costCenter: 'OIKOS', isOpen: true },
        { id: 'R5', parentId: 'R1', label: 'Receitas BIBLOS', level: 1, value: 0, accountCode: '4.1.04', costCenter: 'BIBLOS', isOpen: true },

        // --- DESPESAS: PESSOAL ---
        { id: 'D1', parentId: null, label: 'PESSOAL (CLT e PJ recorrente)', level: 0, value: 42695.00, accountCode: '3.1.01', costCenter: 'CVE', isOpen: true },
        { id: 'D1-1', parentId: 'D1', label: 'Folha CLT', level: 1, value: 14436.00, accountCode: '3.1.01.01', costCenter: 'CVE', isOpen: false },
        { id: 'D1-1-1', parentId: 'D1-1', label: 'Analista administrativo e financeiro - Isabela Rolim', level: 2, value: 4543.00, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D1-1-2', parentId: 'D1-1', label: 'Assistente Comercial / administrativo - Emmanuel Pires', level: 2, value: 3612.91, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D1-1-3', parentId: 'D1-1', label: 'Consultora Pedagógica (Analista) - Raissa Fernandes', level: 2, value: 6280.00, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },

        { id: 'D1-2', parentId: 'D1', label: 'PJs recorrentes', level: 1, value: 28259.00, accountCode: '3.1.01.02', costCenter: 'CVE', isOpen: false },
        { id: 'D1-2-1', parentId: 'D1-2', label: 'Consultor Primeira infância - Layla Ramos', level: 2, value: 5445.92, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D1-2-2', parentId: 'D1-2', label: 'Consultor Fund 1 - Jhon Jarisson', level: 2, value: 5445.92, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D1-2-3', parentId: 'D1-2', label: 'Consultor Fund 1 - Bia Andrade', level: 2, value: 5667.20, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D1-2-4', parentId: 'D1-2', label: 'Analista editorial Infantil - Belinha', level: 2, value: 5000.00, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D1-2-5', parentId: 'D1-2', label: 'Consultor organizacional - Renato Assis', level: 2, value: 6000.00, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D1-2-6', parentId: 'D1-2', label: 'Consultor de produção musical - Marcio', level: 2, value: 700.00, accountCode: '', costCenter: 'CVE', isOpen: false },

        // --- PRODUÇÃO PEDAGÓGICA ---
        { id: 'D2', parentId: null, label: 'PRODUÇÃO PEDAGÓGICA E EDITORIAL', level: 0, value: 1100.00, accountCode: '3.1.02', costCenter: 'CVE', isOpen: true },
        { id: 'D2-1', parentId: 'D2', label: 'PAIDEIA INFANTIL', level: 1, value: 100.00, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-1-1', parentId: 'D2-1', label: 'Ilustração Paideia - Infantil', level: 2, value: 100.00, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-1-2', parentId: 'D2-1', label: 'Construção dos flashcards (geral)', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },

        { id: 'D2-2', parentId: 'D2', label: 'PRODUÇÃO FUNDAMENTAL 1 (Pagamento 50%)', level: 1, value: 1000.00, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-1', parentId: 'D2-2', label: 'Autoria - 1º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-2', parentId: 'D2-2', label: 'Revisão - 1º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-3', parentId: 'D2-2', label: 'Ilustração - 1º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-4', parentId: 'D2-2', label: 'Diagramação - 1º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-5', parentId: 'D2-2', label: 'Autoria - 2º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-6', parentId: 'D2-2', label: 'Autoria - 3º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-7', parentId: 'D2-2', label: 'Autoria - 4º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-8', parentId: 'D2-2', label: 'Autoria - 5º Ano Fund 1', level: 2, value: 0, accountCode: '', costCenter: 'PAIDEIA', isOpen: false },
        { id: 'D2-2-9', parentId: 'D2-2', label: 'Assessoria editorial para padronização', level: 2, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },

        { id: 'D2-3', parentId: 'D2', label: 'BIBLOS', level: 1, value: 0, accountCode: '', costCenter: 'BIBLOS', isOpen: false },
        { id: 'D2-4', parentId: 'D2', label: 'OIKOS', level: 1, value: 0, accountCode: '', costCenter: 'OIKOS', isOpen: false },

        // --- OUTROS GRUPOS MASTER ---
        { id: 'D3', parentId: null, label: 'PRODUÇÃO AUDIOVISUAL', level: 0, value: 0, accountCode: '3.1.03', costCenter: 'CVE', isOpen: false },
        { id: 'D4', parentId: null, label: 'PRODUÇÃO GRÁFICA / IMPRESSÃO', level: 0, value: 0, accountCode: '3.1.04', costCenter: 'CVE', isOpen: false },
        { id: 'D5', parentId: null, label: 'TECNOLOGIA', level: 0, value: 0, accountCode: '3.1.05', costCenter: 'CVE', isOpen: false },
        { id: 'D6', parentId: null, label: 'MARKETING E PUBLICIDADE', level: 0, value: 0, accountCode: '3.1.06', costCenter: 'CVE', isOpen: false },

        { id: 'D7', parentId: null, label: 'REGULATÓRIOS E TAXAS LEGAIS', level: 0, value: 0, accountCode: '3.1.07', costCenter: 'CVE', isOpen: true },
        { id: 'D7-1', parentId: 'D7', label: 'ISBN – registro e catalogação - 1º Ano Fund 1', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D7-2', parentId: 'D7', label: 'ISBN – registro e catalogação - 2º Ano Fund 1', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D7-3', parentId: 'D7', label: 'ISBN – registro e catalogação - 3º Ano Fund 1', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D7-4', parentId: 'D7', label: 'ISBN – registro e catalogação - 4º Ano Fund 1', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D7-5', parentId: 'D7', label: 'ISBN – registro e catalogação - 5º Ano Fund 1', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },
        { id: 'D7-6', parentId: 'D7', label: 'Registro de marcas', level: 1, value: 0, accountCode: '', costCenter: 'CVE', isOpen: false },

        { id: 'D8', parentId: null, label: 'VIAGENS E REPRESENTAÇÃO', level: 0, value: 0, accountCode: '3.1.08', costCenter: 'CVE', isOpen: false },
        { id: 'D9', parentId: null, label: 'INFRAESTRUTURA E UTILIDADES', level: 0, value: 0, accountCode: '3.1.09', costCenter: 'CVE', isOpen: false },
    ]);

    const [viewMode, setViewMode] = useState<'BUILD' | 'MAP'>('BUILD');
    const [isSaving, setIsSaving] = useState(false);
    const [targetYear] = useState(2026);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // --- AI AGENT: AUTO-CLASSIFICATION SIMULATION ---
    const simulateAIClassification = (label: string) => {
        const text = label.toLowerCase();
        const suggestions: { [key: string]: string[] } = {};

        // 1. Natureza Econômica
        if (text.includes('clt') || text.includes('pj') || text.includes('folha')) suggestions['natureza_economica'] = ['Pessoal e encargos'];
        else if (text.includes('marketing') || text.includes('publicidade')) suggestions['natureza_economica'] = ['Comunicação e marketing'];
        else suggestions['natureza_economica'] = ['Despesas Operacionais'];

        // 2. Comportamento
        if (text.includes('clt') || text.includes('aluguel') || text.includes('internet')) suggestions['comportamento'] = ['Fixas'];
        else suggestions['comportamento'] = ['Variáveis'];

        // 3. Temporalidade
        if (text.includes('clt')) suggestions['temporalidade'] = ['Recorrentes mensais'];
        else if (text.includes('evento')) suggestions['temporalidade'] = ['Sazonais'];

        // 4. Natureza do Gasto
        if (text.includes('clt') || text.includes('folha') || text.includes('salário')) suggestions['natureza_gasto'] = ['Salários'];
        else if (text.includes('consultoria') || text.includes('pj')) suggestions['natureza_gasto'] = ['Consultorias'];

        // 5. Finalidade Estratégica
        if (text.includes('investimento') || text.includes('expansão')) suggestions['finalidade_estrategica'] = ['Despesas de crescimento'];
        else suggestions['finalidade_estrategica'] = ['Despesas de manutenção'];

        // 6. Impacto Resultado
        if (text.includes('venda') || text.includes('custo')) suggestions['impacto_resultado'] = ['Impactam margem bruta'];
        else suggestions['impacto_resultado'] = ['Impactam EBITDA'];

        return suggestions;
    };

    const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: any[] = XLSX.utils.sheet_to_json(ws);

            const importedNodes: BudgetNode[] = [];

            // Variáveis para rastrear a hierarquia durante o loop
            let currentMasterId: string | null = null;
            let currentLevel1Id: string | null = null;
            let currentLevel2Id: string | null = null;

            data.forEach((row) => {
                const sheetLevel = parseInt(row['Nível'] || row['nivel']) || 1;
                const nodeLevel = Math.max(0, sheetLevel - 1);
                const id = Math.random().toString(36).substr(2, 9);
                const label = row['Rubrica'] || row['rubrica'] || 'Nova Rubrica';

                // Lógica de Reconstrução de Hierarquia
                let parentId: string | null = null;

                if (nodeLevel === 0) {
                    currentMasterId = id;
                    currentLevel1Id = null;
                    currentLevel2Id = null;
                    parentId = null;
                } else if (nodeLevel === 1) {
                    parentId = currentMasterId;
                    currentLevel1Id = id;
                    currentLevel2Id = null;
                } else if (nodeLevel === 2) {
                    parentId = currentLevel1Id || currentMasterId;
                    currentLevel2Id = id;
                } else {
                    parentId = currentLevel2Id || currentLevel1Id || currentMasterId;
                }

                importedNodes.push({
                    id,
                    parentId,
                    label,
                    level: nodeLevel,
                    value: parseFloat(row['Valor'] || row['valor']) || 0,
                    accountCode: '',
                    costCenter: row['Área (CC)'] || row['area'] || 'CVE',
                    isOpen: true,
                    classifications: simulateAIClassification(label)
                });
            });

            // Adiciona ao estado atual mantendo a integridade
            setNodes([...nodes, ...importedNodes]);
        };
        reader.readAsBinaryString(file);
    };

    const totalYearlyPlanned = useMemo(() => {
        return nodes.filter(n => n.level === 0).reduce((acc, curr) => acc + (curr.value * 12), 0);
    }, [nodes]);

    // --- DATABASE PERSISTENCE ---
    const handleSaveToDatabase = async () => {
        setIsSaving(true);
        try {
            const { data: fronts } = await supabase.from('fronts').select('id, name');
            const { data: costCenters } = await supabase.from('cost_centers').select('id, name');

            const idMapping: { [key: string]: string } = {};
            const sortedNodes = [...nodes].sort((a, b) => a.level - b.level);

            for (const node of sortedNodes) {
                const parentId = node.parentId ? idMapping[node.parentId] : null;
                const type = node.id.startsWith('R') ? 'RECEITA' : 'DESPESA';

                const { data: account, error: accErr } = await supabase
                    .from('accounts_plan')
                    .upsert({
                        parent_id: parentId,
                        code: node.accountCode || `EXT-${node.id}`,
                        name: node.label,
                        type,
                        level: node.level,
                        classifications: node.classifications || {}
                    }, { onConflict: 'code' })
                    .select()
                    .single();

                if (accErr) throw accErr;
                idMapping[node.id] = account.id;

                if (node.value > 0) {
                    const frontId = fronts?.find(f => f.name === node.costCenter)?.id || fronts?.find(f => f.name === 'CVE')?.id;
                    const ccId = costCenters?.find(cc => cc.name === node.costCenter)?.id || costCenters?.[0]?.id;

                    if (frontId && ccId) {
                        await supabase
                            .from('budget_plans')
                            .upsert({
                                year: 2026,
                                month: 1,
                                front_id: frontId,
                                account_id: account.id,
                                cost_center_id: ccId,
                                amount_planned: node.value,
                            }, { onConflict: 'year, month, front_id, account_id, cost_center_id' });
                    }
                }
            }
            alert('Sincronização concluída com sucesso!');
        } catch (err) {
            console.error('Save Error:', err);
            alert('Erro ao salvar no banco. Verifique o console.');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadTemplate = () => {
        // Headers exatamente como na imagem do usuário
        const data = [
            {
                'Nível': 1,
                'Rubrica': 'RUBRICA MASTER (NVL 1)',
                'Área (CC)': 'CVE',
                'Mês': 'Janeiro',
                'Ano': 2026,
                'Valor': 15000
            },
            {
                'Nível': 2,
                'Rubrica': 'SUB-RUBRICA (NVL 2)',
                'Área (CC)': 'CVE',
                'Mês': 'Janeiro',
                'Ano': 2026,
                'Valor': 5000
            }
        ];

        const ws = XLSX.utils.json_to_sheet(data);

        // Ajuste de largura das colunas para visualização premium
        const wscols = [
            { wch: 8 },  // Nível
            { wch: 40 }, // Rubrica
            { wch: 15 }, // Área
            { wch: 15 }, // Mês
            { wch: 10 }, // Ano
            { wch: 20 }  // Valor
        ];
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Modelo_Matriz");
        XLSX.writeFile(wb, "modelo_matriz_orcamentaria_2026.xlsx");
    };

    const addNode = (parentId: string | null, level: number) => {
        const newNode: BudgetNode = {
            id: Math.random().toString(36).substr(2, 9),
            parentId,
            label: `Novo Item Nvl ${level}`,
            level,
            value: 0,
            accountCode: '',
            costCenter: 'CVE',
            isOpen: true
        };

        if (!parentId) {
            setNodes([...nodes, newNode]);
            return;
        }

        const parentIndex = nodes.findIndex(n => n.id === parentId);
        if (parentIndex === -1) {
            setNodes([...nodes, newNode]);
            return;
        }

        let lastChildIndex = parentIndex;
        for (let i = parentIndex + 1; i < nodes.length; i++) {
            if (nodes[i].level > nodes[parentIndex].level) {
                lastChildIndex = i;
            } else {
                break;
            }
        }

        const newNodes = [...nodes];
        newNodes.splice(lastChildIndex + 1, 0, newNode);
        setNodes(newNodes);
    };

    const removeNode = (id: string) => setNodes(nodes.filter(n => n.id !== id && n.parentId !== id));
    const updateNode = (id: string, field: keyof BudgetNode, val: any) => setNodes(nodes.map(n => n.id === id ? { ...n, [field]: val } : n));

    const toggleClassification = (nodeId: string, key: string, val: string) => {
        setNodes(nodes.map(node => {
            if (node.id !== nodeId) return node;
            const current = node.classifications?.[key] || [];
            const updated = current.includes(val)
                ? current.filter(v => v !== val)
                : [...current, val];
            return {
                ...node,
                classifications: { ...(node.classifications || {}), [key]: updated }
            };
        }));
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // Placeholder for Loader component if it's not defined elsewhere
    const Loader = () => (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    const thStyle = {
        padding: '2rem 1.5rem',
        fontSize: '10px',
        fontWeight: '900',
        color: 'var(--text-disabled)',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const tdStyle = {
        padding: '1.5rem',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    return (
        <div className="reveal space-y-12 pb-20 font-sans">

            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col gap-6 px-4">
                <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-disabled)] opacity-50">
                    <Home size={12} />
                    <ChevronRight size={10} />
                    <span>Controladoria</span>
                    <ChevronRight size={10} />
                    <span className="text-[var(--primary)]">Matriz Orçamentária</span>
                </nav>

                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
                    Estruturador <span className="text-[var(--primary)] text-shadow-glow">Manual</span>
                </h1>

                <p className="text-sm font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed opacity-60">
                    Local para inserção e consulta manual de receitas e despesas. Organize a hierarquia orçamentária diretamente na matriz.
                </p>

                {/* Sub-Header Actions Row (Hyper-Minimalist - Pure Icon + Text) */}
                <div className="flex flex-wrap items-center gap-20 mt-12 pb-12 border-b border-white/5">
                    <button
                        onClick={() => document.getElementById('xlsx-import')?.click()}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer"
                    >
                        <Upload size={20} className="text-[#F43F5E]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#F43F5E]">IMPORTAR XLSX</span>
                        <input
                            id="xlsx-import"
                            type="file"
                            style={{ display: 'none' }}
                            accept=".xlsx, .xls"
                            onChange={handleImportXLSX}
                        />
                    </button>

                    <button
                        onClick={downloadTemplate}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer"
                    >
                        <Download size={20} className="text-[var(--primary)]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">MODELO XLSX</span>
                    </button>

                    <div className="h-6 w-px bg-white/5 hidden lg:block mx-4" />

                    <button
                        onClick={() => setViewMode(viewMode === 'BUILD' ? 'MAP' : 'BUILD')}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer"
                    >
                        <Link size={20} className="text-[var(--accent-azure)]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--accent-azure)]">
                            {viewMode === 'BUILD' ? 'VINCULAR CONTAS' : 'VOLTAR PARA EDIÇÃO'}
                        </span>
                    </button>

                    <button
                        onClick={handleSaveToDatabase}
                        disabled={isSaving}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="ml-auto flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer disabled:opacity-20"
                    >
                        {isSaving ? <Loader /> : <Save size={22} className="text-[var(--primary)]" />}
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--primary)]">
                            {isSaving ? 'SINCRONIZANDO...' : 'SINCRONIZAR DADOS'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Area (Fluid Margin) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 mt-16 group/stats">
                <div className="card !p-10 flex items-center gap-8 bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--accent-gold)]/10 flex items-center justify-center border border-[var(--accent-gold)]/20 shadow-inner shrink-0">
                        <Calculator size={32} className="text-[var(--accent-gold)]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Total Planejado Ano ({targetYear})</p>
                        <h3 className="text-4xl font-black text-white mt-2">
                            R$ {totalYearlyPlanned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-xs font-bold text-[var(--accent-gold)] mt-1 opacity-60 uppercase">Impacto Global</p>
                    </div>
                </div>

                <div className="lg:col-span-2 card !p-10 border border-[var(--primary)]/20 bg-[var(--bg-input)] flex flex-col justify-center">
                    <div className="flex gap-6">
                        <Sparkles size={32} className="text-[var(--primary)] shrink-0 opacity-60" />
                        <p className="text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                            <strong>Inteligência de Classificação:</strong> Utilize o campo <strong>GERENCIAR CLASSIFICAÇÕES</strong> para caracterizar cada gasto. Marque múltiplas opções para habilitar análises profundas no BI.
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            {/* Main Table Content (Fluid Structure) */}
            <div className="mt-20 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Estruturação Orçamentária</h2>
                        <span className="text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-[0.3em] opacity-40">Hierarquia de contas e dimensões BI para {targetYear}</span>
                    </div>
                    <button
                        onClick={() => addNode(null, 0)}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--primary)] hover:opacity-70 transition-all"
                    >
                        <Plus size={18} /> NOVO ITEM MASTER
                    </button>
                </div>

                <div className="bg-[var(--bg-card)] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0F1115]/50 hover:bg-[#0F1115] transition-colors">
                                    <th style={{ ...thStyle, width: '35%' }}>ESTRUTURA / RUBRICA</th>
                                    <th style={{ ...thStyle, width: '10%' }}>NÍVEL</th>
                                    <th style={{ ...thStyle, width: '25%' }}>GERENCIAR BI</th>
                                    {viewMode === 'MAP' && (
                                        <>
                                            <th style={thStyle}>CÓDIGO</th>
                                            <th style={thStyle}>CC</th>
                                        </>
                                    )}
                                    <th style={{ ...thStyle, textAlign: 'right' }}>VALOR MENSAL</th>
                                    <th style={{ ...thStyle, textAlign: 'center', width: '250px' }}>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {nodes.map((node) => {
                                    const parent = nodes.find(n => n.id === node.parentId);
                                    const levelInfo = node.level === 0
                                        ? { text: 'NÍVEL 0 (MASTER)', color: 'var(--primary)', bg: 'rgba(16, 185, 129, 0.1)' }
                                        : node.level === 1
                                            ? { text: 'NÍVEL 1 (GRUPO)', color: 'var(--accent-azure)', bg: 'rgba(56, 189, 248, 0.1)' }
                                            : node.level === 2
                                                ? { text: 'NÍVEL 2 (SUBITEM)', color: 'var(--text-muted)', bg: 'rgba(148, 163, 184, 0.05)' }
                                                : { text: `NÍVEL ${node.level} (DETALHE)`, color: 'var(--text-disabled)', bg: 'rgba(255, 255, 255, 0.03)' };

                                    const activeTags = Object.values(node.classifications || {}).flat();

                                    return (
                                        <tr key={node.id} className="hover:bg-[var(--bg-input)] transition-all group">
                                            <td style={{ ...tdStyle, paddingLeft: `${0.5 + (node.level * 1.5)}rem` }}>
                                                <div className="flex items-center gap-2">
                                                    {node.level === 0 ? <ArrowRight size={14} className="text-[var(--primary)] shrink-0" /> : <div className="w-3 h-0.5 bg-white/10 rounded-full shrink-0" />}
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <input
                                                            value={node.label}
                                                            onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                                                            style={{ background: 'none', border: 'none', outline: 'none' }}
                                                            className={`w-full !p-0 ${node.level === 0 ? 'text-base font-black tracking-tight text-white' : 'text-xs font-bold text-[var(--text-secondary)]'}`}
                                                            placeholder="Rubrica..."
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={tdStyle}>
                                                <span className="px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase inline-block border border-white/5"
                                                    style={{ color: levelInfo.color, background: levelInfo.bg }}>
                                                    {levelInfo.text}
                                                </span>
                                            </td>

                                            <td style={tdStyle}>
                                                <div
                                                    onClick={() => setSelectedNodeId(node.id)}
                                                    className="flex flex-wrap gap-2 p-4 min-h-[60px] bg-[var(--bg-input)] border border-white/5 rounded-2xl cursor-pointer hover:border-[var(--primary)]/50 hover:bg-[var(--bg-input)]/80 transition-all group/field box-border relative"
                                                >
                                                    {activeTags.length > 0 ? (
                                                        <>
                                                            {activeTags.map((tag, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shrink-0 shadow-lg shadow-[var(--primary)]/20">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            <div className="absolute -top-2 -right-2 bg-[var(--accent-azure)] text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover/field:opacity-100 transition-opacity">
                                                                <Brain size={12} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-3 opacity-30 group-hover/field:opacity-70 transition-opacity">
                                                            <Sparkles size={14} className="text-[var(--primary)]" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clique p/ Classificar BI</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {viewMode === 'MAP' && (
                                                <>
                                                    <td style={tdStyle}>
                                                        <input
                                                            placeholder="Cód Contábil"
                                                            value={node.accountCode}
                                                            onChange={(e) => updateNode(node.id, 'accountCode', e.target.value)}
                                                            className="bg-[#0F1115] border border-white/5 p-4 rounded-xl text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase w-full outline-none focus:border-[var(--primary)]/50 transition-all"
                                                        />
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <select
                                                            value={node.costCenter}
                                                            onChange={(e) => updateNode(node.id, 'costCenter', e.target.value)}
                                                            className="bg-[#0F1115] border border-white/5 p-4 rounded-xl text-[10px] font-black text-[var(--text-secondary)] uppercase w-full outline-none appearance-none cursor-pointer hover:border-[var(--primary)]/30 transition-all"
                                                        >
                                                            <option value="CVE" style={{ backgroundColor: '#0F1115' }}>CVE</option>
                                                            <option value="PAIDEIA" style={{ backgroundColor: '#0F1115' }}>PAIDEIA</option>
                                                            <option value="OIKOS" style={{ backgroundColor: '#0F1115' }}>OIKOS</option>
                                                            <option value="BIBLOS" style={{ backgroundColor: '#0F1115' }}>BIBLOS</option>
                                                        </select>
                                                    </td>
                                                </>
                                            )}

                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div
                                                    className="flex items-center justify-end gap-3 px-4 py-2.5 rounded-xl w-fit ml-auto border transition-all"
                                                    style={{ backgroundColor: '#0F1115', borderColor: 'rgba(255, 255, 255, 0.05)' }}
                                                >
                                                    <span className="text-[10px] font-black text-[var(--text-disabled)] opacity-40 uppercase">R$</span>
                                                    <input
                                                        type="number"
                                                        value={node.value || ''}
                                                        placeholder="0,00"
                                                        onChange={(e) => updateNode(node.id, 'value', parseFloat(e.target.value))}
                                                        className="bg-transparent border-none outline-none text-right text-sm font-black text-white w-[90px] focus:text-[var(--primary)] transition-colors"
                                                    />
                                                </div>
                                            </td>

                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <div className="flex items-center justify-center gap-10 p-2">
                                                    <button
                                                        onClick={() => setSelectedNodeId(node.id)}
                                                        style={{ background: 'none', border: 'none', padding: 0, color: activeTags.length > 0 ? 'var(--primary)' : 'var(--text-disabled)' }}
                                                        className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:scale-110"
                                                    >
                                                        <Tag size={16} /> CLASSIFICAR
                                                    </button>

                                                    <button
                                                        onClick={() => addNode(node.id, node.level + 1)}
                                                        style={{ background: 'none', border: 'none', padding: 0 }}
                                                        className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-[var(--accent-azure)] transition-all hover:scale-110"
                                                    >
                                                        <Plus size={16} /> SUB
                                                    </button>

                                                    <button
                                                        onClick={() => removeNode(node.id)}
                                                        style={{ background: 'none', border: 'none', padding: 0 }}
                                                        className="text-[#F43F5E] opacity-40 hover:opacity-100 transition-all hover:scale-110"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Premium Multi-Choice Classification Side-Drawer */}
                {selectedNode && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setSelectedNodeId(null)} />
                        <div className="relative w-[580px] h-full bg-[var(--bg-card)] border-l border-white/10 p-16 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.9)]">
                            <div className="flex justify-between items-center mb-16 pb-12 border-b border-white/5">
                                <div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Inteligência BI</h2>
                                    <p className="text-xs text-[var(--primary)] font-black uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                        <Tag size={12} /> {selectedNode.label}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedNodeId(null)} className="p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                    <X size={28} className="text-white/40" />
                                </button>
                            </div>

                            <div className="space-y-16 flex-1 pr-6 custom-scrollbar pb-20">
                                {Object.entries(TAXONOMY).map(([key, options]) => (
                                    <div key={key} className="space-y-8">
                                        <div className="flex justify-between items-center bg-[var(--primary)]/5 p-5 rounded-2xl border-l-4 border-[var(--primary)]">
                                            <label className="text-[12px] font-black uppercase tracking-[0.4em] text-white">
                                                {key.replace(/_/g, ' ')}
                                            </label>
                                            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-3 py-1 rounded-full">Análise Profunda</span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {options.map((opt: any) => {
                                                if (typeof opt === 'string') {
                                                    const isSelected = selectedNode.classifications?.[key]?.includes(opt);
                                                    return (
                                                        <button
                                                            key={opt}
                                                            onClick={() => toggleClassification(selectedNode.id, key, opt)}
                                                            className={`flex items-center justify-between p-6 rounded-2xl border text-[13px] font-extrabold transition-all
                                                            ${isSelected
                                                                    ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-white shadow-xl'
                                                                    : 'bg-[var(--bg-input)] border-white/5 text-[var(--text-muted)] hover:bg-[var(--bg-input)]/80'}`}
                                                        >
                                                            <span className="flex items-center gap-4">
                                                                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shadow-inner
                                                                ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-white/20'}`}>
                                                                    {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                                                </div>
                                                                {opt}
                                                            </span>
                                                            {isSelected && <span className="text-[9px] font-black text-[var(--primary)]">MARCADO</span>}
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <div key={opt.label} className="space-y-4 mt-6">
                                                            <p className="text-[10px] font-black text-[var(--accent-azure)] uppercase tracking-[0.3em] pl-4 border-l-2 border-[var(--accent-azure)]/40 mb-6 opacity-60">
                                                                {opt.label}
                                                            </p>
                                                            {opt.children.map((child: string) => {
                                                                const isSelected = selectedNode.classifications?.[key]?.includes(child);
                                                                return (
                                                                    <button
                                                                        key={child}
                                                                        onClick={() => toggleClassification(selectedNode.id, key, child)}
                                                                        className={`flex items-center justify-between p-6 rounded-2xl border text-[13px] font-extrabold transition-all ml-6
                                                                        ${isSelected
                                                                                ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-white shadow-xl'
                                                                                : 'bg-[var(--bg-input)] border-white/5 text-[var(--text-muted)] hover:bg-[var(--bg-input)]/80'}`}
                                                                    >
                                                                        <span className="flex items-center gap-4">
                                                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shadow-inner
                                                                            ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-white/20'}`}>
                                                                                {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                                                            </div>
                                                                            {child}
                                                                        </span>
                                                                        {isSelected && <span className="text-[9px] font-black text-[var(--primary)]">MARCADO</span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Loader() {
    return (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}
