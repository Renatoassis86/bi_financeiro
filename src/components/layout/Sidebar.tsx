'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    PieChart,
    ArrowRightLeft,
    Layers,
    ShoppingCart,
    Target,
    Table,
    LineChart,
    Upload,
    Shield,
    Bell,
    Users,
    FileText,
    Settings,
    Briefcase,
    Plus,
    BarChart3
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Fluxo de Caixa', path: '/fluxo-caixa', icon: TrendingUp },
    { name: 'DRE Gerencial', path: '/relatorios/dre', icon: Layers },
    { name: 'Plan. Estratégico', path: '/orcamento/planejamento-estrategico', icon: Target },
    { name: 'Plan. Tático', path: '/orcamento/planejamento-tatico', icon: Table },
    { name: 'Remanejamento', path: '/orcamento/remanejamento', icon: ArrowRightLeft },
    { name: 'Empenho', path: '/empenho', icon: Briefcase },
    { name: 'Suprimentos', path: '/compras', icon: ShoppingCart },
    { name: 'Cadastros', path: '/cadastros', icon: Users },
    { name: 'Alertas', path: '/alertas', icon: Bell },
    { name: 'Forecast', path: '/forecast', icon: LineChart },
    { name: 'Importação', path: '/importacao', icon: Upload },
    { name: 'Segurança', path: '/seguranca', icon: Shield },
    { name: 'Glossário BI', path: '/bi', icon: BarChart3 },
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#050505] border-r border-[#1A1A1A] flex flex-col h-screen fixed">
            <div className="p-6 border-bottom border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <TrendingUp className="text-black" size={24} />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight">Cidade Viva</h1>
                        <p className="text-primary text-[10px] font-bold tracking-widest uppercase">Financeiro ++</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#111] to-[#090909] border border-white/[0.03]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/10 overflow-hidden">
                            <div className="w-full h-full bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Renato')] bg-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">Renato Assis</p>
                            <p className="text-[10px] text-gray-500 truncate">Administrator</p>
                        </div>
                        <Settings size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
                    </div>
                    <button className="w-full h-8 text-[10px] font-bold tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/5">
                        Sair do Sistema
                    </button>
                </div>
            </div>
        </aside>
    );
}
