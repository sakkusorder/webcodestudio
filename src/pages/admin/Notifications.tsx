import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Search, Filter, Trash2, ShoppingCart, MessageSquare, AlertCircle, Clock, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = () => {
    const loaded = JSON.parse(localStorage.getItem('wcs_admin_notifications') || '[]');
    setNotifications(loaded.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadNotifications();
    const handleStorageChange = () => loadNotifications();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [filter, setFilter] = useState('All');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('wcs_admin_notifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('wcs_admin_notifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearAll = () => {
    if(confirm('Are you sure you want to clear all notifications?')) {
      localStorage.setItem('wcs_admin_notifications', '[]');
      setNotifications([]);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Order': return <ShoppingCart className="w-5 h-5 text-indigo-600" />;
      case 'Support': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'Payment': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'Alert': return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default: return <Bell className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'Order': return 'bg-indigo-50';
      case 'Support': return 'bg-emerald-50';
      case 'Payment': return 'bg-emerald-50';
      case 'Alert': return 'bg-rose-50';
      default: return 'bg-neutral-50';
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Notification Center</h2>
          <p className="text-neutral-500 font-medium mt-1">Real-time alerts and system notifications</p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllAsRead} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mark all read
          </button>
          <button onClick={clearAll} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors shadow-sm flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Notifications</option>
            <option value="Unread">Unread</option>
            <option value="Order">Orders</option>
            <option value="Payment">Payments</option>
            <option value="Support">Support</option>
            <option value="Alert">Alerts</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={cn(
                "group flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-5 border rounded-2xl transition-all cursor-pointer",
                notif.read ? "bg-white border-neutral-100" : "bg-indigo-50/30 border-indigo-100"
              )}
            >
              <div className="flex gap-4 items-start">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", getBg(notif.type))}>
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={cn("font-bold transition-colors", notif.read ? "text-neutral-900" : "text-indigo-900")}>
                      {notif.title}
                    </h3>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                  </div>
                  <p className="text-sm font-medium text-neutral-600 mb-2">{notif.message}</p>
                  <div className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredNotifs.length === 0 && (
            <div className="text-center py-12 text-neutral-500 font-medium">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
