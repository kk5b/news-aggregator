import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bookmark, Settings, Sun, Moon, PanelLeftClose, LogOut, X } from 'lucide-react';
import { ThemeContext } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen, isMobile = false }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { logout } = useAuth();

    if (isMobile) {
        return (
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 left-0 h-full w-64 bg-background z-50 flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img src="/logo.svg" alt="NewsAgg Logo" className="h-8 w-8" />
                                    <h1 className="text-xl font-serif font-bold">NewsAgg</h1>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-6 w-6" /></Button>
                            </div>
                            <nav className="mt-4 space-y-1 flex-grow overflow-y-auto">
                                {navItems.map(item => (
                                    <NavLink key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center w-full px-4 py-3 text-sm font-medium border-l-4 ${isActive ? "border-primary bg-primary/10 text-primary dark:bg-primary/20" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                                        <item.icon className="w-5 h-5 mr-4 flex-shrink-0" />
                                        <span className="truncate">{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="p-4 border-t space-y-2">
                                <Button onClick={toggleTheme} variant="outline" className="w-full justify-start">{theme === 'light' ? <Moon className="mr-4 h-4 w-4" /> : <Sun className="mr-4 h-4 w-4" />}Toggle Theme</Button>
                                <Button onClick={logout} variant="destructive" className="w-full justify-start"><LogOut className="mr-4 h-4 w-4" />Logout</Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // --- Desktop Sidebar (The Good Old Style) ---
    return (
        <motion.aside initial={false} animate={{ width: isSidebarOpen ? '16rem' : '5rem' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-background border-r flex-col justify-between hidden md:flex h-screen sticky top-0">
            <div className="flex flex-col flex-grow overflow-hidden">
                <div className={`flex items-center h-16 px-4 flex-shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                                <img src="/logo.svg" alt="NewsAgg Logo" className="h-9 w-9" />
                                <span className="text-xl font-serif font-bold truncate">NewsAgg</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-muted" aria-label="Toggle Sidebar">
                        <PanelLeftClose />
                    </button>
                </div>
                <nav className="mt-4 space-y-1 flex-grow overflow-y-auto">
                    {navItems.map(item => (
                        <NavLink key={item.name} to={item.path} className={({ isActive }) => `flex items-center w-full px-4 py-3 text-sm font-medium border-l-4 ${!isSidebarOpen && "justify-center"} ${isActive ? "border-primary bg-primary/10 text-primary dark:bg-primary/20" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen && "mr-4"}`} />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="truncate">{item.name}</motion.span>}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="p-4 flex-shrink-0 border-t space-y-2">
                <motion.button onClick={toggleTheme} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full flex items-center p-2 rounded-lg bg-muted/50 hover:bg-muted ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'}`} aria-label="Toggle Theme">
                    {theme === 'light' ? <Moon className={`h-4 w-4 ${isSidebarOpen && 'mr-4'}`} /> : <Sun className={`h-4 w-4 ${isSidebarOpen && 'mr-4'}`} />}
                    <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Toggle Theme</motion.span>}</AnimatePresence>
                </motion.button>
                <motion.button onClick={logout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full flex items-center p-2 rounded-lg text-destructive bg-destructive/10 hover:bg-destructive/20 ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'}`} aria-label="Logout">
                    <LogOut className={`h-4 w-4 ${isSidebarOpen && 'mr-4'}`} />
                    <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>}</AnimatePresence>
                </motion.button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;