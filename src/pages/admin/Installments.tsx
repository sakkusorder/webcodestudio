import React, { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Clock, Calendar, Download, Eye, ChevronRight, X, FileText, Check, FileDown, Bell, MessageSquare, CreditCard, User, Globe, Mail, Phone, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock Data
const SUMMARY_STATS = {
  totalOrders: 0,
  downPaymentReceived: 0,
  remainingAmount: 0,
  thisMonthDue: 0,
  overduePayments: 0,
  completedInstallments: 0,
  totalEmiRevenue: 0
};

const NOTIFICATIONS: any[] = [];

const INSTALLMENT_ORDERS: any[] = [];

export function Installments() {
  const [filter, setFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  // Close dropdown when clicking outside could be complex without a ref, so we'll just toggle for now.
  const toggleActionMenu = (idx: number) => {
    setActionMenuOpen(actionMenuOpen === idx ? null : idx);
  };

  const filteredInstallments = INSTALLMENT_ORDERS.filter(i => {
    const matchesFilter = filter === 'All' || i.status === filter;
    const matchesSearch = i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Up to Date': case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Overdue': case 'Failed': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Due': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Up to Date': case 'Paid': return <CheckCircle className="w-3 h-3" />;
      case 'Overdue': case 'Failed': return <AlertCircle className="w-3 h-3" />;
      case 'Due': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  if (selectedOrder) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-neutral-200 rounded-xl transition-colors bg-neutral-100 text-neutral-600">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-neutral-900">Order Details: {selectedOrder.orderId}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-neutral-500">EMI ID: {selectedOrder.id}</span>
              <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 border", getStatusColor(selectedOrder.status))}>
                {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
              <FileDown className="w-4 h-4" /> Export PDF
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              <MessageSquare className="w-4 h-4" /> Send Reminder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-4"><User className="w-5 h-5 text-indigo-600" /> Customer Information</h3>
            <div className="space-y-3 pt-2">
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Name</div>
                <div className="font-bold text-neutral-900">{selectedOrder.customerName}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Mobile</div>
                <div className="font-medium text-neutral-700 flex items-center gap-2"><Phone className="w-3 h-3" /> {selectedOrder.customerMobile}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Email</div>
                <div className="font-medium text-neutral-700 flex items-center gap-2"><Mail className="w-3 h-3" /> {selectedOrder.customerEmail}</div>
              </div>
            </div>
          </div>

          {/* Website Info */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-4"><Globe className="w-5 h-5 text-indigo-600" /> Website Information</h3>
            <div className="space-y-3 pt-2">
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Website Name</div>
                <div className="font-bold text-neutral-900">{selectedOrder.websiteName}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Category</div>
                  <div className="font-medium text-neutral-700">{selectedOrder.websiteCategory}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Status</div>
                  <div className="font-medium text-neutral-700">{selectedOrder.deliveryStatus}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Order Date</div>
                <div className="font-medium text-neutral-700">{selectedOrder.orderDate}</div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-4"><CreditCard className="w-5 h-5 text-indigo-600" /> Financial Summary</h3>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-neutral-500">Total Price</div>
                <div className="font-black text-neutral-900">${selectedOrder.totalPrice}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-neutral-500">Down Payment</div>
                <div className="font-black text-emerald-600">${selectedOrder.downPayment}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-neutral-500">Remaining Balance</div>
                <div className="font-black text-rose-600">${selectedOrder.remainingAmount}</div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                <div className="text-sm font-bold text-neutral-500">Selected EMI Plan</div>
                <div className="font-black text-indigo-600">{selectedOrder.planMonths} Months</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Installment Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-black text-neutral-900 text-lg">Monthly Installment Schedule</h3>
            <div className="text-sm font-bold text-neutral-500">
              Paid: <span className="text-emerald-600">{selectedOrder.monthsPaid}</span> / {selectedOrder.planMonths}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
                <tr>
                  <th className="px-6 py-4">No.</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Date</th>
                  <th className="px-6 py-4">Method / TXN ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {selectedOrder.schedule.map((emi: any, idx: number) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900">{emi.num}</td>
                    <td className="px-6 py-4 font-medium text-neutral-700">{emi.dueDate}</td>
                    <td className="px-6 py-4 font-black text-neutral-900">${emi.amount}</td>
                    <td className="px-6 py-4 font-medium text-neutral-500">{emi.paymentDate || '-'}</td>
                    <td className="px-6 py-4">
                      {emi.method ? (
                        <div>
                          <div className="font-bold text-neutral-900">{emi.method}</div>
                          <div className="text-xs text-neutral-500 font-mono">{emi.transactionId}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit border", getStatusColor(emi.status))}>
                        {getStatusIcon(emi.status)} {emi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {emi.receipt && (
                          <button className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="View Receipt">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        {(emi.status === 'Due' || emi.status === 'Overdue' || emi.status === 'Pending') ? (
                          <button 
                            className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button className="bg-neutral-100 text-neutral-400 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">
                            Verified
                          </button>
                        )}
                        <div className="relative">
                          <button onClick={() => toggleActionMenu(idx)} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {actionMenuOpen === idx && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden text-left">
                              <div className="py-1">
                                {(emi.status === 'Pending' || emi.status === 'Due' || emi.status === 'Overdue') && (
                                  <>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Approve Payment</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Mark as Paid (Offline)</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Change Due Date</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Apply Discount</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Apply Late Fee</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50">Waive Installment</button>
                                  </>
                                )}
                                {(emi.status === 'Paid') && (
                                  <>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Reject Payment</button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">Add Note</button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Installment Management</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-neutral-200 rounded-xl shadow-sm p-1">
            {['Today', 'This Week', 'This Month', 'This Year'].map(f => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  dateFilter === f ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-bold hover:bg-neutral-50 shadow-sm transition-colors text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Notifications Alert */}
      {NOTIFICATIONS.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertCircle className="w-5 h-5" /> Important Alerts ({NOTIFICATIONS.length})
          </div>
          <div className="space-y-2">
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-rose-100">
                <div>
                  <span className="font-bold text-neutral-900 mr-2">{n.text}</span>
                  <span className="text-sm font-medium text-neutral-500">({n.orderId} - {n.website})</span>
                </div>
                <div className="flex items-center gap-3">
                  {n.overdueDays > 0 && <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-md">{n.overdueDays} Days Overdue</span>}
                  <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">Take Action</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total Orders', value: SUMMARY_STATS.totalOrders, color: 'text-neutral-900' },
          { label: 'Down Payment', value: `$${SUMMARY_STATS.downPaymentReceived}`, color: 'text-indigo-600' },
          { label: 'Remaining', value: `$${SUMMARY_STATS.remainingAmount}`, color: 'text-amber-600' },
          { label: 'Due This Month', value: SUMMARY_STATS.thisMonthDue, color: 'text-orange-600' },
          { label: 'Overdue', value: SUMMARY_STATS.overduePayments, color: 'text-rose-600' },
          { label: 'Completed', value: SUMMARY_STATS.completedInstallments, color: 'text-emerald-600' },
          { label: 'Total Revenue', value: `$${SUMMARY_STATS.totalEmiRevenue}`, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col justify-center items-center text-center">
            <div className={cn("text-xl lg:text-2xl font-black mb-1", stat.color)}>{stat.value}</div>
            <div className="text-[10px] lg:text-xs font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
            {['All', 'Up to Date', 'Due', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg font-bold text-sm transition-colors",
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
              placeholder="Search by customer or order..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Installment Order List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4">Order & Customer</th>
                <th className="px-6 py-4">Website Info</th>
                <th className="px-6 py-4">Financials</th>
                <th className="px-6 py-4">Plan & Progress</th>
                <th className="px-6 py-4">Next Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInstallments.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900 text-base">{item.customerName}</div>
                    <div className="text-xs font-medium text-neutral-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3"/> {item.customerMobile}</div>
                    <div className="text-xs font-bold text-indigo-600 mt-1">{item.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">{item.websiteName}</div>
                    <div className="text-xs font-medium text-neutral-500">{item.websiteCategory}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-500 w-12">Total:</span>
                      <span className="font-bold text-neutral-900">${item.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-500 w-12">Down:</span>
                      <span className="font-bold text-emerald-600">${item.downPayment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-500 w-12">Rem:</span>
                      <span className="font-bold text-rose-600">${item.remainingAmount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900 mb-1">{item.planMonths} Months Plan</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs font-bold text-neutral-900">{item.monthsPaid} / {item.planMonths} Paid</div>
                    </div>
                    <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${(item.monthsPaid / item.planMonths) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-medium text-neutral-600">
                      <Calendar className="w-4 h-4 text-neutral-400" /> {item.nextDueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit border",
                      getStatusColor(item.status)
                    )}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(item)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInstallments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                      <p className="font-medium text-sm">No installments found matching your criteria.</p>
                    </div>
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

// Dummy icon for dropdowns, etc.
const MoreHorizontal = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

