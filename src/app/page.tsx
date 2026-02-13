import MetricCard from '@/components/dashboard/MetricCard';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Visão Geral Executiva</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Acompanhamento consolidado de todas as frentes</p>
        </div>
        <button className="btn btn-primary">
          Exportar Relatório PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <MetricCard title="Saldo Atual" value="R$ 1.250.000" trend={12.5} trendLabel="vs mês anterior" />
        <MetricCard title="Receita Mensal" value="R$ 450.000" trend={5.2} trendLabel="vs meta" />
        <MetricCard title="Despesa Mensal" value="R$ 380.000" trend={-2.4} trendLabel="vs orçamento" isPositive={false} />
        <MetricCard title="Resultado Líquido" value="R$ 70.000" trend={8.0} trendLabel="Margem 15.5%" />
      </div>

      {/* Main Charts Area */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px', height: '400px' }}>

        {/* Fluxo de Caixa Mockup */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 className="text-h3">Fluxo de Caixa (Mensal)</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span> Receita
              </span>
              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></span> Despesa
              </span>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', paddingBottom: '10px' }}>
            {/* Simple CSS Bar Chart Mockup */}
            {[60, 40, 70, 50, 80, 60, 90, 55, 75, 60, 85, 45].map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'flex-end', flex: 1 }}>
                <div style={{ height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                <div style={{ height: `${h * 0.7}%`, background: 'var(--danger)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                <span style={{ fontSize: '10px', textAlign: 'center', color: 'var(--text-disabled)', marginTop: '4px' }}>M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Front */}
        <div className="card">
          <h3 className="text-h3" style={{ marginBottom: '20px' }}>Distribuição por Frente</h3>
          <div style={{
            height: '200px',
            borderRadius: '50%',
            background: 'conic-gradient(var(--secondary) 0% 40%, var(--warning) 40% 70%, var(--success) 70% 100%)',
            margin: '0 auto',
            width: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '140px', height: '140px', background: 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-h2">Total</span>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="badge badge-paideia">Paideia (40%)</span>
              <span style={{ fontWeight: 600 }}>R$ 180k</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="badge badge-oikos">Oikos (30%)</span>
              <span style={{ fontWeight: 600 }}>R$ 135k</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="badge badge-biblos">Biblos (30%)</span>
              <span style={{ fontWeight: 600 }}>R$ 135k</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alerts Row */}
      <div className="card">
        <h3 className="text-h3" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--warning)" />
          Alertas de Controladoria
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { text: "Despesa de Marketing acima do orçado em 15% - Frente Paideia", date: "Hoje, 10:30" },
            { text: "Novo Centro de Custo criado aguardando aprovação", date: "Ontem, 16:45" },
            { text: "Fluxo de Caixa projetado negativo para 15/03", date: "12/02/2026" }
          ].map((alert, i) => (
            <div key={i} style={{
              padding: '16px',
              borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px' }}>{alert.text}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{alert.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
