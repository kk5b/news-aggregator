// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { setupAxiosInterceptors } from '@/utils/axiosInterceptor';
import axiosInstance from '@/utils/axiosInstance';

const MainLayout = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const { logout } = useAuth();

    useEffect(() => {
        setupAxiosInterceptors(axiosInstance, logout);
    }, [logout]);

    useEffect(() => {
        setSidebarOpen(isDesktop);
    }, [isDesktop]);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={!isDesktop} />
            <main className="flex-1 flex flex-col">
                {!isDesktop && (
                    <header className="flex items-center justify-between p-4 border-b bg-background md:hidden">
                        <h1 className="text-xl font-serif font-bold">NewsAgg</h1>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                            <PanelLeft className="h-6 w-6" />
                        </Button>
                    </header>
                )}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
            <Toaster richColors position="top-right" />
        </div>
    );
};

export default MainLayout;
