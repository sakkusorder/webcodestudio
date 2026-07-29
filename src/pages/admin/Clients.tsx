import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  totalOrders: number;
}

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Alice Cooper', email: 'alice@example.com', phone: '+1 234 567 890', status: 'Active', joinDate: '2026-05-10', totalOrders: 3 },
  { id: '2', name: 'Bob Builder', email: 'bob@example.com', phone: '+1 987 654 321', status: 'Active', joinDate: '2026-06-21', totalOrders: 1 },
  { id: '3', name: 'Charlie Day', email: 'charlie@example.com', phone: '+1 555 123 456', status: 'Inactive', joinDate: '2025-11-05', totalOrders: 0 },
];

export function Clients() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Clients</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>
          <button className="p-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 shadow-sm transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="font-bold text-neutral-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-900 font-medium flex items-center gap-2"><Mail className="w-3 h-3 text-neutral-400" /> {client.email}</div>
                    <div className="text-neutral-500 text-xs flex items-center gap-2 mt-1"><Phone className="w-3 h-3 text-neutral-400" /> {client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-700'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-900">{client.totalOrders}</td>
                  <td className="px-6 py-4 font-medium text-neutral-600">{client.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
