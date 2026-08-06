import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, Globe, Tags, ShoppingCart, CheckCircle, 
  Users, MessageSquare, LifeBuoy, Star, Receipt, FileText, 
  FolderKanban, Bell, Image as ImageIcon, LayoutTemplate, 
  FolderOpen, FileEdit, HelpCircle, BarChart, Settings, 
  User as UserIcon, LogOut, Search, Menu, X, Clock
} from 'lucide-react';

import { DashboardOverview } from './admin/DashboardOverview';
import { Websites } from './admin/Websites';
import { Categories } from './admin/Categories';
import { Orders } from './admin/Orders';
import { Clients as UsersAdmin } from './admin/Clients';
import { Support } from './admin/Support';
import { Payments } from './admin/Payments';
import { Installments } from './admin/Installments';
import { Notifications } from './admin/Notifications';
import { Reports } from './admin/Reports';
import { Homepage } from './admin/Homepage';
import { Settings as AdminSettings } from './admin/Settings';



export function AdminDashboard() {
  const { t, language, setLanguage } = useLanguage();
  
  const SIDEBAR_MENU: any[] = [
    { id: 'dashboard', path: '', icon: LayoutDashboard, label: t('admin.dashboard') },
    { id: 'users', path: 'users', icon: Users, label: t('admin.users') },
    { id: 'categories', path: 'categories', icon: Tags, label: t('admin.website_categories') },
    { id: 'websites', path: 'websites', icon: Globe, label: t('admin.website_management') },
    { id: 'orders', path: 'orders', icon: ShoppingCart, label: t('admin.orders') },
    { id: 'payments', path: 'payments', icon: Receipt, label: t('admin.payments') },
    { id: 'installments', path: 'installments', icon: Clock, label: t('admin.installments') },
    { id: 'support', path: 'support', icon: LifeBuoy, label: t('admin.support_tickets') },
    { id: 'notifications', path: 'notifications', icon: Bell, label: t('admin.notifications') },
    { id: 'settings', path: 'settings', icon: Settings, label: t('admin.settings') },
  ];

  const navigate = useNavigate();
  const { signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('wcs_admin_access');
    await signOut();
    navigate('/');
  };

  const currentPath = location.pathname.replace('/admin', '').replace('/', '');

  return (
    <div className="min-h-screen flex bg-neutral-50 -mt-20">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-neutral-900 text-neutral-400 w-[280px] shrink-0 flex flex-col transition-all fixed lg:sticky top-0 h-screen z-50",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !isSidebarOpen && "lg:-translate-x-full lg:absolute"
      )}>
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">W</div>
            <span className="truncate">Web Code Studio</span>
          </div>
          <button className="lg:hidden p-1 text-neutral-400 hover:text-white" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-1 px-3">
            {SIDEBAR_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (currentPath === '' && item.path === '');
              return (
                <Link
                  key={item.id}
                  to={`/admin${item.path ? `/${item.path}` : ''}`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors group text-sm",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                      : "hover:bg-neutral-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", isActive ? "text-indigo-200" : "text-neutral-500 group-hover:text-neutral-400")} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isActive ? "bg-white text-indigo-600" : "bg-rose-500 text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 text-neutral-500" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pt-20 transition-all",
        !isSidebarOpen && "lg:ml-0"
      )}>
        
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsMobileSidebarOpen(true);
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 capitalize tracking-tight hidden sm:block">
              {SIDEBAR_MENU.find(m => m.path === currentPath || (currentPath === '' && m.path === ''))?.label || t('admin.dashboard')}
            </h1>
          </div>
          
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg text-sm transition-colors"
            >
              {language === 'en' ? 'বাংলা' : 'English'}
            </button>

            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search everywhere..." 
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => setShowSearchResults(globalSearch.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all" 
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden z-50">
                  <div className="p-3">
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Search Results</div>
                    <div className="text-sm text-neutral-500 py-2 text-center">Press Enter to search across all modules for "{globalSearch}"</div>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/admin/notifications" className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </Link>
            
            <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-neutral-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">
                A
              </div>
              <div className="hidden sm:block text-sm">
                <div className="font-bold text-neutral-900">Admin</div>
                <div className="text-neutral-500 text-xs font-medium">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 sm:p-8 pb-24 max-w-[1600px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<UsersAdmin />} />
            <Route path="/support" element={<Support />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/installments" element={<Installments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
