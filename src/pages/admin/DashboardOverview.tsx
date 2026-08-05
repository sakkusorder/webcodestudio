import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingCart, CheckCircle, Activity, 
  ChevronRight, PlusCircle, Tag, Globe, DollarSign,
  TrendingUp, AlertCircle, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STATS = [
  { label: 'Total Customers', value: '0', change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
  { label: 'Website Orders', value: '0', change: '+8%', color: 'text-blue-600', bg: 'bg-blue-50', icon: ShoppingCart },
  { label: 'Completed Projects', value: '0', change: '+15%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
  { label: 'Active Projects', value: '0', change: '+5%', color: 'text-amber-600', bg: 'bg-amber-50', icon: Activity },
  { label: 'Total Revenue', value: '$0', change: '+22%', color: 'text-purple-600', bg: 'bg-purple-50', icon: DollarSign },
  { label: 'Down Payments', value: '$0', change: '+10%', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: DollarSign },
  { label: 'Installment Revenue', value: '$0', change: '+18%', color: 'text-teal-600', bg: 'bg-teal-50', icon: TrendingUp },
  { label: 'Pending Payments', value: '$0', change: '-2%', color: 'text-rose-600', bg: 'bg-rose-50', icon: Clock },
  { label: 'Overdue Payments', value: '$0', change: '-5%', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
  { label: 'Monthly Revenue', value: '$0', change: '+12%', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', icon: DollarSign },
  { label: 'Yearly Revenue', value: '$0', change: '+25%', color: 'text-pink-600', bg: 'bg-pink-50', icon: DollarSign },
];

const REVENUE_DATA: any[] = [];

const ORDERS_DATA: any[] = [];


  // removed static RECENT_ORDERS



export function DashboardOverview() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentOrders = () => {
      const customOrdersRaw = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
      const customOrders = customOrdersRaw.map((o: any) => ({
        id: o.id,
        client: o.client,
        type: 'Custom',
        amount: o.budget,
        status: o.status,
        date: o.date
      }));

      const readyOrdersRaw = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
      const readyOrders = readyOrdersRaw.map((o: any) => ({
        id: o.id,
        client: o.customer.fullName,
        type: 'Website',
        amount: `${o.product.price}`,
        status: o.payment.option === 'installment' ? 'Installment' : o.payment.paidNow > 0 ? 'Paid' : 'Pending',
        date: new Date(o.createdAt).toLocaleDateString()
      }));

      setRecentOrders([...customOrders, ...readyOrders].slice(0, 10)); // Just 10 recent
    };
    
    fetchRecentOrders();
    window.addEventListener('storage', fetchRecentOrders);
    const interval = setInterval(fetchRecentOrders, 1000);
    return () => {
      window.removeEventListener('storage', fetchRecentOrders);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/websites" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
          <PlusCircle className="w-4 h-4" /> Add Website
        </Link>
        <Link to="/admin/categories" className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
          <Tag className="w-4 h-4 text-neutral-400" /> Create Category
        </Link>
        <Link to="/admin/reports" className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
          <Activity className="w-4 h-4 text-neutral-400" /> View Analytics
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn("text-xs font-bold px-2 py-1 rounded-md", stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : stat.change === 'Today' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600")}>
                {stat.change}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</div>
              <div className="text-2xl font-black text-neutral-900 leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900">Revenue Overview</h2>
            <select className="text-sm font-bold bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-600">
              <option>Last 7 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900">Website Orders</h2>
            <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-600"></div>Ready</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400"></div>Custom</div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDERS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="ready" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                <Bar dataKey="custom" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col lg:col-span-3">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
            <Link to="/admin/custom-orders" className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider bg-neutral-50/50">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">{order.id}</td>
                    <td className="px-6 py-4 font-bold text-neutral-900">
                      {order.client}
                      <div className="text-xs text-neutral-500 font-medium">{order.type} Order</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                        order.status === 'Pending' ? "bg-amber-100 text-amber-700" : order.status === 'Reviewing' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
