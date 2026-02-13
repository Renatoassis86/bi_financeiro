'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'CONTROLADORIA' | 'OPERACIONAL' | 'GESTOR_FRENTE' | 'GESTOR_CC' | 'LEITOR';

interface User {
    id: string;
    nome: string;
    role: UserRole;
    frontRestrito?: string;
    ccRestrito?: string[];
}

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
    user: User;
    setUser: (user: User) => void;
};

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(undefined);

const MOCK_USER: User = {
    id: 'u-001',
    nome: 'Admin User',
    role: 'ADMIN',
};

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(MOCK_USER);
    const [filters, setFilters] = useState<FilterState>({
        year: 2026,
        month: 2,
        front: 'CONSOLIDADO',
        product: 'TODOS',
        viewType: 'COMPETENCIA',
    });

    // RBAC: Logic to enforce restrictions on filters
    const updateFilters = (newFilters: React.SetStateAction<FilterState>) => {
        setFilters((prev) => {
            const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;

            // If Gestor de Frente, overwrite front to their specific front
            if (user.role === 'GESTOR_FRENTE' && user.frontRestrito) {
                updated.front = user.frontRestrito;
            }

            return updated;
        });
    };

    return (
        <GlobalFilterContext.Provider value={{ filters, setFilters: updateFilters, user, setUser }}>
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
