import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, DollarSign, Download, ExternalLink, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Payments() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalTransactions: 0,
    successful: 0,
    pending: 0
  });

  const loadPayments = () => {
    const orders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    const customOrders = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
    const installments = JSON.parse(localStorage.getItem('wcs_installments') || '[]');

    let allPayments: any[] = [];

    // Extract down payments / full payments from orders
    orders.forEach((o: any) => {
      if (o.payment?.paidNow > 0 || o.payment?.status) {
        allPayments.push({
          id: `PAY-${o.id}`,
          orderId: o.id,
          customerName: o.customer?.fullName,
          phone: o.customer?.phone,
          amount: o.payment?.paidNow > 0 ? o.payment.paidNow : o.payment?.amount,
          type: o.payment?.option === 'installment' ? 'Down Payment' : 'Full Payment',
          date: o.payment?.date || o.createdAt,
          status: o.payment?.status || (o.status === 'Pending Verification' ? 'Pending' : 'Success'),
          trxId: o.payment?.trxId || 'N/A'
        });
      }
    });

    // Extract installment payments
    installments.forEach((plan: any) => {
      plan.installments.forEach((inst: any) => {
        if (inst.status === 'Paid' || inst.status === 'Pending Verification') {
          allPayments.push({
            id: `PAY-${inst.id}`,
            orderId: plan.orderId,
            customerName: plan.customerName,
            phone: plan.customerPhone,
            amount: inst.amount,
            type: `Installment #${inst.number}`,
            date: inst.paidDate || inst.dueDate,
            status: inst.status === 'Paid' ? 'Success' : 'Pending',
            trxId: inst.trxId || 'N/A'
          });
        }
      });
    });

    allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPayments(allPayments);

    setStats({
      totalAmount: allPayments.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: allPayments.length,
      successful: allPayments.filter(p => p.status === 'Success').length,
      pending: allPayments.filter(p => p.status === 'Pending').length,
    });
  };

  useEffect(() => {
    loadPayments();
    const handleStorageChange = () => loadPayments();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All Time');

  const filteredPayments = payments.filter(p => {
    const searchMatch = (p.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.phone || '').includes(searchTerm) ||
                        (p.trxId || '').toLowerCase().includes(searchTerm.toLowerCase());
                        
    // Basic date filtering mock
    let dateMatch = true;
    const pDate = new Date(p.date);
    const now = new Date();
    
    if (dateFilter === 'Today') {
      dateMatch = pDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'This Month') {
      dateMatch = pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    }
    
    return searchMatch && dateMatch;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Payment History</h2>
          <p className="text-neutral-500 font-medium mt-1">Track all transactions and payments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> Total Revenue</div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.totalAmount.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-indigo-600" /> Transactions</div>
          <div className="text-3xl font-black text-neutral-900">{stats.totalTransactions}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> Successful</div>
          <div className="text-3xl font-black text-neutral-900">{stats.successful}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-amber-600" /> Pending</div>
          <div className="text-3xl font-black text-neutral-900">{stats.pending}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Name, Mobile, TrxID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 font-bold text-neutral-400 text-sm">Transaction Details</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Customer</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Amount & Type</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Date</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Status</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPayments.map((payment, idx) => (
                <tr key={payment.id || idx} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-neutral-900 mb-1">{payment.trxId}</div>
                    <div className="text-xs text-neutral-500 font-mono">Order: {payment.orderId}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-bold text-neutral-900 mb-1">{payment.customerName}</div>
                    <div className="text-xs font-medium text-neutral-500">{payment.phone}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-bold text-neutral-900 mb-1">৳{payment.amount?.toLocaleString() || 0}</div>
                    <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                      {payment.type}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-neutral-700">{new Date(payment.date).toLocaleString()}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                      payment.status === 'Pending' ? "bg-amber-50 text-amber-600" : 
                      payment.status === 'Success' ? "bg-emerald-50 text-emerald-600" :
                      payment.status === 'Rejected' ? "bg-rose-50 text-rose-600" :
                      "bg-neutral-100 text-neutral-600"
                    )}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button title="View Invoice" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                    No payments found.
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
