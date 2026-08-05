import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, Paperclip, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CustomOrder {
  id: string;
  client: string;
  type: string;
  budget: string;
  timeline: string;
  requirements: string;
  referenceUrl: string;
  status: 'Pending' | 'Reviewing' | 'Quotation Ready' | 'Approved' | 'Rejected';
  date: string;
  files: string[];
}

const INITIAL_ORDERS: CustomOrder[] = [];

export function CustomOrders() {
  const localOrdersRaw = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
  const localOrders = localOrdersRaw.map((o: any) => ({
    ...o,
    status: o.status as CustomOrder['status']
  }));
  const [orders, setOrders] = useState<CustomOrder[]>([...localOrders, ...INITIAL_ORDERS]);
  const [filter, setFilter] = useState('All');
  const [viewOrder, setViewOrder] = useState<CustomOrder | null>(null);

  const updateStatus = (id: string, newStatus: CustomOrder['status']) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    
    // Also update localStorage
    const storedOrdersRaw = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
    const storedOrders = storedOrdersRaw.map((o: any) => o.id === id ? { ...o, status: newStatus } : o);
    localStorage.setItem('wcs_custom_orders', JSON.stringify(storedOrders));

    if (viewOrder && viewOrder.id === id) {
      setViewOrder({ ...viewOrder, status: newStatus });
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status.includes(filter) || (filter === 'Pending' && o.status === 'Pending'));

  if (viewOrder) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Order Details</h2>
          <button onClick={() => setViewOrder(null)} className="text-neutral-500 hover:text-neutral-900 font-bold">Back to list</button>
        </div>
        
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mb-1">{viewOrder.id}</div>
              <h3 className="font-black text-neutral-900 text-xl">{viewOrder.client}</h3>
            </div>
            <span className={cn(
                "px-3 py-1 rounded-lg text-sm font-bold",
                viewOrder.status === 'Pending' ? "bg-amber-100 text-amber-700" : 
                viewOrder.status === 'Reviewing' ? "bg-blue-100 text-blue-700" : 
                viewOrder.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : 
                viewOrder.status === 'Rejected' ? "bg-rose-100 text-rose-700" : "bg-neutral-100 text-neutral-700"
              )}>
                {viewOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-bold text-neutral-500 mb-1">Project Type</div>
              <div className="font-bold text-neutral-900">{viewOrder.type}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-500 mb-1">Budget</div>
              <div className="font-bold text-neutral-900">{viewOrder.budget}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-500 mb-1">Timeline</div>
              <div className="font-bold text-neutral-900">{viewOrder.timeline}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-500 mb-1">Reference Website</div>
              <a href={`https://${viewOrder.referenceUrl}`} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:underline">{viewOrder.referenceUrl}</a>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm font-bold text-neutral-500 mb-1">Requirements</div>
              <div className="p-4 bg-neutral-50 rounded-xl text-neutral-700 text-sm whitespace-pre-wrap leading-relaxed">{viewOrder.requirements}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm font-bold text-neutral-500 mb-2">Uploaded Files</div>
              <div className="flex gap-3 flex-wrap">
                {viewOrder.files.length > 0 ? viewOrder.files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    <Paperclip className="w-4 h-4" /> {file}
                  </div>
                )) : <span className="text-sm text-neutral-400">No files uploaded.</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-neutral-100">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <MessageSquare className="w-4 h-4" /> Reply to Client
            </button>
            <div className="flex-1"></div>
            {viewOrder.status !== 'Approved' && viewOrder.status !== 'Rejected' && (
              <>
                <button onClick={() => updateStatus(viewOrder.id, 'Rejected')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button onClick={() => updateStatus(viewOrder.id, 'Approved')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-colors">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Custom Website Requests</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['All', 'Pending', 'Reviewing', 'Approved'].map(f => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm flex flex-col hover:border-indigo-300 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mb-2">{order.id}</div>
                <h3 className="font-black text-neutral-900 text-lg">{order.client}</h3>
                <div className="text-sm font-medium text-neutral-500">{order.date}</div>
              </div>
              <div className="relative group/menu">
                <button onClick={() => setViewOrder(order)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex justify-between text-sm border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Project Type</span>
                <span className="font-bold text-neutral-900">{order.type}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Est. Budget</span>
                <span className="font-bold text-neutral-900">{order.budget}</span>
              </div>
               <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Status</span>
                <span className={cn(
                    "font-bold",
                    order.status === 'Pending' ? "text-amber-600" : 
                    order.status === 'Reviewing' ? "text-blue-600" : 
                    order.status === 'Approved' ? "text-emerald-600" : 
                    order.status === 'Rejected' ? "text-rose-600" : "text-neutral-900"
                  )}>
                    {order.status}
                  </span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-100">
               <button onClick={() => setViewOrder(order)} className="w-full bg-neutral-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-neutral-800 transition-colors">
                  View Details
               </button>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500">
            No orders found matching the filter.
          </div>
        )}
      </div>
    </div>
  );
}
