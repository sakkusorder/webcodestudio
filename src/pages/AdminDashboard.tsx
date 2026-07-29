import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LayoutDashboard, Users, FolderKanban, Receipt, 
  MessageSquare, Settings, CheckCircle, XCircle, Clock,
  LayoutTemplate, Tag, ShoppingCart, Send, FileText, 
  Star, FileEdit, HelpCircle, Home, Bell, LifeBuoy, 
  BarChart, LogOut, ChevronRight, PlusCircle, Search,
  Filter, MoreVertical, Edit, Trash2, Eye, Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SIDEBAR_MENU = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'templates', icon: LayoutTemplate, label: 'Website Templates' },
    { id: 'categories', icon: Tag, label: 'Categories' },
    { id: 'custom_orders', icon: ShoppingCart, label: 'Custom Orders', badge: 2 },
    { id: 'ready_orders', icon: CheckCircle, label: 'Ready Orders' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 5 },
    { id: 'payments', icon: Receipt, label: 'Payments' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'blog', icon: FileEdit, label: 'Blog' },
    { id: 'faq', icon: HelpCircle, label: 'FAQ' },
    { id: 'homepage', icon: Home, label: 'Homepage' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'support', icon: LifeBuoy, label: 'Support Tickets' },
    { id: 'reports', icon: BarChart, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const STATS = [
    { label: 'Total Users', value: '1,248', change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Orders', value: '384', change: '+5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Projects', value: '24', change: '-2%', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: '$45,290', change: '+18%', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const CUSTOM_ORDERS = [
    { id: 'ORD-2091', client: 'John Smith', type: 'Ecommerce', budget: '$2,500', status: 'Pending', date: '10 mins ago' },
    { id: 'ORD-2092', client: 'TechFlow Inc.', type: 'Corporate', budget: '$5,000', status: 'Reviewing', date: '2 hours ago' },
    { id: 'ORD-2093', client: 'Emma Studio', type: 'Portfolio', budget: '$1,200', status: 'Quotation Ready', date: '1 day ago' },
  ];

  const PROJECTS = [
    { id: 'PRJ-1029', name: 'Corporate Website Redesign', client: 'Acme Corp', status: 'Development', progress: 65, due: 'Aug 15' },
    { id: 'PRJ-1030', name: 'E-Commerce App MVP', client: 'TechStart', status: 'Testing', progress: 90, due: 'Jul 30' },
    { id: 'PRJ-1031', name: 'Restaurant Landing Page', client: 'Burger King', status: 'Review', progress: 40, due: 'Aug 05' },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 -mt-20">
      
      {/* Sidebar - Dark */}
      <aside className={cn(
        "bg-neutral-900 text-neutral-400 w-64 shrink-0 flex flex-col transition-all sticky top-0 h-screen z-50",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full absolute md:relative md:translate-x-0"
      )}>
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">W</div>
            Admin
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-1 px-3">
            {SIDEBAR_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors group text-sm",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                      : "hover:bg-neutral-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", isActive ? "text-indigo-200" : "text-neutral-500 group-hover:text-neutral-400")} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isActive ? "bg-white text-indigo-600" : "bg-rose-500 text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 text-neutral-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pt-20">
        
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <h1 className="text-2xl font-black text-neutral-900 capitalize tracking-tight">
            {activeTab.replace('_', ' ')}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Global search..." className="pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
            
            <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                A
              </div>
              <div className="hidden md:block text-sm">
                <div className="font-bold text-neutral-900">Admin User</div>
                <div className="text-neutral-500 text-xs font-medium">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 pb-24">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Website
                </button>
                <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
                  <Tag className="w-4 h-4 text-neutral-400" /> Create Category
                </button>
                <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
                  <Receipt className="w-4 h-4 text-neutral-400" /> Create Invoice
                </button>
                <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
                  <Send className="w-4 h-4 text-neutral-400" /> Send Notification
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                      <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-500 mb-1">{stat.label}</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-black text-neutral-900 leading-none">{stat.value}</div>
                        <div className={cn("text-xs font-bold", stat.change.startsWith('+') ? "text-emerald-600" : "text-rose-600")}>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Custom Orders */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-neutral-900">Recent Custom Orders</h2>
                    <button onClick={() => setActiveTab('custom_orders')} className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto">
                    {CUSTOM_ORDERS.map((order, i) => (
                      <div key={i} className="p-6 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">{order.id}</span>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                              order.status === 'Pending' ? "bg-amber-100 text-amber-700" : order.status === 'Reviewing' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-neutral-900">{order.client}</h3>
                          <p className="text-xs font-medium text-neutral-500">{order.type} • Budget: {order.budget} • {order.date}</p>
                        </div>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-neutral-900">Active Projects</h2>
                    <button onClick={() => setActiveTab('projects')} className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="flex-1 p-6 space-y-6">
                    {PROJECTS.map((project, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-neutral-900">{project.name}</h3>
                            <div className="text-xs font-medium text-neutral-500">{project.client} • Due {project.due}</div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                            project.status === 'Development' ? "bg-purple-100 text-purple-700" : project.status === 'Testing' ? "bg-sky-100 text-sky-700" : "bg-orange-100 text-orange-700"
                          )}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-neutral-700">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TEMPLATES TAB (Example of data table) */}
          {activeTab === 'templates' && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input type="text" placeholder="Search templates..." className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                  <button className="p-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 shadow-sm transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Website
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
                      <tr>
                        <th className="px-6 py-4">Website</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Sales</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="hover:bg-neutral-50/50 transition-colors group">
                          <td className="px-6 py-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                              <img src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=100&h=100`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900">Modern E-commerce</div>
                              <div className="text-xs font-medium text-neutral-500">React, Node.js</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-neutral-600">Ecommerce</td>
                          <td className="px-6 py-4 font-bold text-neutral-900">$299</td>
                          <td className="px-6 py-4 font-medium text-neutral-600">42</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM ORDERS TAB */}
          {activeTab === 'custom_orders' && (
             <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-neutral-900">Custom Website Requests</h2>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-800 transition-colors">Pending (2)</button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-colors">Reviewing</button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-colors">Approved</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CUSTOM_ORDERS.map((order, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex flex-col hover:border-indigo-300 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mb-2">{order.id}</div>
                          <h3 className="font-black text-neutral-900 text-lg">{order.client}</h3>
                          <div className="text-sm font-medium text-neutral-500">{order.date}</div>
                        </div>
                        <MoreVertical className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Type</span>
                          <span className="font-bold text-neutral-900">{order.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Est. Budget</span>
                          <span className="font-bold text-neutral-900">{order.budget}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Status</span>
                          <span className={cn(
                              "font-bold",
                              order.status === 'Pending' ? "text-amber-600" : order.status === 'Reviewing' ? "text-blue-600" : "text-emerald-600"
                            )}>
                              {order.status}
                            </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-neutral-100 flex gap-2">
                        <button className="flex-1 bg-indigo-50 text-indigo-700 font-bold py-2 rounded-xl text-sm hover:bg-indigo-100 transition-colors">
                          Review
                        </button>
                        <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 font-bold py-2 rounded-xl text-sm hover:bg-neutral-50 transition-colors">
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {!['dashboard', 'templates', 'custom_orders'].includes(activeTab) && (
            <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center h-96 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-4">
                <Settings className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Module Under Construction</h2>
              <p className="text-neutral-500 max-w-sm">The {activeTab.replace('_', ' ')} module is currently being built and will be available soon in this premium dashboard.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

