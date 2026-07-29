import React from 'react';
import { 
  BarChart, Users, ShoppingCart, CheckCircle, Clock, 
  ChevronRight, PlusCircle, Tag, Globe, Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const STATS = [
  { label: 'Total Users', value: '1,248', change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
  { label: 'Total Websites', value: '86', change: '+5%', color: 'text-blue-600', bg: 'bg-blue-50', icon: Globe },
  { label: 'Total Orders', value: '384', change: '+8%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShoppingCart },
  { label: 'Pending Orders', value: '32', change: '-2%', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  { label: 'Completed Orders', value: '210', change: '+15%', color: 'text-purple-600', bg: 'bg-purple-50', icon: CheckCircle },
  { label: 'Recent Activities', value: '14', change: 'Today', color: 'text-rose-600', bg: 'bg-rose-50', icon: Activity },
];

const RECENT_ORDERS = [
  { id: 'ORD-2091', client: 'John Smith', type: 'Custom', amount: '$2,500', status: 'Pending', date: '10 mins ago' },
  { id: 'ORD-2092', client: 'TechFlow Inc.', type: 'Ready', amount: '$299', status: 'Completed', date: '2 hours ago' },
  { id: 'ORD-2093', client: 'Emma Studio', type: 'Custom', amount: '$1,200', status: 'Reviewing', date: '1 day ago' },
];

const LATEST_USERS = [
  { name: 'Alice Cooper', email: 'alice@example.com', date: 'Just now' },
  { name: 'Bob Builder', email: 'bob@example.com', date: '2 hrs ago' },
  { name: 'Charlie Day', email: 'charlie@example.com', date: '5 hrs ago' },
];

export function DashboardOverview() {
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn("text-xs font-bold px-2 py-1 rounded-md", stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : stat.change === 'Today' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600")}>
                {stat.change}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-neutral-900 leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
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
                {RECENT_ORDERS.map((order, i) => (
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

        {/* Latest Users */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Latest Users</h2>
            <Link to="/admin/users" className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 divide-y divide-neutral-100">
            {LATEST_USERS.map((user, i) => (
              <div key={i} className="p-6 flex items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-900 truncate">{user.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                </div>
                <div className="text-xs font-medium text-neutral-400 shrink-0">{user.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
