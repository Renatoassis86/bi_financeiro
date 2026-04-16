'use client';

import {
  TrendingUp, TrendingDown, Activity, Zap, Target, PieChart as PieIcon,
  Calculator, ListTree, ArrowRightLeft, CreditCard,
  Building2, Users, FileText, BarChart3, Globe,
  MoreHorizontal, ChevronRight, LayoutDashboard, Calendar, Brain,
  Landmark, BookOpen, SearchCode, ShieldCheck, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie,
  LineChart, Line
} from 'recharts';
import { useGlobalFilters } from '@/contexts/GlobalFilterContext';

// --- DATA MODEL (DUMMY BI INSIGHTS) ---
const PERFORMANCE_DATA = [
  { name: 'Jan', receita: 4200, meta: 3800, ebitda: 1400, despesa: 2400 },
  { name: 'Fev', receita: 3500, meta: 3800, ebitda: 1100, despesa: 2100 },
  { name: 'Mar', receita: 5400, meta: 4200, ebitda: 1900, despesa: 2800 },
  { name: 'Abr', receita: 4800, meta: 4200, ebitda: 1600, despesa: 2300 },
  { name: 'Mai', receita: 6200, meta: 5000, ebitda: 2200, despesa: 2900 },
  { name: 'Jun', receita: 7500, meta: 5500, ebitda: 2800, despesa: 3200 },
  { name: 'Jul', receita: 6800, meta: 5800, ebitda: 2500, despesa: 3100 },
  { name: 'Ago', receita: 7200, meta: 6000, ebitda: 2700, despesa: 3300 },
  { name: 'Set', receita: 8100, meta: 6200, ebitda: 3100, despesa: 3500 },
  { name: 'Out', receita: 7900, meta: 6500, ebitda: 2900, despesa: 3450 },
  { name: 'Nov', receita: 8500, meta: 6800, ebitda: 3300, despesa: 3800 },
  { name: 'Dez', receita: 9200, meta: 7200, ebitda: 3600, despesa: 4100 },
];

const REVENUE_COMPOSITION = [
  { name: 'Mensalidades', value: 45, color: 'var(--primary)' },
  { name: 'Serviços', value: 25, color: 'var(--accent-gold)' },
  { name: 'Produtos', value: 15, color: 'var(--accent-azure)' },
  { name: 'Outros', value: 15, color: 'var(--accent-slate)' },
];

export default function DashboardExecutivo() {
  const { filters } = useGlobalFilters();

  return (
    <div className="reveal space-y-16 w-full pb-20 max-w-[1600px] mx-auto">

      {/* 1. TOP HEADER (SPACIOUS) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
            <span className="text-caption text-[var(--primary)] text-sm">Monitoramento de Performance Gerencial</span>
          </div>
          <h1 className="h1">Dashboard <span className="text-[var(--primary)]">Estratégico</span></h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl font-medium">
            Consolidado de KPIs, fluxo de caixa e análise multidimensional para suporte à decisão executiva.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="card !py-4 !px-8 border-dashed flex items-center gap-6 bg-white/[0.02]">
            <div>
              <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest leading-none">Status de Auditoria</p>
              <p className="text-sm font-black text-[var(--success)] mt-2">DADOS CONCILIADOS</p>
            </div>
            <ShieldCheck className="text-[var(--success)]" size={24} />
          </div>
          <button className="btn btn-primary !px-12 !font-black !text-xs group shadow-xl">
            SINCRONIZAR BI <ChevronRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. KPI GRID (HIGH CONTRAST & AIRY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { label: 'RECEITA LÍQUIDA', val: 'R$ 8.52M', trend: '+14.2%', icon: TrendingUp, color: 'var(--primary)' },
          { label: 'EBITDA OPERACIONAL', val: 'R$ 1.15M', trend: '+5.4%', icon: Zap, color: 'var(--accent-azure)' },
          { label: 'MARGEM LÍQUIDA', val: '22.8%', trend: '+1.1%', icon: Target, color: 'var(--success)' },
          { label: 'OPEX / CAPEX', val: '3.42x', trend: '-2.5%', icon: Activity, color: 'var(--accent-gold)' },
        ].map((kpi, idx) => (
          <div key={idx} className="card group bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
            <div className="flex justify-between items-center mb-8">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[var(--primary)]/10 transition-colors">
                <kpi.icon size={24} style={{ color: kpi.color }} />
              </div>
              <span className={`text-xs font-black p-2 rounded-lg bg-white/5 ${kpi.trend.startsWith('+') ? 'text-[var(--success)]' : 'text-[var(--text-disabled)]'}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">{kpi.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. MAIN ANALYTICS ROW (SPACIOUS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="card h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="h3">Performance Multidimensional</h3>
                <p className="text-sm font-medium text-[var(--text-disabled)] mt-2">Projeção YTD vs Realizado vs Meta</p>
              </div>
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                  <span className="text-[10px] font-black text-white/60 uppercase">Real</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--accent-azure)]" />
                  <span className="text-[10px] font-black text-white/60 uppercase">Alvo</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} axisLine={false} tickLine={false} dy={15} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '800' }}
                  />
                  <Area type="monotone" dataKey="receita" stroke="var(--primary)" strokeWidth={4} fill="url(#chartColor)" />
                  <Line type="monotone" dataKey="meta" stroke="var(--accent-azure)" strokeWidth={3} dot={{ r: 5, fill: 'var(--bg-card)', stroke: 'var(--accent-azure)', strokeWidth: 3 }} strokeDasharray="8 6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="card h-[340px] flex flex-col items-center">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-10">Resumo de Receita</h4>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={REVENUE_COMPOSITION} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {REVENUE_COMPOSITION.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-8 w-full border-t border-white/5 pt-6">
              {REVENUE_COMPOSITION.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-[var(--text-disabled)] uppercase truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card h-[210px] relative overflow-hidden flex flex-col justify-center gap-6 border-l-4 border-l-[var(--primary)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                <Brain className="text-[var(--primary)]" size={28} />
              </div>
              <div>
                <h5 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-widest">Predicção de Fluxo</h5>
                <p className="text-sm font-medium text-white/80 mt-2 leading-relaxed">
                  Cenário otimista com <strong className="text-white">ROI de 22%</strong> para expansão da infraestrutura bibliotecária em Q3.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
