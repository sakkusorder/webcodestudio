import React, { useState } from 'react';
import { Search, Bell, CheckCircle, Clock, Send, AlertCircle, PlusCircle, User, CreditCard, Globe, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Notifications() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'All' || ['Today', 'This Week', 'This Month'].includes(filter) || n.type === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase()) || n.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Notifications Center</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllAsRead} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 hover:bg-indigo-50 rounded-lg">Mark All as Read</button>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg">
            <Send className="w-4 h-4" /> Send Reminder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-500">Unread</div>
            <div className="text-2xl font-black text-neutral-900">{notifications.filter(n => !n.read).length}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-500">Action Required</div>
            <div className="text-2xl font-black text-neutral-900">{notifications.filter(n => n.type === 'Alert' && !n.read).length}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-500">Read Rate</div>
            <div className="text-2xl font-black text-neutral-900">
              {Math.round((notifications.filter(n => n.read).length / notifications.length) * 100) || 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-neutral-100 p-1 rounded-xl w-fit">
            {['All', 'Today', 'This Week', 'This Month', 'Order', 'Payment', 'Alert', 'Support', 'System'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  filter === f ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[250px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {filteredNotifications.length === 0 && (
            <div className="p-12 text-center text-neutral-500 font-medium text-sm">No notifications found.</div>
          )}
          {filteredNotifications.map(notification => (
            <div key={notification.id} className={cn("p-6 flex items-start gap-4 hover:bg-neutral-50 transition-colors relative", !notification.read && "bg-indigo-50/20")}>
              {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
              
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notification.type === 'Payment' ? "bg-emerald-100 text-emerald-600" :
                notification.type === 'Alert' ? "bg-rose-100 text-rose-600" : 
                notification.type === 'Order' ? "bg-blue-100 text-blue-600" : 
                notification.type === 'Support' ? "bg-amber-100 text-amber-600" : 
                "bg-indigo-100 text-indigo-600"
              )}>
                {notification.type === 'Payment' ? <CreditCard className="w-5 h-5" /> :
                 notification.type === 'Alert' ? <AlertCircle className="w-5 h-5" /> : 
                 notification.type === 'Order' ? <Globe className="w-5 h-5" /> :
                 notification.type === 'Support' ? <User className="w-5 h-5" /> :
                 <Bell className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-neutral-900 truncate">{notification.title}</h4>
                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{notification.type}</span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-400 shrink-0">{notification.date}</span>
                </div>
                <p className={cn("text-sm mb-3", !notification.read ? "font-semibold text-neutral-800" : "text-neutral-600")}>{notification.message}</p>
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                    <User className="w-4 h-4" /> {notification.user}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button onClick={() => handleMarkAsRead(notification.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-3 h-3" /> Mark as Read
                      </button>
                    )}
                    
                    {notification.type === 'Order' && (
                      <button className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                        View Order <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                    
                    {notification.type === 'Payment' && (
                      <button className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                        Verify Payment <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                    
                    {notification.type === 'Alert' && (
                      <button className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                        Send Reminder <Send className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
