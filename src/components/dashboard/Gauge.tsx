'use client';

interface GaugeProps {
    title: string;
    value: number; // 0 to 100
    label?: string;
    color?: string;
    subValue?: string;
}

export default function Gauge({ title, value, label, color = 'var(--primary)', subValue }: GaugeProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</h4>
                {subValue && <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{subValue}</span>}
            </div>

            <div style={{ position: 'relative', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', marginTop: '4px' }}>
                <div
                    style={{
                        width: `${clampedValue}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '6px',
                        transition: 'width 1s ease-out',
                        boxShadow: `0 0 15px ${color}44`
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{value}%</span>
                {label && <span style={{ fontSize: '12px', color: clampedValue > 100 ? 'var(--danger)' : 'var(--text-secondary)' }}>{label}</span>}
            </div>
        </div>
    );
}
