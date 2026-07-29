import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Globe, Menu, Search, UserPlus, LogIn, X, LogOut, LayoutDashboard } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center">
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
              <nav className="flex items-center gap-6">
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

              <div className="h-6 w-px bg-neutral-200"></div>

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
                    <Link to={user?.role === 'admin' || user?.role === 'manager' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-indigo-600 transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-rose-600 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
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

            {/* Mobile menu button */}
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
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 py-4 px-4 shadow-lg absolute w-full">
            <nav className="flex flex-col gap-4 mb-6">
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
