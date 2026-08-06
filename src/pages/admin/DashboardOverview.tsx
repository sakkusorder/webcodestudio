import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingCart, CheckCircle, Activity, 
  ChevronRight, PlusCircle, Tag, Globe, DollarSign,
  TrendingUp, AlertCircle, Clock, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

export function DashboardOverview() {
  const { t } = useLanguage();

  
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    pendingProjects: 0,
    completedProjects: 0,
    fullPayment: 0,
    installments: 0,
    pendingVerification: 0,
    missedInstallment: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      const orders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
      const custom = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
      const allOrders = [...orders, ...custom];
      
      setStats({
        totalOrders: allOrders.length,
        newOrders: allOrders.filter(o => {
          const d = o.createdAt || o.date;
          if (!d) return false;
          return new Date(d).toDateString() === new Date().toDateString();
        }).length,
        pendingProjects: allOrders.filter(o => o.status === 'Pending' || (o.payment && o.payment.paidNow === 0)).length,
        completedProjects: allOrders.filter(o => o.status === 'Completed').length,
        fullPayment: orders.filter((o: any) => o.payment?.option === 'full').length,
        installments: orders.filter((o: any) => o.payment?.option === 'installment').length,
        pendingVerification: 0, // Mock
        missedInstallment: 0, // Mock
        totalUsers: 1 // Mock admin + user
      });
    };
    
    fetchStats();
    window.addEventListener('storage', fetchStats);
    const interval = setInterval(fetchStats, 2000);
    return () => {
      window.removeEventListener('storage', fetchStats);
      clearInterval(interval);
    };
  }, []);

  const STATS = [
    { label: t('admin.total_website_orders'), value: stats.totalOrders.toString(), change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: ShoppingCart },
    { label: t('admin.todays_new_orders'), value: stats.newOrders.toString(), change: '+2', color: 'text-blue-600', bg: 'bg-blue-50', icon: PlusCircle },
    { label: t('admin.pending_projects'), value: stats.pendingProjects.toString(), change: '-4', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    { label: t('admin.completed_projects'), value: stats.completedProjects.toString(), change: '+15%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
    { label: t('admin.full_payment_orders'), value: stats.fullPayment.toString(), change: '+8%', color: 'text-purple-600', bg: 'bg-purple-50', icon: DollarSign },
    { label: t('admin.installment_orders'), value: stats.installments.toString(), change: '+10%', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: TrendingUp },
    { label: t('admin.pending_payment_verification'), value: stats.pendingVerification.toString(), change: '-2', color: 'text-orange-600', bg: 'bg-orange-50', icon: Activity },
    { label: t('admin.missed_installment'), value: stats.missedInstallment.toString(), change: '+1', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
    { label: t('admin.total_users'), value: stats.totalUsers.toString(), change: '+24%', color: 'text-teal-600', bg: 'bg-teal-50', icon: Users },
  ];


  const MONTHLY_REVENUE = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 18 },
    { name: 'Mar', revenue: 5000, orders: 32 },
    { name: 'Apr', revenue: 4500, orders: 28 },
    { name: 'May', revenue: 6000, orders: 38 },
    { name: 'Jun', revenue: 5500, orders: 35 },
  ];

  const PAYMENT_STATS = [
    { name: 'Full Payment', value: 65 },
    { name: 'Installment', value: 35 },
  ];

  const COLORS = ['#4f46e5', '#06b6d4'];

  const RECENT_ACTIVITIES = [
    { id: 1, type: 'order', text: t('admin.new_order_arrived'), time: '10 mins ago', user: 'Rahim Uddin', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, type: 'payment_submit', text: t('admin.payment_submitted'), time: '30 mins ago', user: 'Karim Hasan', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 3, type: 'payment_approve', text: t('admin.payment_approved'), time: '1 hour ago', user: 'Admin', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 4, type: 'user', text: t('admin.new_user_registered'), time: '2 hours ago', user: 'Jalal Ahmed', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 5, type: 'payment_reject', text: t('admin.payment_rejected'), time: '5 hours ago', user: 'Admin', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{t('admin.dashboard')}</h2>
        <p className="text-neutral-500 font-medium mt-1">{t('admin.analytics_overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm shadow-neutral-200/50 flex flex-col justify-between group hover:border-indigo-100 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-xs font-bold px-2.5 py-1 rounded-full",
                stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-neutral-900 tracking-tight">{stat.value}</div>
              <div className="text-sm font-bold text-neutral-500 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-neutral-900 tracking-tight">{t('admin.monthly_revenue')} & {t('admin.monthly_order_chart')}</h3>
            <select className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-600/20">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Stats Chart */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50 flex flex-col">
          <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-8">{t('admin.payment_statistics')}</h3>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PAYMENT_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-8">{t('admin.recent_activities')}</h3>
        <div className="space-y-6">
          {RECENT_ACTIVITIES.map((activity, i) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", activity.bg, activity.color)}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-neutral-900 font-bold">{activity.text}</p>
                  <span className="text-xs font-bold text-neutral-400">{activity.time}</span>
                </div>
                <p className="text-sm font-medium text-neutral-500 mt-1">
                  By <span className="font-bold text-neutral-700">{activity.user}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
