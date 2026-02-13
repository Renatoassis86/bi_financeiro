'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type FilterState = {
    year: number;
    month: number;
    front: string; // 'CONSOLIDADO' | 'PAIDEIA' | 'OIKOS' | 'BIBLOS'
    product: string;
    viewType: 'COMPETENCIA' | 'CAIXA';
};

type GlobalFilterContextType = {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(undefined);

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({
        year: 2026,
        month: 2,
        front: 'CONSOLIDADO',
        product: 'TODOS',
        viewType: 'COMPETENCIA',
    });

    return (
        <GlobalFilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </GlobalFilterContext.Provider>
    );
}

export function useGlobalFilters() {
    const context = useContext(GlobalFilterContext);
    if (!context) {
        throw new Error('useGlobalFilters must be used within a GlobalFilterProvider');
    }
    return context;
}
