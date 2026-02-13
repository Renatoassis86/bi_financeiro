'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import MetricCard from '@/components/dashboard/MetricCard';
import Gauge from '@/components/dashboard/Gauge';
import { AlertTriangle, TrendingUp, TrendingDown, Wallet, Clock, Zap } from 'lucide-react';

const cashFlowData = [
  { name: 'Set', previsto: 4000, realizado: 3800 },
  { name: 'Out', previsto: 4500, realizado: 4200 },
  { name: 'Nov', previsto: 4200, realizado: 4600 },
  { name: 'Dez', previsto: 5000, realizado: 4900 },
  { name: 'Jan', previsto: 4800, realizado: 5100 },
  { name: 'Fev', previsto: 5200, realizado: 4800 },
];

const revenueBySource = [
  { name: 'Mensalidades', value: 280000 },
  { name: 'Doações', value: 120000 },
  { name: 'Eventos', value: 45000 },
  { name: 'Vendas', value: 32000 },
];

const expenseByCategory = [
  { name: 'Pessoal', value: 180000, color: '#2979FF' },
  { name: 'Infra', value: 65000, color: '#FFAB00' },
  { name: 'Marketing', value: 34000, color: '#00E676' },
  { name: 'Operacional', value: 42000, color: '#FF1744' },
];

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 1. Header & Summary Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-h1">Dashboard Executivo</h1>
          <p className="text-body">Visão consolidada do ecossistema financeiro</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={18} color="var(--warning)" />
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Runway Estimado</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>14 Meses</p>
            </div>
          </div>
          <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={18} color="var(--secondary)" />
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Burn Rate (Avg)</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>R$ 42.5k</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <MetricCard title="Receita Realizada (Mês)" value="R$ 457.2k" trend={5.2} trendLabel="vs meta" />
        <MetricCard title="Receita Realizada (YTD)" value="R$ 2.8M" trend={8.1} trendLabel="vs 2024" />
        <MetricCard title="Despesa Realizada (Mês)" value="R$ 382.1k" trend={-2.4} trendLabel="vs orçado" isPositive={false} />
        <MetricCard title="Caixa Atual" value="R$ 1.15M" trend={1.5} trendLabel="Liquidez imediata" />
      </div>

      {/* 3. Thermometers Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="text-h3">Termômetros de Execução</h3>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Gauge title="Arrecadação vs Meta (Mês)" value={94} label="R$ 457k / R$ 480k" color="var(--primary)" />
          <Gauge title="Gastos vs Orçado (Mês)" value={82} label="R$ 382k / R$ 465k" color="var(--secondary)" />
          <div className="card" style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Execução por Frente (%)</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', marginBottom: '8px', color: 'var(--text-disabled)' }}>Paideia</p>
                <div style={{ height: '6px', background: '#222', borderRadius: '3px' }}><div style={{ width: '88%', height: '100%', background: 'var(--secondary)', borderRadius: '3px' }}></div></div>
                <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>88%</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', marginBottom: '8px', color: 'var(--text-disabled)' }}>Oikos</p>
                <div style={{ height: '6px', background: '#222', borderRadius: '3px' }}><div style={{ width: '72%', height: '100%', background: 'var(--warning)', borderRadius: '3px' }}></div></div>
                <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>72%</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', marginBottom: '8px', color: 'var(--text-disabled)' }}>Biblos</p>
                <div style={{ height: '6px', background: '#222', borderRadius: '3px' }}><div style={{ width: '95%', height: '100%', background: 'var(--success)', borderRadius: '3px' }}></div></div>
                <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>95%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Charts Grid */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

        {/* Fluxo de Caixa Previsto x Realizado */}
        <div className="card">
          <h3 className="text-h3" style={{ marginBottom: '24px' }}>Fluxo de Caixa: Previsto x Realizado</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="realizado" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="previsto" stroke="#444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Receita por Modalidade */}
        <div className="card">
          <h3 className="text-h3" style={{ marginBottom: '24px' }}>Receita por Fonte</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBySource} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#AAA" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }} />
                <Bar dataKey="value" fill="var(--secondary)" radius={[0, 4, 4, 0]} barSize={20}>
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'var(--secondary)'} opacity={1 - index * 0.2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Alerts & Categories Bottom Row */}
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '32px' }}>

        {/* Painel de Alertas */}
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <AlertTriangle size={20} color="var(--warning)" />
            <h3 className="text-h3">Alertas de Controladoria</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AlertItem icon={<TrendingDown size={14} />} text="Receitas Paideia abaixo de 12% do previsto" color="var(--danger)" />
            <AlertItem icon={<Wallet size={14} />} text="Centro de Custo 'Marketing' acima de 105% do orçado" color="var(--warning)" />
            <AlertItem icon={<Clock size={14} />} text="Contas a receber vencidas: R$ 12.430 (Frente Oikos)" color="var(--danger)" />
            <AlertItem icon={<Zap size={14} />} text="Concentração: Mensalidades representam 62% da receita" color="var(--secondary)" />
          </div>
        </div>

        {/* Despesas por Categoria */}
        <div className="card">
          <h3 className="text-h3" style={{ marginBottom: '20px' }}>Despesa por Categoria</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart padding={{ top: 0, bottom: 0 }}>
                  <Pie data={expenseByCategory} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expenseByCategory.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>R$ {(item.value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function AlertItem({ icon, text, color }: { icon: any, text: string, color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      fontSize: '13px'
    }}>
      <div style={{ color }}>{icon}</div>
      <span style={{ color: 'var(--text-primary)' }}>{text}</span>
    </div>
  );
}
