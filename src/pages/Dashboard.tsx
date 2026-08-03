import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Globe, ShoppingCart, Clock, 
  History, FileText, Bell, LifeBuoy, User,
  ChevronRight, CheckCircle, Search, Settings, 
  Upload, Download, PlusCircle, CreditCard, MessageSquare, 
  MapPin, Phone, Mail, Lock, AlertCircle, ImageIcon
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

const getEmiStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</span>;
    case 'Due': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-xs font-bold">Due</span>;
    case 'Overdue': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-bold">Overdue</span>;
    case 'Pending': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-bold">Pending</span>;
    default: return null;
  }
};

export function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [activeWebsite, setActiveWebsite] = useState<any>(null);
  
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Mock or load existing data safely
    const storedOrders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    setOrders(storedOrders);
  }, []);

  // Compute stats
  const totalOrders = orders.length || 5; 
  const activeWebsites = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length || 2;
  const completedWebsites = orders.filter(o => o.status === 'Delivered').length || 3;
  const totalPaid = 1500;
  const remainingAmount = 1200;
  const nextEmiDate = '2026-08-15';

  const STATS = { totalOrders, activeWebsites, completedWebsites, totalPaid, remainingAmount, nextEmiDate };

  const WEBSITES = [
    { 
      id: 'ORD-1029', 
      title: 'Corporate Website Redesign', 
      category: 'Business',
      orderStatus: 'Confirmed',
      deliveryStatus: 'Development', 
      paymentStatus: 'Partial Paid',
      price: 2400,
      downPayment: 1200,
      remainingAmount: 1200,
      deliveryDate: 'Aug 15, 2026',
      package: 'Premium Business',
      features: ['SEO Optimization', 'Custom Admin Panel', 'Payment Gateway'],
      progress: 65,
      timeline: [
        { label: 'Request Submitted', done: true, date: 'Jul 01, 2026' },
        { label: 'Development Started', done: true, date: 'Jul 05, 2026', current: true },
        { label: 'Review', done: false },
        { label: 'Delivered', done: false }
      ]
    },
    { 
      id: 'ORD-1030', 
      title: 'E-Commerce App MVP', 
      category: 'Ecommerce',
      orderStatus: 'Pending',
      deliveryStatus: 'Pending', 
      paymentStatus: 'Unpaid',
      price: 3500,
      downPayment: 1000,
      remainingAmount: 2500,
      deliveryDate: 'Sep 01, 2026',
      package: 'Standard E-commerce',
      features: ['Product Variations', 'Stripe Integration'],
      progress: 15,
      timeline: [
        { label: 'Request Submitted', done: true, date: 'Jul 20, 2026', current: true },
        { label: 'Development Started', done: false },
        { label: 'Review', done: false },
        { label: 'Delivered', done: false }
      ]
    }
  ];

  const INSTALLMENTS = [
    {
      id: 'EMI-1',
      totalPrice: 2400,
      downPayment: 1200,
      remainingAmount: 1200,
      monthlyInstallment: 400,
      nextDueDate: 'Aug 15, 2026',
      schedule: [
        { number: 1, dueDate: 'Jul 15, 2026', amount: 400, status: 'Paid' },
        { number: 2, dueDate: 'Aug 15, 2026', amount: 400, status: 'Due' },
        { number: 3, dueDate: 'Sep 15, 2026', amount: 400, status: 'Pending' },
      ]
    }
  ];

  const PAYMENT_HISTORY = [
    { id: 'TXN-9021', method: 'bKash', date: 'Jul 15, 2026', amount: 400, receipt: '#' },
    { id: 'TXN-8012', method: 'Card (Stripe)', date: 'Jul 01, 2026', amount: 1200, receipt: '#' }
  ];

  const [notificationFilter, setNotificationFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Order', title: 'Order Confirmed', message: 'Your Corporate Website Redesign order has been confirmed.', date: '2 mins ago', read: false },
    { id: 2, type: 'Payment', title: 'Payment Overdue', message: 'EMI #2 of $400 is overdue by 5 days.', date: '2 hours ago', read: false, overdue: true, amount: 400, lateDays: 5 },
    { id: 3, type: 'Installment', title: 'Due Reminder', message: 'EMI #2 of $400 is due on Aug 15.', date: '1 day ago', read: false },
    { id: 4, type: 'Order', title: 'Website Ready', message: 'Your E-Commerce App MVP is ready for review.', date: '2 days ago', read: true },
    { id: 5, type: 'Payment', title: 'Payment Success', message: 'Payment of $400 for EMI #1 was successful.', date: 'Jul 15, 2026', read: true },
    { id: 6, type: 'Support', title: 'Admin Message', message: 'Admin replied to your ticket TCK-201.', date: 'Jul 10, 2026', read: true },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'All') return true;
    if (['Today', 'This Week', 'This Month'].includes(notificationFilter)) return true; // simplified logic for UI mock
    return n.type === notificationFilter;
  });

  const SUPPORT_TICKETS = [
    { id: 'TCK-201', subject: 'Need to add a new payment gateway', category: 'Website Update', status: 'Open', lastReply: 'Admin: We are looking into this.' },
    { id: 'TCK-198', subject: 'EMI payment via bank transfer', category: 'EMI', status: 'Closed', lastReply: 'Admin: Yes, you can use the provided bank details.' }
  ];

  const handleOpenWebsite = (website: any) => {
    setActiveWebsite(website);
    setActiveTab('website_details');
  };

  const NavItem = ({ id, icon, label, badge }: { id: string, icon: React.ReactNode, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setActiveWebsite(null); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all border border-transparent",
        (activeTab === id || (id === 'websites' && activeTab === 'website_details')) && !activeWebsite
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
          : "text-neutral-600 hover:bg-white hover:border-neutral-200"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="hidden md:inline">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          (activeTab === id || (id === 'websites' && activeTab === 'website_details')) && !activeWebsite
            ? "bg-white text-indigo-600"
            : "bg-rose-500 text-white"
        )}>
          {badge}
        </span>
      )}
    </button>
  );

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 md:top-20 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl uppercase overflow-hidden">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900">Welcome back, {user?.name || 'Customer'}!</h2>
              <p className="text-sm font-medium text-neutral-500">Manage your websites and payments.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setActiveTab('notifications')} className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0 space-y-2">
          <NavItem id="overview" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem id="websites" icon={<Globe className="w-5 h-5" />} label="My Websites" />
          <NavItem id="orders" icon={<ShoppingCart className="w-5 h-5" />} label="My Orders" />
          <NavItem id="installments" icon={<Clock className="w-5 h-5" />} label="Installment Payments" />
          <NavItem id="payment_history" icon={<History className="w-5 h-5" />} label="Payment History" />
          <NavItem id="invoices" icon={<FileText className="w-5 h-5" />} label="Invoices" />
          <NavItem id="notifications" icon={<Bell className="w-5 h-5" />} label="Notifications" badge={unreadNotificationsCount} />
          <NavItem id="support" icon={<LifeBuoy className="w-5 h-5" />} label="Support Tickets" />
          <div className="pt-4 mt-4 border-t border-neutral-200 space-y-2">
            <NavItem id="profile" icon={<User className="w-5 h-5" />} label="Profile Settings" />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 flex items-center justify-around pb-safe overflow-x-auto">
          <button onClick={() => { setActiveTab('overview'); setActiveWebsite(null); }} className={cn("p-4 shrink-0 flex flex-col items-center gap-1 transition-colors", activeTab === 'overview' ? "text-indigo-600" : "text-neutral-500")}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => { setActiveTab('websites'); setActiveWebsite(null); }} className={cn("p-4 shrink-0 flex flex-col items-center gap-1 transition-colors", activeTab === 'websites' || activeTab === 'website_details' ? "text-indigo-600" : "text-neutral-500")}>
            <Globe className="w-6 h-6" />
            <span className="text-[10px] font-bold">Websites</span>
          </button>
          <button onClick={() => { setActiveTab('installments'); setActiveWebsite(null); }} className={cn("p-4 shrink-0 flex flex-col items-center gap-1 transition-colors", activeTab === 'installments' ? "text-indigo-600" : "text-neutral-500")}>
            <Clock className="w-6 h-6" />
            <span className="text-[10px] font-bold">EMIs</span>
          </button>
          <button onClick={() => { setActiveTab('profile'); setActiveWebsite(null); }} className={cn("p-4 shrink-0 flex flex-col items-center gap-1 transition-colors", activeTab === 'profile' ? "text-indigo-600" : "text-neutral-500")}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* DASHBOARD HOME (OVERVIEW) */}
          {activeTab === 'overview' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
              <h2 className="text-2xl font-black text-neutral-900">Dashboard Summary</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-indigo-600 mb-1">{STATS.totalOrders}</div>
                  <div className="text-sm font-semibold text-neutral-500">Total Orders</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-emerald-600 mb-1">{STATS.activeWebsites}</div>
                  <div className="text-sm font-semibold text-neutral-500">Active Websites</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-green-600 mb-1">{STATS.completedWebsites}</div>
                  <div className="text-sm font-semibold text-neutral-500">Completed Websites</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-blue-600 mb-1">${STATS.totalPaid}</div>
                  <div className="text-sm font-semibold text-neutral-500">Total Paid</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-3xl font-black text-rose-600 mb-1">${STATS.remainingAmount}</div>
                  <div className="text-sm font-semibold text-neutral-500">Remaining Amount</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center text-center">
                  <div className="text-xl md:text-2xl font-black text-orange-600 mb-1 mt-1">{STATS.nextEmiDate}</div>
                  <div className="text-sm font-semibold text-neutral-500">Next EMI Due Date</div>
                </div>
              </div>
            </div>
          )}

          {/* MY WEBSITES */}
          {activeTab === 'websites' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <h2 className="text-2xl font-black text-neutral-900">My Websites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {WEBSITES.map(website => (
                  <div key={website.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="h-40 bg-neutral-100 flex items-center justify-center relative">
                      <ImageIcon className="w-12 h-12 text-neutral-300" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-neutral-900 shadow-sm">
                        {website.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">{website.id}</span>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md border", getStatusColor(website.deliveryStatus))}>
                          {website.deliveryStatus}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-4">{website.title}</h3>
                      
                      <div className="space-y-2 text-sm font-medium text-neutral-600 mb-6 flex-1">
                        <div className="flex justify-between">
                          <span>Order Status:</span>
                          <span className="font-bold text-neutral-900">{website.orderStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Status:</span>
                          <span className="font-bold text-indigo-600">{website.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-auto">
                        <button onClick={() => handleOpenWebsite(website)} className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                          View Details
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenWebsite(website)} className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2.5 rounded-xl font-bold hover:bg-neutral-200 transition-colors text-sm">
                            View Progress
                          </button>
                          <button className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2.5 rounded-xl font-bold hover:bg-neutral-200 transition-colors text-sm flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY ORDERS (Similar to websites but simpler list) */}
          {activeTab === 'orders' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <h2 className="text-2xl font-black text-neutral-900">My Orders</h2>
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 font-bold uppercase border-b border-neutral-100 bg-neutral-50/50">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Project Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {WEBSITES.map((o, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-neutral-900">{o.id}</td>
                          <td className="px-6 py-5 font-medium text-neutral-900">{o.title}</td>
                          <td className="px-6 py-5 font-medium text-neutral-500">Jul 01, 2026</td>
                          <td className="px-6 py-5">
                            <span className={cn("px-3 py-1 rounded-md text-xs font-bold border", getStatusColor(o.orderStatus))}>{o.orderStatus}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button onClick={() => {setActiveTab('websites'); handleOpenWebsite(o);}} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg transition-colors">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WEBSITE DETAILS */}
          {activeTab === 'website_details' && activeWebsite && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveTab('websites'); setActiveWebsite(null); }} className="p-2 hover:bg-neutral-200 rounded-xl transition-colors bg-neutral-100 text-neutral-600">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">{activeWebsite.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-neutral-500">{activeWebsite.id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Details Card */}
                <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Website Details</h3>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Website Name</span>
                    <span className="font-bold text-neutral-900">{activeWebsite.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Assigned Package</span>
                    <span className="font-bold text-neutral-900">{activeWebsite.package}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Website Price</span>
                    <span className="font-bold text-indigo-600">${activeWebsite.price}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Down Payment</span>
                    <span className="font-bold text-emerald-600">${activeWebsite.downPayment}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Remaining Amount</span>
                    <span className="font-bold text-rose-600">${activeWebsite.remainingAmount}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Delivery Date</span>
                    <span className="font-bold text-neutral-900">{activeWebsite.deliveryDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-semibold">Current Status</span>
                    <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold border", getStatusColor(activeWebsite.deliveryStatus))}>
                      {activeWebsite.deliveryStatus}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-neutral-500 font-semibold block mb-2">Selected Custom Features:</span>
                    <div className="flex flex-wrap gap-2">
                      {activeWebsite.features.map((f: string, i: number) => (
                        <span key={i} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-bold">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-neutral-900 mb-8">Development Progress</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                    {activeWebsite.timeline.map((step: any, idx: number) => (
                      <div key={idx} className="relative flex items-center group">
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 shadow transition-all z-10",
                          step.done ? "bg-indigo-600 border-indigo-100 text-white" : step.current ? "bg-white border-indigo-600 text-indigo-600" : "bg-neutral-100 border-white text-neutral-400"
                        )}>
                          {step.done ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                        </div>
                        <div className="ml-6 flex-1 p-4 rounded-2xl border border-neutral-100 bg-neutral-50 shadow-sm">
                          <h4 className={cn("font-bold", step.done || step.current ? "text-neutral-900" : "text-neutral-500")}>{step.label}</h4>
                          {step.date && <div className="text-xs font-semibold text-neutral-500 mt-1">{step.date}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSTALLMENT PAYMENTS */}
          {activeTab === 'installments' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <h2 className="text-2xl font-black text-neutral-900">Installment Payments</h2>
              
              {INSTALLMENTS.map((plan) => (
                <div key={plan.id} className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-indigo-200 text-sm font-semibold mb-1">Total Website Price</div>
                        <div className="text-2xl font-black">${plan.totalPrice}</div>
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm font-semibold mb-1">Down Payment</div>
                        <div className="text-2xl font-black">${plan.downPayment}</div>
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm font-semibold mb-1">Remaining Amount</div>
                        <div className="text-2xl font-black text-rose-300">${plan.remainingAmount}</div>
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm font-semibold mb-1">Monthly Installment</div>
                        <div className="text-2xl font-black">${plan.monthlyInstallment}/mo</div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-6 pt-6 border-t border-indigo-800/50 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-indigo-200 text-sm font-semibold">Next Due Date</div>
                        <div className="text-xl font-bold text-orange-300">{plan.nextDueDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Installment Cards */}
                  <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 md:p-8 space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6">Installment Schedule</h3>
                    {plan.schedule.map((emi) => (
                      <div key={emi.number} className={cn("flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border transition-all", 
                        emi.status === 'Paid' ? "bg-emerald-50/30 border-emerald-100" : 
                        emi.status === 'Due' ? "bg-orange-50/50 border-orange-200 shadow-sm" :
                        emi.status === 'Overdue' ? "bg-red-50/50 border-red-200 shadow-sm" :
                        "bg-neutral-50 border-neutral-200"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold", 
                            emi.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : 
                            emi.status === 'Due' || emi.status === 'Overdue' ? "bg-white text-neutral-900 shadow-sm" :
                            "bg-neutral-200 text-neutral-500"
                          )}>
                            {emi.number}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">${emi.amount}</div>
                            <div className="text-sm font-medium text-neutral-500">Due: {emi.dueDate}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getEmiStatusBadge(emi.status)}
                          {(emi.status === 'Due' || emi.status === 'Overdue' || emi.status === 'Pending') && (
                            <button className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-colors", 
                              emi.status === 'Due' || emi.status === 'Overdue' ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                            )}>
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENT HISTORY & INVOICES */}
          {(activeTab === 'payment_history' || activeTab === 'invoices') && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <h2 className="text-2xl font-black text-neutral-900">{activeTab === 'invoices' ? 'Invoices' : 'Payment History'}</h2>
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 font-bold uppercase border-b border-neutral-100 bg-neutral-50/50">
                      <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Payment Method</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {PAYMENT_HISTORY.map((txn, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-neutral-900">{txn.id}</td>
                          <td className="px-6 py-5 font-medium text-neutral-600">{txn.method}</td>
                          <td className="px-6 py-5 font-medium text-neutral-600">{txn.date}</td>
                          <td className="px-6 py-5 font-black text-neutral-900">${txn.amount}</td>
                          <td className="px-6 py-5 text-right">
                            <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                              <Download className="w-4 h-4" /> Download
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

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-neutral-900">Notifications</h2>
                <div className="flex items-center gap-2">
                  <button onClick={handleMarkAllAsRead} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 hover:bg-indigo-50 rounded-lg">Mark All as Read</button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-white border border-neutral-200 p-1 rounded-xl shadow-sm w-fit">
                {['All', 'Today', 'This Week', 'This Month', 'Order', 'Payment', 'Installment', 'Support'].map(f => (
                  <button
                    key={f}
                    onClick={() => setNotificationFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                      notificationFilter === f ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
                {filteredNotifications.length === 0 && (
                  <div className="p-12 text-center text-neutral-500 font-medium text-sm">No notifications found.</div>
                )}
                {filteredNotifications.map((n) => (
                  <div key={n.id} className={cn("p-6 hover:bg-neutral-50 transition-colors flex gap-4 items-start relative", !n.read && "bg-indigo-50/30")}>
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      n.type === 'Order' ? "bg-blue-100 text-blue-600" :
                      n.type === 'Payment' && n.overdue ? "bg-rose-100 text-rose-600" :
                      n.type === 'Payment' ? "bg-emerald-100 text-emerald-600" :
                      n.type === 'Installment' ? "bg-orange-100 text-orange-600" :
                      "bg-neutral-100 text-neutral-600"
                    )}>
                      {n.type === 'Order' ? <Globe className="w-5 h-5" /> :
                       n.type === 'Payment' && n.overdue ? <AlertCircle className="w-5 h-5" /> :
                       n.type === 'Payment' ? <CreditCard className="w-5 h-5" /> :
                       n.type === 'Installment' ? <Clock className="w-5 h-5" /> :
                       <Bell className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-900">{n.title}</h4>
                          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{n.type}</span>
                        </div>
                        <span className="text-xs font-semibold text-neutral-400">{n.date}</span>
                      </div>
                      <p className={cn("text-sm mb-3", !n.read ? "font-semibold text-neutral-800" : "font-medium text-neutral-600")}>{n.message}</p>
                      
                      {n.overdue && (
                        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-3 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Remaining Amount</div>
                              <div className="font-black text-rose-700">${n.amount}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Late By</div>
                              <div className="font-black text-rose-700">{n.lateDays} Days</div>
                            </div>
                          </div>
                          <button onClick={() => setActiveTab('installments')} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
                            Pay Now
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {!n.read && (
                          <button onClick={() => handleMarkAsRead(n.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle className="w-3 h-3" /> Mark as Read
                          </button>
                        )}
                        
                        {n.type === 'Order' && (
                          <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                            View Order
                          </button>
                        )}
                        
                        {n.type === 'Support' && (
                          <button onClick={() => setActiveTab('support')} className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                            View Ticket
                          </button>
                        )}
                        
                        {n.type === 'Payment' && !n.overdue && (
                          <button onClick={() => setActiveTab('payment_history')} className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                            View Receipt
                          </button>
                        )}
                        
                        {n.type === 'Installment' && (
                          <button onClick={() => setActiveTab('installments')} className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                            View Schedule
                          </button>
                        )}

                        <button onClick={() => handleDeleteNotification(n.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors px-3 py-1.5">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORT TICKETS */}
          {activeTab === 'support' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-neutral-900">Support Tickets</h2>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                  <PlusCircle className="w-5 h-5" /> New Ticket
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 font-bold uppercase border-b border-neutral-100 bg-neutral-50/50">
                      <tr>
                        <th className="px-6 py-4">Ticket ID</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Admin Reply</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {SUPPORT_TICKETS.map((t, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-neutral-900">{t.id}</td>
                          <td className="px-6 py-5 font-medium text-neutral-600">{t.category}</td>
                          <td className="px-6 py-5 font-medium text-neutral-900">{t.subject}</td>
                          <td className="px-6 py-5">
                            <span className={cn("px-3 py-1 rounded-md text-xs font-bold uppercase", t.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500')}>{t.status}</span>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-neutral-500 italic max-w-[200px] truncate">{t.lastReply}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && !activeWebsite && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6 max-w-3xl">
              <h2 className="text-2xl font-black text-neutral-900">Profile Settings</h2>
              
              <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center relative border-4 border-white shadow-md overflow-hidden">
                    <User className="w-10 h-10 text-neutral-400" />
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                      <Upload className="w-6 h-6" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{user?.name || 'Customer Profile'}</h3>
                    <p className="text-sm font-medium text-neutral-500">Update your personal information</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Email Address</label>
                      <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl font-medium text-neutral-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Mobile Number</label>
                      <input type="tel" defaultValue="+1234567890" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Address</label>
                      <textarea rows={3} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="Dhaka, Bangladesh"></textarea>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button type="button" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
