'use client';

import { useState, useEffect } from 'react';
import {
    Save, CheckCircle, Lock, Undo2, Copy,
    ChevronDown, Plus, Download, History,
    BarChart3, Layers, Calculator, Split
} from 'lucide-react';

// Mock Data for the demonstration
const ACCOUNTS = [
    { id: '1', code: '1.1.01', name: 'Mensalidades', type: 'RECEITA' },
    { id: '2', code: '1.2.01', name: 'Doações', type: 'RECEITA' },
    { id: '3', code: '2.1.01', name: 'Salários', type: 'DESPESA' },
    { id: '4', code: '2.2.01', name: 'Infraestrutura', type: 'DESPESA' },
];

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function OrçamentoPage() {
    const [status, setStatus] = useState<'RASCUNHO' | 'APROVADO' | 'BLOQUEADO'>('RASCUNHO');
    const [version, setVersion] = useState('Versão Inicial 2026');
    const [data, setData] = useState<any>({});
    const [showHistory, setShowHistory] = useState(false);

    // Initialize empty grid data
    useEffect(() => {
        const initialData: any = {};
        ACCOUNTS.forEach(acc => {
            initialData[acc.id] = MONTHS.reduce((accMonth: any, month) => {
                accMonth[month] = 0;
                return accMonth;
            }, {});
        });
        setData(initialData);
    }, []);

    const handleCellChange = (accId: string, month: string, value: string) => {
        if (status !== 'RASCUNHO') return;
        const numericValue = parseFloat(value.replace(/\D/g, '')) || 0;
        setData((prev: any) => ({
            ...prev,
            [accId]: {
                ...prev[accId],
                [month]: numericValue
            }
        }));
    };

    const getAccountTotal = (accId: string) => {
        return Object.values(data[accId] || {}).reduce((sum: any, val: any) => sum + val, 0);
    };

    const distributeAnnualValue = (accId: string) => {
        if (status !== 'RASCUNHO') return;
        const total = prompt('Digite o valor anual para distribuir:');
        if (total) {
            const value = parseFloat(total) / 12;
            const newData = { ...data };
            MONTHS.forEach(m => newData[accId][m] = value);
            setData(newData);
        }
    };

    const copyRow = (accId: string) => {
        // Logic to copy row to internal buffer
        alert(`Linha ${accId} copiada para transferência.`);
    };

    const isEditable = status === 'RASCUNHO';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Workflow Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Planejamento Orçamentário</h1>
                    <p className="text-body">Gestão de metas e previsões anuais por conta e centro de custo</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {status === 'RASCUNHO' && (
                        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Salvar Rascunho
                        </button>
                    )}
                    {status === 'RASCUNHO' && (
                        <button className="btn btn-ghost" onClick={() => setStatus('APROVADO')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--success)', color: 'var(--success)' }}>
                            <CheckCircle size={18} /> Aprovar Orçamento
                        </button>
                    )}
                    {status === 'APROVADO' && (
                        <button className="btn btn-ghost" onClick={() => setStatus('BLOQUEADO')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                            <Lock size={18} /> Bloquear Versão
                        </button>
                    )}
                    {status !== 'RASCUNHO' && (
                        <button className="btn btn-ghost" onClick={() => setStatus('RASCUNHO')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Undo2 size={18} /> Reverter para Rascunho
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Control Bar */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-disabled)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Versão Selecionada</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 600 }}>{version}</span>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '32px', backgroundColor: '#333' }} />

                    <div>
                        <label style={{ fontSize: '11px', color: 'var(--text-disabled)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Status</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: status === 'RASCUNHO' ? 'var(--warning)' : status === 'APROVADO' ? 'var(--success)' : 'var(--danger)',
                            textTransform: 'uppercase'
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                            {status}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowHistory(!showHistory)}>
                        <History size={16} /> Auditoria
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Exportar Excel
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={16} /> Duplicar 2025
                    </button>
                </div>
            </div>

            {/* 3. Spreadsheet Grid */}
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '16px 24px', width: '250px', position: 'sticky', left: 0, background: '#0A0A0A', zIndex: 10 }}>Conta / Detalhamento</th>
                            {MONTHS.map(month => (
                                <th key={month} style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>{month}</th>
                            ))}
                            <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 'bold' }}>Total Anual</th>
                            <th style={{ width: '60px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ACCOUNTS.map((acc) => (
                            <tr key={acc.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '16px 24px', position: 'sticky', left: 0, background: '#0A0A0A', zIndex: 10 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '11px', color: acc.type === 'RECEITA' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>{acc.type}</span>
                                        <span style={{ fontWeight: 600 }}>{acc.name}</span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>{acc.code}</span>
                                    </div>
                                </td>

                                {MONTHS.map(month => (
                                    <td key={month} style={{ padding: '8px' }}>
                                        <input
                                            type="text"
                                            disabled={!isEditable}
                                            value={(data[acc.id]?.[month] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                                            onChange={(e) => handleCellChange(acc.id, month, e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: isEditable ? '#111' : 'transparent',
                                                border: isEditable ? '1px solid #333' : 'none',
                                                color: isEditable ? 'white' : 'var(--text-disabled)',
                                                textAlign: 'right',
                                                padding: '10px 8px',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                outline: 'none',
                                                cursor: isEditable ? 'text' : 'not-allowed'
                                            }}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                ))}

                                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 'bold', borderLeft: '1px solid var(--border-subtle)' }}>
                                    R$ {getAccountTotal(acc.id).toLocaleString()}
                                </td>

                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '8px', opacity: 0.3 }} className="row-actions">
                                        <Split onClick={() => distributeAnnualValue(acc.id)} size={16} style={{ cursor: 'pointer' }} title="Distribuir Valor" />
                                        <Copy onClick={() => copyRow(acc.id)} size={16} style={{ cursor: 'pointer' }} title="Copiar Linha" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: '2px solid #333', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '20px 24px', fontWeight: 'bold' }}>SALDO PROJETADO</td>
                            {MONTHS.map(month => {
                                const totalReceita = ACCOUNTS.filter(a => a.type === 'RECEITA').reduce((sum, a) => sum + (data[a.id]?.[month] || 0), 0);
                                const totalDespesa = ACCOUNTS.filter(a => a.type === 'DESPESA').reduce((sum, a) => sum + (data[a.id]?.[month] || 0), 0);
                                const saldo = totalReceita - totalDespesa;
                                return (
                                    <td key={month} style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                        R$ {saldo.toLocaleString()}
                                    </td>
                                );
                            })}
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* 4. Audit Panel (Sidebar Style Overlay) */}
            {showHistory && (
                <div style={{
                    position: 'fixed', right: 0, top: 0, bottom: 0, width: '350px',
                    backgroundColor: '#111', borderLeft: '1px solid #333', zIndex: 100,
                    padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px',
                    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="text-h3">Histórico de Alterações</h3>
                        <button className="btn btn-ghost" onClick={() => setShowHistory(false)}>X</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                        <AuditLine user="Renato Assis" action="Versão aprovada" time="13/02/2026 10:45" />
                        <AuditLine user="Sistema" action="Orçamento importado de 2025" time="13/02/2026 09:20" />
                        <AuditLine user="Renato Assis" action="Criou rascunho V1" time="12/02/2026 16:30" />
                    </div>
                </div>
            )}

            {/* CSS for row-actions visibility */}
            <style jsx>{`
        tr:hover .row-actions { opacity: 1 !important; }
      `}</style>

        </div>
    );
}

function AuditLine({ user, action, time }: any) {
    return (
        <div style={{ borderBottom: '1px solid #222', paddingBottom: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600 }}>{action}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Executado por: <span style={{ color: 'white' }}>{user}</span></p>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginTop: '4px' }}>{time}</p>
        </div>
    );
}
