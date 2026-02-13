'use client';

import { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Target,
  Users, Activity, Wallet, ArrowUpRight, ArrowDownRight,
  Filter, Calendar, Download, RefreshCw, BarChart2,
  PieChart as PieIcon, LayoutDashboard, Building2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { useGlobalFilters } from '@/contexts/GlobalFilterContext';

// --- MOCK DATA ---

const PERFORMANCE_DATA = [
  { month: 'Jan', orçado: 400000, realizado: 380000 },
  { month: 'Fev', orçado: 420000, realizado: 410000 },
  { month: 'Mar', orçado: 450000, realizado: 480000 },
  { month: 'Abr', orçado: 430000, realizado: 415000 },
  { month: 'Mai', orçado: 480000, realizado: 500000 },
  { month: 'Jun', orçado: 510000, realizado: 490000 },
];

const REVENUE_BY_FRONT = [
  { name: 'PAIDEIA', value: 350000, color: 'var(--primary)' },
  { name: 'OIKOS', value: 120000, color: 'var(--secondary)' },
  { name: 'BIBLOS', value: 85000, color: '#FFD600' },
];

const EXPENSE_CATEGORIES = [
  { category: 'Pessoal', value: 45 },
  { category: 'Pedagógico', value: 25 },
  { category: 'Infra', value: 15 },
  { category: 'Marketing', value: 10 },
  { category: 'Outros', value: 5 },
];

export default function DashboardExecutivo() {
  const { filters, user } = useGlobalFilters();

  const metrics = useMemo(() => ({
    receitaTotal: 580000,
    receitaVariancia: +4.2,
    despesaTotal: 415000,
    despesaVariancia: -1.8,
    ebitda: 165000,
    ebitdaMargem: 28.4,
    freetCashFlow: 92000,
    execucaoOrcamentaria: 94.5
  }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 1. Header & Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-h1">Consolidado Executivo</h1>
          <p className="text-body">Visão 360º da Saúde Financeira — {filters.front}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderRadius: '12px', border: '1px solid #1A1A1A' }}>
            <Activity size={14} color="var(--success)" className="animate-pulse" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Live Data</span>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Exportar Board
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (Cards) */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <MetricCard
          label="Receita Operacional"
          value={`R$ ${metrics.receitaTotal.toLocaleString()}`}
          trend={metrics.receitaVariancia}
          icon={<TrendingUp size={18} />}
          color="var(--primary)"
        />
        <MetricCard
          label="Despesa Consolidada"
          value={`R$ ${metrics.despesaTotal.toLocaleString()}`}
          trend={metrics.despesaVariancia}
          icon={<TrendingDown size={18} />}
          color="var(--danger)"
          inverseTrend
        />
        <MetricCard
          label="EBITDA (Gerencial)"
          value={`R$ ${metrics.ebitda.toLocaleString()}`}
          sublabel={`${metrics.ebitdaMargem}% Margem`}
          icon={<Activity size={18} />}
          color="var(--secondary)"
        />
        <MetricCard
          label="Execução Orçamentária"
          value={`${metrics.execucaoOrcamentaria}%`}
          sublabel="Dentro do Limite"
          icon={<Target size={18} />}
          color="#FFD600"
        />
      </div>

      {/* 3. Main Charts Area */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Trend Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Performance Real v Planned</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Comparativo de competência acumulada</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '2px' }} /> Realizado</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} /> Orçado</div>
            </div>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="month" stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090909', border: '1px solid #222', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="orçado" stroke="#333" fill="rgba(255,255,255,0.02)" strokeWidth={2} />
                <Area type="monotone" dataKey="realizado" stroke="var(--primary)" fillOpacity={1} fill="url(#colorReal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Receita por Frente</h3>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_BY_FRONT}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {REVENUE_BY_FRONT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090909', border: '1px solid #222', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Total</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 555k</p>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {REVENUE_BY_FRONT.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <div style={{ width: '8px', height: '8px', background: item.color, borderRadius: '2px' }} />
                  {item.name}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>R$ {(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Secondary Breakdown & Alerts */}
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>Composição de Despesas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {EXPENSE_CATEGORIES.map(ex => (
              <div key={ex.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                  <span>{ex.category}</span>
                  <span style={{ color: 'var(--text-disabled)' }}>{ex.value}%</span>
                </div>
                <div style={{ height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: ex.value + '%', height: '100%', background: 'var(--secondary)' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: '24px', fontSize: '11px', border: '1px solid #1A1A1A' }}>
            Ver Drilldown Analítico <ArrowUpRight size={12} style={{ marginLeft: 6 }} />
          </button>
        </div>

        <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Alertas de Controladoria (High Risk)</h3>
            <span style={{ fontSize: '10px', background: 'rgba(255,171,0,0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>3 Pendentes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AlertRow title="Estouro de Orçamento: Marketing PAIDEIA" desc="Superou +15% do orçado para o Q1 devido a Google Ads." />
            <AlertRow title="Inadimplência Projetada (+5%)" desc="Previsão de aumento em Biblos Educação devido a atrasos bancários." />
            <AlertRow title="Empenho s/ Justificativa" desc="Solicitação EMP-088 aguardando documento de suporte." />
          </div>
        </div>

      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, sublabel, icon, color, inverseTrend }: any) {
  const isPositive = trend > 0;
  const trendColor = inverseTrend
    ? (isPositive ? 'var(--danger)' : 'var(--success)')
    : (isPositive ? 'var(--success)' : 'var(--danger)');

  return (
    <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 'bold', color: trendColor }}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</p>
      <h2 style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px' }}>{value}</h2>
      {sublabel && <p style={{ fontSize: '11px', color: 'var(--text-disabled)', marginTop: '4px' }}>{sublabel}</p>}

      {/* Background Decoration */}
      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.03, color: color }}>
        {icon && <div style={{ transform: 'scale(4)' }}>{icon}</div>}
      </div>
    </div>
  );
}

function AlertRow({ title, desc }: any) {
  return (
    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid #1A1A1A' }}>
      <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>{title}</p>
      <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{desc}</p>
    </div>
  );
}
