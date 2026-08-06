import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone, MapPin, ExternalLink, ArrowLeft, CheckCircle, Clock, FileText, DollarSign, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

const MOCK_USERS: User[] = [
  { id: 'usr-1', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '01711000000', address: 'Dhaka, Bangladesh', status: 'Active', joinDate: '2026-07-15' },
  { id: 'usr-2', name: 'Karim Hasan', email: 'karim@example.com', phone: '01811000000', address: 'Chittagong, Bangladesh', status: 'Active', joinDate: '2026-07-20' },
  { id: 'usr-3', name: 'Jalal Ahmed', email: 'jalal@example.com', phone: '01911000000', address: 'Sylhet, Bangladesh', status: 'Inactive', joinDate: '2026-08-01' },
];

export function Clients() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('wcs_users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(MOCK_USERS);
      localStorage.setItem('wcs_users', JSON.stringify(MOCK_USERS));
    }

    const o = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    const co = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
    setOrders([...o, ...co]);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const getUserOrders = (userId: string) => {
    // Since we don't strictly tie mock orders to user IDs right now, 
    // let's just return all orders for the first user to demonstrate the UI,
    // or return none for others.
    if (userId === 'usr-1') return orders;
    return [];
  };

  if (selectedUser) {
    const userOrders = getUserOrders(selectedUser.id);
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.payment?.amount || 0), 0);

    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
        <button 
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mb-4">
              {selectedUser.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-neutral-900">{selectedUser.name}</h2>
            <p className="text-sm text-neutral-500 font-medium mb-6">Joined {selectedUser.joinDate}</p>

            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <Mail className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="text-xs text-neutral-500 font-bold">Email</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedUser.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <Phone className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="text-xs text-neutral-500 font-bold">Phone</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedUser.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="text-xs text-neutral-500 font-bold">Address</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedUser.address || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-neutral-900">{userOrders.length}</div>
                  <div className="text-sm font-bold text-neutral-500">Total Orders</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-neutral-900">৳{totalSpent.toLocaleString()}</div>
                  <div className="text-sm font-bold text-neutral-500">Total Spent</div>
                </div>
              </div>
            </div>

            {/* Websites / Orders Info */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Order History</h3>
              <div className="space-y-4">
                {userOrders.map((order, i) => (
                  <div key={i} className="p-4 border border-neutral-100 rounded-2xl hover:border-indigo-100 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="text-sm text-indigo-600 font-bold mb-1">ID: {order.id}</div>
                        <div className="font-bold text-neutral-900">{order.templateId ? `Template: ${order.templateId}` : 'Custom Website Project'}</div>
                        <div className="text-xs font-medium text-neutral-500 mt-1">Ordered: {order.createdAt || order.date}</div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        order.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {order.status || 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Payment Type</div>
                        <div className="font-bold text-neutral-900 capitalize">{order.payment?.option || 'Full Payment'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Total Price</div>
                        <div className="font-bold text-neutral-900">৳{order.payment?.amount?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Paid Amount</div>
                        <div className="font-bold text-emerald-600">৳{(order.payment?.paidNow || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Remaining</div>
                        <div className="font-bold text-rose-600">৳{((order.payment?.amount || 0) - (order.payment?.paidNow || 0)).toLocaleString()}</div>
                      </div>
                    </div>

                    {order.payment?.option === 'installment' && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-600" />
                          Installment Details
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-white border border-neutral-200 rounded-lg">
                            <div className="text-[10px] font-bold text-neutral-500">Total</div>
                            <div className="font-bold text-neutral-900">6</div>
                          </div>
                          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <div className="text-[10px] font-bold text-emerald-600">Paid</div>
                            <div className="font-bold text-emerald-700">2</div>
                          </div>
                          <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                            <div className="text-[10px] font-bold text-amber-600">Pending</div>
                            <div className="font-bold text-amber-700">4</div>
                          </div>
                          <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                            <div className="text-[10px] font-bold text-rose-600">Missed</div>
                            <div className="font-bold text-rose-700">0</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {userOrders.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 font-medium">No orders found for this user.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{t('admin.users')}</h2>
          <p className="text-neutral-500 font-medium mt-1">Manage platform users and clients</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <button className="p-3 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-100 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 font-bold text-neutral-400 text-sm">User</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Contact Info</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Join Date</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-center">Orders</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Status</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.map(user => {
                const uOrders = getUserOrders(user.id);
                return (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="font-bold text-neutral-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-neutral-900">{user.email}</div>
                      <div className="text-xs font-medium text-neutral-500 mt-1">{user.phone}</div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-neutral-700">{user.joinDate}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-bold text-neutral-900">{uOrders.length}</span>
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        user.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-600"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }} title="View Profile" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
