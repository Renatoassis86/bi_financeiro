'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    trend: number;
    trendLabel: string;
    isPositive?: boolean;
}

export default function MetricCard({ title, value, trend, trendLabel, isPositive = true }: MetricCardProps) {
    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--border-radius)',
            padding: '24px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</h3>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px' }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{
                    color: isPositive ? 'var(--success)' : 'var(--danger)',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontWeight: 600,
                    backgroundColor: isPositive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                }}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </span>
                <span style={{ color: 'var(--text-disabled)' }}>{trendLabel}</span>
            </div>
        </div>
    )
}
