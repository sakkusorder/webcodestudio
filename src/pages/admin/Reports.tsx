import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Calendar, Download, TrendingUp, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Reports() {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('30days');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });

  const loadStats = () => {
    const orders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    const installments = JSON.parse(localStorage.getItem('wcs_installments') || '[]');
    const users = JSON.parse(localStorage.getItem('wcs_users') || '[]');

    let revenue = 0;
    
    // Sum from orders (paid now)
    orders.forEach((o: any) => {
      if (o.payment?.status === 'Success' || o.payment?.paidNow > 0) {
        revenue += o.payment.paidNow || o.payment.amount || o.price || 0;
      }
    });

    // Sum from paid installments
    installments.forEach((plan: any) => {
      plan.installments.forEach((inst: any) => {
        if (inst.status === 'Paid') revenue += inst.amount;
      });
    });

    const numOrders = orders.length;

    setStats({
      totalRevenue: revenue,
      totalOrders: numOrders,
      totalCustomers: users.length,
      averageOrderValue: numOrders > 0 ? Math.round(revenue / numOrders) : 0
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDownload = () => {
    alert('Generating report download...');
    // Real export logic would go here
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">System Reports</h2>
          <p className="text-neutral-500 font-medium mt-1">Analytics, revenue, and performance metrics</p>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Total Revenue
          </div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm mb-3">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Total Orders
          </div>
          <div className="text-3xl font-black text-neutral-900">{stats.totalOrders}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm mb-3">
            <Users className="w-5 h-5 text-blue-600" />
            Total Customers
          </div>
          <div className="text-3xl font-black text-neutral-900">{stats.totalCustomers}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm mb-3">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Avg. Order Value
          </div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.averageOrderValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
            <button 
              onClick={() => setReportType('revenue')}
              className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-colors", reportType === 'revenue' ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
            >
              Revenue
            </button>
            <button 
              onClick={() => setReportType('orders')}
              className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-colors", reportType === 'orders' ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
            >
              Orders
            </button>
            <button 
              onClick={() => setReportType('customers')}
              className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-colors", reportType === 'customers' ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
            >
              Customers
            </button>
          </div>
          
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm font-bold text-neutral-700">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
        </div>

                <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {reportType === 'revenue' ? (
              <AreaChart data={[
                { name: 'Mon', total: 12000 },
                { name: 'Tue', total: 18000 },
                { name: 'Wed', total: 15000 },
                { name: 'Thu', total: 24000 },
                { name: 'Fri', total: 19000 },
                { name: 'Sat', total: 29000 },
                { name: 'Sun', total: 32000 }
              ]}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `৳${val}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`৳${val}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            ) : reportType === 'orders' ? (
              <BarChart data={[
                { name: 'Mon', orders: 12 },
                { name: 'Tue', orders: 18 },
                { name: 'Wed', orders: 15 },
                { name: 'Thu', orders: 24 },
                { name: 'Fri', orders: 19 },
                { name: 'Sat', orders: 29 },
                { name: 'Sun', orders: 32 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            ) : (
              <LineChart data={[
                { name: 'Mon', customers: 4 },
                { name: 'Tue', customers: 7 },
                { name: 'Wed', customers: 5 },
                { name: 'Thu', customers: 9 },
                { name: 'Fri', customers: 6 },
                { name: 'Sat', customers: 11 },
                { name: 'Sun', customers: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
