import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Download, CheckCircle, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReadyOrder {
  id: string;
  website: string;
  client: string;
  price: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Installment';
  deliveryDate: string;
}

const INITIAL_ORDERS: ReadyOrder[] = [];

export function ReadyOrders() {
  const localOrdersRaw = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
  const localOrders = localOrdersRaw.map((o: any) => ({
    id: o.id,
    website: o.product.name,
    client: o.customer.fullName,
    price: `$${o.product.price}`,
    paymentStatus: o.payment.option === 'installment' ? 'Installment' : o.payment.paidNow > 0 ? 'Paid' : 'Pending',
    deliveryDate: new Date(o.createdAt).toLocaleDateString()
  }));
  const [orders, setOrders] = useState<ReadyOrder[]>([...localOrders, ...INITIAL_ORDERS]);
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.paymentStatus === filter);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Ready Website Orders</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['All', 'Paid', 'Pending'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors whitespace-nowrap",
                filter === f ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Delivery Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-neutral-900">{order.website}</td>
                  <td className="px-6 py-4 font-medium text-neutral-600">{order.client}</td>
                  <td className="px-6 py-4 font-bold text-neutral-900">{order.price}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      order.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                      order.paymentStatus === 'Failed' ? "bg-rose-100 text-rose-700" :
                      order.paymentStatus === 'Installment' ? "bg-indigo-100 text-indigo-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">{order.deliveryDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="View Invoice" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><FileText className="w-4 h-4" /></button>
                      {order.paymentStatus === 'Paid' && (
                        <button title="Download Files" className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
