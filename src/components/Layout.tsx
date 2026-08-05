import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Globe, Menu, Search, UserPlus, LogIn, X, LogOut, LayoutDashboard, Package, History, Bell, HelpCircle, ChevronRight } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center gap-4">
              {isAuthenticated && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 -ml-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <span className="text-lg">W</span>
                </div>
                Web Code Studio
              </Link>
            </div>
            
            {/* Center: Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-full leading-5 bg-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder={t('nav.search')}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {!isAuthenticated && (
                <nav className="flex items-center gap-6">
                  <Link to="/showcase" className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
                    Showcase
                  </Link>
                  <Link to="/templates" className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
                    {t('nav.templates')}
                  </Link>
                  <Link to="/dashboard" className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/todos" className="text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
                    Todos
                  </Link>
                </nav>
              )}

              {!isAuthenticated && <div className="h-6 w-px bg-neutral-200"></div>}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer">
                  <Globe className="w-4 h-4 text-neutral-600" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                    className="bg-transparent border-none text-sm font-bold text-neutral-700 focus:ring-0 cursor-pointer outline-none appearance-none pr-4"
                  >
                    <option value="en">EN</option>
                    <option value="bn">BN</option>
                  </select>
                </div>
                
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                      onClick={() => setSidebarOpen(true)}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to="/auth" state={{ from: location }} className="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-indigo-600 transition-colors px-2">
                      <LogIn className="w-4 h-4" />
                      {t('nav.login')}
                    </Link>
                    <Link to="/auth" state={{ from: location }} className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                      <UserPlus className="w-4 h-4" />
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>

            {!isAuthenticated && (
            <div className="lg:hidden flex items-center gap-4">
               <button className="text-neutral-500 hover:text-neutral-900">
                  <Search className="w-6 h-6" />
                </button>
              <button 
                className="text-neutral-700 hover:text-indigo-600 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isAuthenticated && mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 py-4 px-4 shadow-lg absolute w-full">
            <nav className="flex flex-col gap-4 mb-6">
              <Link to="/showcase" className="text-base font-semibold text-neutral-700 hover:text-indigo-600">
                Showcase
              </Link>
              <Link to="/templates" className="text-base font-semibold text-neutral-700 hover:text-indigo-600">
                {t('nav.templates')}
              </Link>
              <Link to="/dashboard" className="text-base font-semibold text-neutral-700 hover:text-indigo-600">
                {t('nav.dashboard')}
              </Link>
              <Link to="/todos" className="text-base font-semibold text-neutral-700 hover:text-indigo-600">
                Todos
              </Link>
            </nav>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-neutral-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                  className="bg-neutral-100 border-none text-sm font-bold rounded-lg px-3 py-2 text-neutral-700 focus:ring-0 w-full"
                >
                  <option value="en">English (EN)</option>
                  <option value="bn">বাংলা (BN)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to={user?.role === 'admin' || user?.role === 'manager' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-4 py-3 rounded-xl">
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-3 rounded-xl transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" state={{ from: location }} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-4 py-3 rounded-xl transition-colors">
                      {t('nav.login')}
                    </Link>
                    <Link to="/auth" state={{ from: location }} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl transition-colors">
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Sidebar for Authenticated Users */}
      {isAuthenticated && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-sm">{user?.name || 'Customer'}</div>
                  <div className="text-xs font-semibold text-neutral-500">Premium Member</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link to="/templates" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors">
                <Globe className="w-5 h-5" />
                ওয়েবসাইট দেখুন
              </Link>
              <Link to="/dashboard?tab=orders" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors group">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  আমার অর্ডার
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/dashboard?tab=history" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors group">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5" />
                  পেমেন্ট হিস্টরি
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/dashboard?tab=notifications" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors group">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  নোটিফিকেশন
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/dashboard?tab=support" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5" />
                  সাপোর্ট
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>

            <div className="p-4 border-t border-neutral-100">
              <button 
                onClick={() => { handleLogout(); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                লগআউট
              </button>
            </div>
          </div>
        </>
      )}


      <main className="flex-grow">{children}</main>

      <footer className="bg-white border-t border-neutral-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="text-neutral-500 text-sm">
            {t('footer.rights')}
          </div>
          <div className="text-[#666666] font-normal text-[12px] mt-1">
            Developed by <span onClick={() => navigate('/wcs-admin-verify')} className="cursor-pointer">Web Code Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
