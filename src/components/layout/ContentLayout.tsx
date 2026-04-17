'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-wrapper">
            {/* 1. Sidebar (Fixed Left) */}
            <div className="sidebar-container">
                <Sidebar />
            </div>

            {/* 2. Main Viewport (Right Column) */}
            <div className="main-viewport">
                {/* 3. Topbar (Header Integration) */}
                <Topbar />

                {/* 4. Scrollable Data Area */}
                <main className="scroll-area custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
