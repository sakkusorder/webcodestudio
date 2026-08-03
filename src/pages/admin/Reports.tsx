import React, { useState } from 'react';
import { 
  BarChart, Users, ShoppingCart, TrendingUp, DollarSign, Download, Filter, 
  FileText, Activity, Globe, Calendar, CreditCard, ChevronDown, Search,
  Clock, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const TABS = [
  { id: 'sales', label: 'Sales Analytics', icon: DollarSign },
  { id: 'website', label: 'Website Analytics', icon: Globe },
  { id: 'customer', label: 'Customer Analytics', icon: Users },
  { id: 'emi', label: 'EMI Analytics', icon: CreditCard },
  { id: 'logs', label: 'Activity Logs', icon: Activity },
];

const SALES_DATA = [
  { date: '2026-07-01', ready: 1200, custom: 800, emi: 400 },
  { date: '2026-07-08', ready: 1500, custom: 1200, emi: 600 },
  { date: '2026-07-15', ready: 1100, custom: 2000, emi: 800 },
  { date: '2026-07-22', ready: 1800, custom: 1500, emi: 500 },
  { date: '2026-07-29', ready: 2200, custom: 1800, emi: 900 },
];

const CATEGORY_DATA = [
  { name: 'E-commerce', value: 45, color: '#4f46e5' },
  { name: 'Portfolio', value: 25, color: '#0ea5e9' },
  { name: 'Corporate', value: 20, color: '#8b5cf6' },
  { name: 'Blog', value: 10, color: '#ec4899' },
];

const CUSTOMER_GROWTH = [
  { month: 'Jan', users: 150 },
  { month: 'Feb', users: 280 },
  { month: 'Mar', users: 410 },
  { month: 'Apr', users: 590 },
  { month: 'May', users: 820 },
  { month: 'Jun', users: 1050 },
  { month: 'Jul', users: 1248 },
];

const AUDIT_LOGS = [
  { id: 1, action: 'Payment Completed', user: 'John Smith', detail: 'Paid $1,200 for Custom Order #ORD-2091', time: '10 mins ago', type: 'payment' },
  { id: 2, action: 'Installment Paid', user: 'Emma Studio', detail: 'Paid $299 EMI for #ORD-1980', time: '2 hours ago', type: 'emi' },
  { id: 3, action: 'Order Created', user: 'TechFlow Inc.', detail: 'Ordered Ready Template "E-Store Pro"', time: '5 hours ago', type: 'order' },
  { id: 4, action: 'Website Updated', user: 'Admin', detail: 'Updated price for "Corporate Lite"', time: '1 day ago', type: 'admin' },
  { id: 5, action: 'Customer Login', user: 'Alice Cooper', detail: 'Logged in from IP 192.168.1.1', time: '1 day ago', type: 'auth' },
];

export function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('This Month');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    
    // Simulating export generation
    setTimeout(() => {
      const data = AUDIT_LOGS.map(log => ({
        Action: log.action,
        User: log.user,
        Details: log.detail,
        Time: log.time
      }));

      if (type === 'excel' || type === 'csv') {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `WebCodeStudio_Report_${format(new Date(), 'yyyyMMdd')}.${type === 'excel' ? 'xlsx' : 'csv'}`);
      } else if (type === 'pdf') {
        const doc = new jsPDF();
        doc.text("Web Code Studio - Analytics Report", 14, 15);
        
        // @ts-ignore
        doc.autoTable({
          head: [['Action', 'User', 'Details', 'Time']],
          body: data.map(row => [row.Action, row.User, row.Details, row.Time]),
          startY: 25,
        });
        
        doc.save(`WebCodeStudio_Report_${format(new Date(), 'yyyyMMdd')}.pdf`);
      }
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Analytics & Reports</h2>
          <p className="text-neutral-500 font-medium mt-1">Detailed metrics, EMI tracking, and activity logs</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-neutral-200 text-neutral-700 pl-4 pr-10 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
            <Calendar className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" /> Export {isExporting && '...'}
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
              <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Export PDF</button>
              <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Export Excel</button>
              <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Export CSV</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-1 flex overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Sales Analytics Tab */}
        {activeTab === 'sales' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Full Payment Revenue', value: '$84,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Down Payment Revenue', value: '$22,400', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Installment Revenue', value: '$17,600', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending Revenue', value: '$12,450', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-500 mb-1">{stat.label}</div>
                    <div className="text-xl font-black text-neutral-900">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-6">Sales Breakdown (Ready vs Custom vs EMI)</h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReady" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} dy={10} 
                      tickFormatter={(val) => format(new Date(val), 'MMM dd')} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(val) => format(new Date(val), 'MMM dd, yyyy')}
                    />
                    <Area type="monotone" dataKey="ready" stackId="1" stroke="#4f46e5" fill="url(#colorReady)" />
                    <Area type="monotone" dataKey="custom" stackId="1" stroke="#0ea5e9" fill="url(#colorCustom)" />
                    <Area type="monotone" dataKey="emi" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Website Analytics Tab */}
        {activeTab === 'website' && (
          <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-6">Category Performance</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {CATEGORY_DATA.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                    <span className="text-sm font-bold text-neutral-700">{c.name} ({c.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
               <h2 className="text-lg font-bold text-neutral-900 mb-6">Top Performing Websites</h2>
               <div className="space-y-4">
                 {[
                   { name: 'E-Store Pro', views: '12.4k', clicks: '3.2k', orders: 45, conv: '14%' },
                   { name: 'Corporate Lite', views: '8.2k', clicks: '1.8k', orders: 28, conv: '12%' },
                   { name: 'Agency Flow', views: '6.5k', clicks: '2.1k', orders: 22, conv: '16%' },
                   { name: 'Portfolio X', views: '5.1k', clicks: '900', orders: 15, conv: '11%' },
                 ].map((site, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                     <div>
                       <div className="font-bold text-neutral-900">{site.name}</div>
                       <div className="text-xs font-medium text-neutral-500 mt-1">
                         {site.views} Views • {site.clicks} Demo Clicks
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="font-bold text-indigo-600">{site.orders} Orders</div>
                       <div className="text-xs font-bold text-emerald-600">{site.conv} Conv. Rate</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Customer Analytics Tab */}
        {activeTab === 'customer' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-6">Customer Growth</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CUSTOMER_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* EMI Analytics Tab */}
        {activeTab === 'emi' && (
          <div className="animate-in fade-in duration-300 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total EMI Customers', value: '145', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Remaining EMI Balance', value: '$45,200', icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Expected This Month', value: '$8,400', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Collected This Month', value: '$6,200', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-500 mb-1">{stat.label}</div>
                    <div className="text-xl font-black text-neutral-900">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900">Overdue Installments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Amount Due</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {[
                      { name: 'Sarah Connor', order: 'ORD-1940', amount: '$150', due: '2026-07-28' },
                      { name: 'Mike Ross', order: 'ORD-1892', amount: '$299', due: '2026-07-30' },
                    ].map((due, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-neutral-900">{due.name}</td>
                        <td className="px-6 py-4 text-indigo-600 font-medium">{due.order}</td>
                        <td className="px-6 py-4 font-bold text-rose-600">{due.amount}</td>
                        <td className="px-6 py-4 text-neutral-500 font-medium">{due.due}</td>
                        <td className="px-6 py-4">
                          <button className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-800">
                            Send Reminder
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

        {/* Activity Logs Tab */}
        {activeTab === 'logs' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-bold text-neutral-900">System Activity Log</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search logs..." 
                      className="pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full sm:w-64"
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50">
                    <tr>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors group">
                        <td className="px-6 py-4 text-neutral-500 font-medium whitespace-nowrap">{log.time}</td>
                        <td className="px-6 py-4 font-bold text-neutral-900 whitespace-nowrap">{log.user}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap",
                            log.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                            log.type === 'emi' ? 'bg-blue-100 text-blue-700' :
                            log.type === 'order' ? 'bg-indigo-100 text-indigo-700' :
                            log.type === 'auth' ? 'bg-amber-100 text-amber-700' :
                            'bg-neutral-100 text-neutral-700'
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600 font-medium min-w-[250px]">{log.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-neutral-100 text-center">
                <button className="text-indigo-600 font-bold text-sm hover:text-indigo-800">Load More Logs</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
