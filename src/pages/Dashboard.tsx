import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, Receipt, MessageSquare, 
  ChevronRight, CheckCircle2, Clock, Settings, 
  Upload, Bell, Search, User, CreditCard, LifeBuoy, 
  Download, PlusCircle, LayoutTemplate, Send, Paperclip, CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Review': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Development': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Testing': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Delivered': return 'bg-green-100 text-green-800 border-green-300';
    case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-neutral-50 text-neutral-700 border-neutral-200';
  }
};

const getStatusColorSolid = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-blue-600 text-white';
    case 'Review': return 'bg-orange-500 text-white';
    case 'Development': return 'bg-purple-600 text-white';
    case 'Testing': return 'bg-sky-500 text-white';
    case 'Completed': return 'bg-emerald-500 text-white';
    case 'Delivered': return 'bg-green-700 text-white';
    case 'Cancelled': return 'bg-red-600 text-white';
    default: return 'bg-neutral-600 text-white';
  }
};

export function Dashboard() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const newProject = location.state?.newProject;

  const [activeTab, setActiveTab] = useState('overview');
  const [activeProject, setActiveProject] = useState<any>(null);

  const STATS = {
    total: 5,
    active: 2,
    completed: 3,
    pendingPayments: '$1,200',
    unreadMessages: 4
  };

  const BASE_PROJECTS = [
    { 
      id: 'PRJ-1029', 
      title: 'Corporate Website Redesign', 
      category: 'Business',
      status: 'Development', 
      progress: 65,
      deliveryDate: 'Aug 15, 2026',
      timeline: [
        { label: 'Request Submitted', done: true, date: 'Jul 01, 2026' },
        { label: 'Quotation Ready', done: true, date: 'Jul 02, 2026' },
        { label: 'Advance Payment', done: true, date: 'Jul 03, 2026' },
        { label: 'Development Started', done: true, date: 'Jul 05, 2026', current: true },
        { label: 'Homepage Ready', done: false },
        { label: 'Review', done: false },
        { label: 'Testing', done: false },
        { label: 'Delivered', done: false }
      ]
    },
    { 
      id: 'PRJ-1030', 
      title: 'E-Commerce App MVP', 
      category: 'Ecommerce',
      status: 'Pending', 
      progress: 15,
      deliveryDate: 'Sep 01, 2026',
      timeline: [
        { label: 'Request Submitted', done: true, date: 'Jul 20, 2026' },
        { label: 'Quotation Ready', done: true, date: 'Jul 22, 2026', current: true },
        { label: 'Advance Payment', done: false },
        { label: 'Development Started', done: false },
        { label: 'Review', done: false },
        { label: 'Delivered', done: false }
      ]
    }
  ];

  const PROJECTS = newProject ? [
    {
      id: 'PRJ-1031',
      title: 'Custom Website Request',
      category: 'Custom',
      status: 'Pending',
      progress: 5,
      deliveryDate: 'TBD',
      timeline: [
        { label: 'Request Submitted', done: true, current: true, date: 'Today' },
        { label: 'Quotation Ready', done: false },
        { label: 'Advance Payment', done: false },
        { label: 'Development Started', done: false },
        { label: 'Delivered', done: false }
      ]
    },
    ...BASE_PROJECTS
  ] : BASE_PROJECTS;

  const INVOICES = [
    { id: 'INV-2026-001', project: 'PRJ-1029', amount: '$1,200', status: 'Paid', date: 'Jul 15, 2026', type: 'Full Payment' },
    { id: 'INV-2026-002', project: 'PRJ-1030', amount: '$150', status: 'Pending', date: 'Jul 28, 2026', type: 'Advance (30%)' }
  ];

  const NOTIFICATIONS = [
    { id: 1, title: 'New Message', desc: 'Developer sent you a message regarding PRJ-1029.', time: '2 hours ago', icon: <MessageSquare className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
    { id: 2, title: 'Quotation Ready', desc: 'Quotation for PRJ-1030 is ready for review.', time: '1 day ago', icon: <FileText className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50' },
    { id: 3, title: 'Payment Reminder', desc: 'Advance payment of $150 is pending for PRJ-1030.', time: '2 days ago', icon: <CreditCard className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50' }
  ];

  const handleOpenProject = (project: any) => {
    setActiveProject(project);
    setActiveTab('project_details');
  };

  const NavItem = ({ id, icon, label, badge }: { id: string, icon: React.ReactNode, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setActiveProject(null); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all border border-transparent",
        activeTab === id && !activeProject
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
          : "text-neutral-600 hover:bg-white hover:border-neutral-200"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="hidden md:inline">{label}</span>
      </div>
      {badge && <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeTab === id ? "bg-white text-indigo-600" : "bg-rose-500 text-white")}>{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 md:top-20 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
              JS
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900">Welcome back, John!</h2>
              <p className="text-sm font-medium text-neutral-500">Manage your projects and payments.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
            <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0 space-y-2">
          <NavItem id="overview" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" />
          <NavItem id="projects" icon={<FolderKanban className="w-5 h-5" />} label="My Projects" />
          <NavItem id="messages" icon={<MessageSquare className="w-5 h-5" />} label="Messages" badge={STATS.unreadMessages} />
          <NavItem id="payments" icon={<CreditCard className="w-5 h-5" />} label="Payments" />
          <NavItem id="profile" icon={<User className="w-5 h-5" />} label="Profile" />
          <div className="pt-4 mt-4 border-t border-neutral-200 space-y-2">
            <NavItem id="settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
            <NavItem id="support" icon={<LifeBuoy className="w-5 h-5" />} label="Support" />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 flex items-center justify-around pb-safe">
          <button onClick={() => { setActiveTab('overview'); setActiveProject(null); }} className={cn("p-4 flex flex-col items-center gap-1 transition-colors", activeTab === 'overview' ? "text-indigo-600" : "text-neutral-500")}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => { setActiveTab('projects'); setActiveProject(null); }} className={cn("p-4 flex flex-col items-center gap-1 transition-colors", activeTab === 'projects' || activeTab === 'project_details' ? "text-indigo-600" : "text-neutral-500")}>
            <FolderKanban className="w-6 h-6" />
            <span className="text-[10px] font-bold">Projects</span>
          </button>
          <button onClick={() => { setActiveTab('messages'); setActiveProject(null); }} className={cn("p-4 flex flex-col items-center gap-1 transition-colors relative", activeTab === 'messages' ? "text-indigo-600" : "text-neutral-500")}>
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-bold">Messages</span>
            <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={() => { setActiveTab('payments'); setActiveProject(null); }} className={cn("p-4 flex flex-col items-center gap-1 transition-colors", activeTab === 'payments' ? "text-indigo-600" : "text-neutral-500")}>
            <CreditCard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Payments</span>
          </button>
          <button onClick={() => { setActiveTab('profile'); setActiveProject(null); }} className={cn("p-4 flex flex-col items-center gap-1 transition-colors", activeTab === 'profile' ? "text-indigo-600" : "text-neutral-500")}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && !activeProject && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
              
              {/* Quick Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-indigo-600 mb-1">{STATS.active}</div>
                  <div className="text-sm font-semibold text-neutral-500">Active Projects</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-emerald-600 mb-1">{STATS.completed}</div>
                  <div className="text-sm font-semibold text-neutral-500">Completed</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-rose-600 mb-1">{STATS.pendingPayments}</div>
                  <div className="text-sm font-semibold text-neutral-500">Pending Dues</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-amber-600 mb-1">{STATS.unreadMessages}</div>
                  <div className="text-sm font-semibold text-neutral-500">Unread Msgs</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={() => navigate('/custom-project')} className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-indigo-200 transition-all flex flex-col items-center text-center gap-3">
                    <PlusCircle className="w-8 h-8" />
                    <span className="font-bold text-lg">Create Custom Website</span>
                  </button>
                  <button onClick={() => navigate('/templates')} className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 p-6 rounded-3xl shadow-sm transition-all flex flex-col items-center text-center gap-3">
                    <LayoutTemplate className="w-8 h-8 text-neutral-400" />
                    <span className="font-bold text-lg">Browse Templates</span>
                  </button>
                  <button onClick={() => setActiveTab('payments')} className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 p-6 rounded-3xl shadow-sm transition-all flex flex-col items-center text-center gap-3">
                    <CreditCard className="w-8 h-8 text-neutral-400" />
                    <span className="font-bold text-lg">Pay Due Amount</span>
                  </button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Notifications</h3>
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
                  {NOTIFICATIONS.map(note => (
                    <div key={note.id} className="p-4 md:p-6 hover:bg-neutral-50 transition-colors flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", note.bg)}>
                        {note.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-neutral-900">{note.title}</h4>
                          <span className="text-xs font-semibold text-neutral-500">{note.time}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-600">{note.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MY PROJECTS TAB */}
          {activeTab === 'projects' && !activeProject && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-neutral-900">My Projects</h2>
                <button onClick={() => navigate('/custom-project')} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  <PlusCircle className="w-4 h-4" /> New Project
                </button>
              </div>

              <div className="space-y-6">
                {PROJECTS.map(project => (
                  <div key={project.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-6 md:p-8 flex-1 border-b md:border-b-0 md:border-r border-neutral-100">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">{project.id}</span>
                        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md border", getStatusColor(project.status))}>
                          {project.status}
                        </span>
                        <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">{project.category}</span>
                      </div>
                      <h3 className="text-2xl font-black text-neutral-900 mb-2">{project.title}</h3>
                      <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-6">
                        <Clock className="w-4 h-4" /> Expected Delivery: <strong className="text-neutral-900">{project.deliveryDate}</strong>
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-neutral-600">Progress</span>
                          <span className="text-indigo-600">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 md:w-64 flex flex-col justify-center gap-3 bg-neutral-50/50">
                      <button onClick={() => handleOpenProject(project)} className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-colors">
                        Open Project <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-3 rounded-xl font-bold hover:bg-neutral-50 transition-colors">
                        <CreditCard className="w-4 h-4" /> Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT DETAILS VIEW */}
          {activeTab === 'project_details' && activeProject && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveTab('projects'); setActiveProject(null); }} className="p-2 hover:bg-neutral-200 rounded-xl transition-colors bg-neutral-100 text-neutral-600">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">{activeProject.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-neutral-500">{activeProject.id}</span>
                    <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-md border", getStatusColor(activeProject.status))}>
                      {activeProject.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Layout for Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Timeline Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-8">Project Timeline</h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                      
                      {activeProject.timeline.map((step: any, idx: number) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-all",
                            step.done ? "bg-indigo-600 border-indigo-100 text-white" : step.current ? "bg-white border-indigo-600 text-indigo-600" : "bg-neutral-100 border-white text-neutral-400"
                          )}>
                            {step.done ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                          </div>
                          
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-neutral-100 bg-neutral-50 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={cn("font-bold", step.done || step.current ? "text-neutral-900" : "text-neutral-500")}>{step.label}</h4>
                            </div>
                            {step.date && <div className="text-xs font-semibold text-neutral-500">{step.date}</div>}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">Project Information</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500 font-semibold">Category</span>
                        <span className="font-bold text-neutral-900">{activeProject.category}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500 font-semibold">Delivery Date</span>
                        <span className="font-bold text-neutral-900">{activeProject.deliveryDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500 font-semibold">Total Cost</span>
                        <span className="font-bold text-indigo-600">$1,200</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-neutral-500 font-semibold">Due Amount</span>
                        <span className="font-bold text-rose-600">$0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">Project Files</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                        <div className="flex items-center gap-3 text-sm font-bold text-neutral-700 group-hover:text-indigo-700">
                          <FileText className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500" /> Quotation.pdf
                        </div>
                        <Download className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                        <div className="flex items-center gap-3 text-sm font-bold text-neutral-700 group-hover:text-indigo-700">
                          <FileText className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500" /> Invoice_1.pdf
                        </div>
                        <Download className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                      </button>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-600 font-bold hover:bg-neutral-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                      <Upload className="w-4 h-4" /> Upload File
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && !activeProject && (
            <div className="animate-in fade-in zoom-in-95 duration-300 h-[70vh] bg-white rounded-3xl border border-neutral-200 shadow-sm flex overflow-hidden">
              <div className="w-full md:w-1/3 border-r border-neutral-100 flex flex-col">
                <div className="p-4 border-b border-neutral-100">
                  <div className="relative">
                    <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 border-b border-neutral-100 bg-indigo-50/50 cursor-pointer flex gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">WCS</div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-neutral-900 truncate">Web Code Studio</h4>
                        <span className="text-xs font-semibold text-neutral-500">10:42 AM</span>
                      </div>
                      <p className="text-sm text-neutral-600 truncate font-semibold">We have started the development...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-1 flex-col bg-neutral-50/50">
                <div className="p-4 bg-white border-b border-neutral-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">WCS</div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Web Code Studio Support</h3>
                    <p className="text-xs font-semibold text-green-600">Online</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex justify-center">
                    <span className="text-xs font-bold text-neutral-400 bg-neutral-200 px-3 py-1 rounded-full">Today</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">WCS</div>
                    <div className="bg-white border border-neutral-200 p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%]">
                      <p className="text-sm font-medium text-neutral-800">Hello! We have received your advance payment for the Corporate Website project. We are starting the development phase today.</p>
                      <span className="text-[10px] font-bold text-neutral-400 mt-2 block">10:42 AM</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 justify-end">
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-br-none shadow-sm max-w-[80%]">
                      <p className="text-sm font-medium">That's great! Let me know if you need any further details.</p>
                      <span className="text-[10px] font-bold text-indigo-200 mt-2 block text-right">10:45 AM</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-neutral-100">
                  <div className="flex items-center gap-2 bg-neutral-100 rounded-2xl p-2 pr-4">
                    <button className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-xl transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none px-2" />
                    <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && !activeProject && (
             <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
               <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex items-center justify-between flex-wrap gap-6">
                 <div>
                   <h2 className="text-2xl font-black text-neutral-900 mb-2">Total Due Amount</h2>
                   <div className="text-4xl font-black text-rose-600">$1,200.00</div>
                 </div>
                 <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg">
                   Pay Now
                 </button>
               </div>

               <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">Invoice History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100">
                      <tr>
                        <th className="px-4 py-4">Invoice ID</th>
                        <th className="px-4 py-4">Project</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {INVOICES.map((invoice, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-4 py-5 font-bold text-neutral-900">{invoice.id}</td>
                          <td className="px-4 py-5 font-medium text-neutral-600">{invoice.project}</td>
                          <td className="px-4 py-5 font-medium text-neutral-600">{invoice.date}</td>
                          <td className="px-4 py-5 font-black text-neutral-900">{invoice.amount}</td>
                          <td className="px-4 py-5">
                            <span className={cn("px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider", invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right">
                            <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ml-auto">
                              <Download className="w-4 h-4" /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
               </div>
             </div>
          )}

          {/* PROFILE & SETTINGS TAB */}
          {(activeTab === 'profile' || activeTab === 'settings') && !activeProject && (
            <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-black mx-auto mb-4 border-4 border-white shadow-lg">
                  JS
                </div>
                <h2 className="text-2xl font-black text-neutral-900">John Smith</h2>
                <p className="text-neutral-500 font-medium">john.smith@example.com</p>
                <button className="mt-6 border border-neutral-200 text-neutral-700 px-6 py-2 rounded-xl font-bold hover:bg-neutral-50 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-neutral-900">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Company</label>
                    <input type="text" value="Acme Corp" disabled className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                    <input type="text" value="+1 (555) 123-4567" disabled className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-600" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Address</label>
                    <input type="text" value="123 Main St, New York, NY 10001, USA" disabled className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
