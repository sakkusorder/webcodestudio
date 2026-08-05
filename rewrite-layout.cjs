const fs = require('fs');

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// We need to add sidebarOpen state and the Global Sidebar
// Replace lucide-react imports
content = content.replace(
  "import { Globe, Menu, Search, UserPlus, LogIn, X, LogOut, LayoutDashboard } from 'lucide-react';",
  "import { Globe, Menu, Search, UserPlus, LogIn, X, LogOut, LayoutDashboard, Package, History, Bell, HelpCircle, ChevronRight } from 'lucide-react';"
);

// Replace useState
content = content.replace(
  "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);",
  "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [sidebarOpen, setSidebarOpen] = useState(false);"
);

// Replace Left: Logo
content = content.replace(
  "{/* Left: Logo */}\n            <div className=\"flex-shrink-0 flex items-center\">",
  `{/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center gap-4">
              {isAuthenticated && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 -ml-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}`
);

// Wrap navigation in !isAuthenticated
content = content.replace(
  /<nav className="flex items-center gap-6">[\s\S]*?<\/nav>/,
  `{!isAuthenticated && (
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
              )}`
);

content = content.replace(
  /<div className="h-6 w-px bg-neutral-200"><\/div>/,
  `{!isAuthenticated && <div className="h-6 w-px bg-neutral-200"></div>}`
);

// Replace authenticated actions
content = content.replace(
  /{isAuthenticated \? \([\s\S]*?\) : \(/,
  `{isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                      onClick={() => setSidebarOpen(true)}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                ) : (`
);

// Wrap mobile menu button
content = content.replace(
  /{([^]*?){\/\* Mobile menu button \*\/}/,
  `{$1{!isAuthenticated && (\n            {/* Mobile menu button */}`
);
content = content.replace(
  /(\{\/\* Mobile menu button \*\/}[\s\S]*?<\/div>)/,
  `$1\n            )}`
);

content = content.replace(
  /{mobileMenuOpen && \(/,
  `{!isAuthenticated && mobileMenuOpen && (`
);

// Add Sidebar
const sidebarCode = `
      {/* Global Sidebar for Authenticated Users */}
      {isAuthenticated && (
        <>
          {/* Overlay */}
          <div 
            className={\`fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300 \${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className={\`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
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
`;

content = content.replace(
  /<\/header>/,
  `</header>\n${sidebarCode}`
);

fs.writeFileSync('src/components/Layout.tsx', content);
