import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, Download, Calendar, DollarSign, Activity, AlertCircle, ArrowLeft, Copy, User, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
  });

  const loadOrders = () => {
    const templateOrders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    const customOrders = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
    
    // Normalize custom orders to fit the structure roughly
    const normalizedCustom = customOrders.map((o: any) => ({
      ...o,
      isCustom: true,
      product: { name: 'Custom Website', category: o.type, price: parseInt(o.budget) || 0 },
      payment: {
        option: 'full',
        amount: parseInt(o.budget) || 0,
        paidNow: 0,
        remaining: parseInt(o.budget) || 0,
      },
      customer: {
        fullName: o.client,
        phone: 'N/A',
        email: 'N/A'
      }
    }));
    
    const all = [...templateOrders, ...normalizedCustom].sort((a: any, b: any) => {
      return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
    });
    
    setOrders(all);
    
    setStats({
      total: all.length,
      pending: all.filter(o => o.status === 'Pending Verification' || o.status === 'Pending').length,
      active: all.filter(o => o.status === 'Confirmed' || o.status === 'In Progress' || o.status === 'Paid').length,
      completed: all.filter(o => o.status === 'Completed' || o.status === 'Delivered').length,
    });
  };

  useEffect(() => {
    loadOrders();
    const handleStorageChange = () => loadOrders();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                       (o.customer?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                       (o.customer?.phone || '').includes(searchTerm);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (order: any) => {
    if(confirm('Approve this payment and confirm the order?')) {
      const updated = orders.map(o => {
        if(o.id === order.id) {
          return {
            ...o,
            status: o.payment?.option === 'full' ? 'Paid' : 'Confirmed',
            payment: {
              ...o.payment,
              status: 'Approved'
            }
          };
        }
        return o;
      });
      
      // Update local storage
      const updatedTemplateOrders = updated.filter(o => !o.isCustom);
      const updatedCustomOrders = updated.filter(o => o.isCustom).map(o => {
        const { isCustom, product, payment, customer, ...rest } = o;
        return rest;
      });
      
      localStorage.setItem('wcs_orders', JSON.stringify(updatedTemplateOrders));
      localStorage.setItem('wcs_custom_orders', JSON.stringify(updatedCustomOrders));
      
      // If installment, create installment plan
      if(order.payment?.option === 'installment') {
        createInstallmentPlan(order);
      }
      
      loadOrders();
      setSelectedOrder(null);
    }
  };

  const handleReject = (order: any) => {
    const reason = prompt('Please enter the reason for rejection:');
    if(reason !== null) {
      const updated = orders.map(o => {
        if(o.id === order.id) {
          return {
            ...o,
            status: 'Rejected',
            rejectReason: reason,
            payment: {
              ...o.payment,
              status: 'Rejected'
            }
          };
        }
        return o;
      });
      
      const updatedTemplateOrders = updated.filter(o => !o.isCustom);
      localStorage.setItem('wcs_orders', JSON.stringify(updatedTemplateOrders));
      loadOrders();
      setSelectedOrder(null);
    }
  };

  const createInstallmentPlan = (order: any) => {
    const existing = JSON.parse(localStorage.getItem('wcs_installments') || '[]');
    // Check if exists
    if(existing.find((e: any) => e.orderId === order.id)) return;
    
    // Example: 12 months, remaining / 12
    const remaining = order.payment.remaining || 0;
    // Just default to 6 installments for now if not specified
    const months = 6; 
    const monthlyAmount = Math.ceil(remaining / months);
    
    const installments = Array.from({length: months}).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      return {
        id: `INS-${order.id}-${i+1}`,
        number: i + 1,
        amount: (i === months - 1) ? (remaining - (monthlyAmount * (months - 1))) : monthlyAmount,
        dueDate: date.toISOString().split('T')[0],
        status: 'Pending',
      };
    });

    const newPlan = {
      orderId: order.id,
      customerName: order.customer.fullName,
      customerPhone: order.customer.phone,
      websiteName: order.product.name,
      totalRemaining: remaining,
      totalMonths: months,
      installments
    };
    
    localStorage.setItem('wcs_installments', JSON.stringify([...existing, newPlan]));
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert('Order ID Copied: ' + id);
  };

  if(selectedOrder) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-colors">
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
            {(selectedOrder.status === 'Pending Verification' || selectedOrder.status === 'Pending') && (
              <>
                <button onClick={() => handleReject(selectedOrder)} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button onClick={() => handleApprove(selectedOrder)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                  <CheckCircle className="w-4 h-4" />
                  Approve Payment
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-neutral-900">{selectedOrder.id}</h2>
                  <button onClick={() => handleCopyId(selectedOrder.id)} className="text-neutral-400 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                </div>
                <div className="text-sm text-neutral-500 font-medium">Placed on {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-neutral-500 mb-1">Status</div>
                <span className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2",
                  selectedOrder.status === 'Pending Verification' || selectedOrder.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                  selectedOrder.status === 'Paid' || selectedOrder.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" :
                  selectedOrder.status === 'Rejected' ? "bg-rose-50 text-rose-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {selectedOrder.status === 'Pending Verification' && <AlertCircle className="w-4 h-4" />}
                  {selectedOrder.status === 'Confirmed' && <CheckCircle className="w-4 h-4" />}
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Customer & Website Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Customer Information
                </h3>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Name</div>
                    <div className="font-bold text-neutral-900">{selectedOrder.customer?.fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Mobile</div>
                    <div className="font-bold text-neutral-900">{selectedOrder.customer?.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Email</div>
                    <div className="font-medium text-neutral-900">{selectedOrder.customer?.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Website Information
                </h3>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Website Model / ID</div>
                    <div className="font-bold text-neutral-900">{selectedOrder.product?.name} {selectedOrder.templateId ? `(${selectedOrder.templateId})` : ''}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Category</div>
                    <div className="font-bold text-neutral-900">{selectedOrder.product?.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Base Price</div>
                    <div className="font-bold text-neutral-900">৳{selectedOrder.product?.price?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-neutral-900">Project Specifics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Customer's Website Name</div>
                  <div className="font-bold text-neutral-900">{selectedOrder.projectInfo?.websiteName || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Delivery Time</div>
                  <div className="font-bold text-neutral-900">{selectedOrder.projectInfo?.deliveryTime || 'Standard'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Extra Features</div>
                  <div className="font-medium text-neutral-700 bg-neutral-50 p-4 rounded-xl">{selectedOrder.projectInfo?.extraFeatures || 'None specified'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Additional Notes</div>
                  <div className="font-medium text-neutral-700 bg-neutral-50 p-4 rounded-xl">{selectedOrder.projectInfo?.notes || 'No notes'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Payment Information
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-600">Payment Type</span>
                  <span className="font-bold text-neutral-900 capitalize">{selectedOrder.payment?.option || 'Full Payment'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-600">Base Price</span>
                  <span className="font-bold text-neutral-900">৳{selectedOrder.product?.price?.toLocaleString() || 0}</span>
                </div>
                {selectedOrder.payment?.urgentCharge > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-600">Emergency Delivery Charge</span>
                    <span className="font-bold text-neutral-900">+৳{selectedOrder.payment?.urgentCharge?.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">Total Final Price</span>
                  <span className="text-lg font-black text-indigo-600">৳{selectedOrder.payment?.amount?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-600">{selectedOrder.payment?.option === 'installment' ? 'Down Payment' : 'Paid Amount'}</span>
                  <span className="font-bold text-emerald-600">৳{selectedOrder.payment?.paidNow?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-600">Remaining Amount</span>
                  <span className="font-bold text-rose-600">৳{selectedOrder.payment?.remaining?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Transaction Verification */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Transaction Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Transaction ID (TrxID)</div>
                  <div className="font-mono font-bold text-neutral-900 bg-neutral-50 px-3 py-2 rounded-lg break-all">
                    {selectedOrder.payment?.trxId || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Payment Date</div>
                  <div className="font-medium text-neutral-900">{selectedOrder.payment?.date ? new Date(selectedOrder.payment.date).toLocaleString() : 'N/A'}</div>
                </div>
                {selectedOrder.payment?.screenshot && (
                  <div>
                    <div className="text-xs text-neutral-500 font-bold uppercase mb-2">Screenshot</div>
                    <a href={selectedOrder.payment.screenshot} target="_blank" rel="noreferrer" className="block relative group rounded-xl overflow-hidden border border-neutral-200">
                      <img src={selectedOrder.payment.screenshot} alt="Payment Screenshot" className="w-full aspect-[4/3] object-cover" />
                      <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-sm">
                        View Full Image
                      </div>
                    </a>
                  </div>
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
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Order Management</h2>
          <p className="text-neutral-500 font-medium mt-1">Review orders and verify down payments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-indigo-600" /> Total Orders</div>
          <div className="text-3xl font-black text-neutral-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-600" /> Pending Verification</div>
          <div className="text-3xl font-black text-neutral-900">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Active Projects</div>
          <div className="text-3xl font-black text-neutral-900">{stats.active}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Completed</div>
          <div className="text-3xl font-black text-neutral-900">{stats.completed}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 font-bold text-neutral-400 text-sm">Order Details</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Customer</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Payment</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Date</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Status</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order, idx) => (
                <tr key={order.id || idx} className="hover:bg-neutral-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="py-4">
                    <div className="font-bold text-neutral-900 mb-1">{order.product?.name || 'Custom Project'}</div>
                    <div className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      {order.id}
                      <button onClick={(e) => { e.stopPropagation(); handleCopyId(order.id); }} className="hover:text-indigo-600"><Copy className="w-3 h-3" /></button>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-bold text-neutral-900 mb-1">{order.customer?.fullName}</div>
                    <div className="text-xs font-medium text-neutral-500">{order.customer?.phone}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-bold text-neutral-900 mb-1">৳{order.payment?.amount?.toLocaleString() || 0}</div>
                    <div className="text-xs font-bold text-neutral-500 capitalize px-2 py-0.5 bg-neutral-100 rounded inline-block">
                      {order.payment?.option || 'Full'}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-neutral-700">{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                      order.status === 'Pending Verification' || order.status === 'Pending' ? "bg-amber-50 text-amber-600" : 
                      order.status === 'Paid' || order.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" :
                      order.status === 'Rejected' ? "bg-rose-50 text-rose-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} title="View Details" className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        Review Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                    No orders found.
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
