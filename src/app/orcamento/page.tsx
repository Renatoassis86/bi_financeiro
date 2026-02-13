'use client';

export default function OrcamentoPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Planejamento Orçamentário 2026</h1>
                    <p className="text-body">Definição de metas e alocação de recursos</p>
                </div>
                <button className="btn btn-primary">Novo Orçamento</button>
            </div>

            {/* Filters Area */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <select style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'white', padding: '8px 16px', borderRadius: '6px' }}>
                    <option>Todos Centros de Custo</option>
                    <option>Marketing</option>
                    <option>RH</option>
                </select>
                <select style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'white', padding: '8px 16px', borderRadius: '6px' }}>
                    <option>Todas Frentes</option>
                    <option>Paideia</option>
                    <option>Oikos</option>
                    <option>Biblos</option>
                </select>
            </div>

            {/* Table Area */}
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '16px' }}>Categoria / Conta</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Jan</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Fev</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Mar</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Total Q1</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>Receitas Operacionais</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 450.000</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 480.000</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 500.000</td>
                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>R$ 1.430.000</td>
                        </tr>
                        {/* Sub rows */}
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 16px', paddingLeft: '32px' }}>Mensalidades (Paideia)</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 200.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 210.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 215.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 625.000</td>
                        </tr>

                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '16px', fontWeight: 600, color: 'var(--danger)' }}>Despesas Operacionais</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 380.000</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 390.000</td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ 400.000</td>
                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>R$ 1.170.000</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px 16px', paddingLeft: '32px' }}>Pessoal e Encargos</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 250.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 250.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 250.000</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>R$ 750.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
