import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Clock, Calendar, Download, Eye, ChevronRight, X, FileText, Check, FileDown, Bell, MessageSquare, CreditCard, User, Globe, Mail, Phone, ExternalLink, ShoppingCart , XCircle, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Installments() {
  const { t } = useLanguage();
  const [installments, setInstallments] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const [stats, setStats] = useState({
    totalEmiRevenue: 0,
    downPaymentReceived: 0,
    remainingAmount: 0,
    overduePayments: 0,
    thisMonthDue: 0
  });

  const loadInstallments = () => {
    const plans = JSON.parse(localStorage.getItem('wcs_installments') || '[]');
    setInstallments(plans);

    const orders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    let downPayment = 0;
    orders.forEach((o: any) => {
      if(o.payment?.option === 'installment' && o.payment?.paidNow) {
        downPayment += o.payment.paidNow;
      }
    });

    let totalRemaining = 0;
    let overdue = 0;
    let thisMonth = 0;
    let totalCollected = 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    plans.forEach((plan: any) => {
      totalRemaining += plan.totalRemaining;
      plan.installments.forEach((inst: any) => {
        if(inst.status === 'Paid') {
          totalCollected += inst.amount;
        } else {
          const d = new Date(inst.dueDate);
          if(d < now && inst.status !== 'Pending Verification') {
            overdue++;
            inst.status = 'Missed';
          }
          if(d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            thisMonth += inst.amount;
          }
        }
      });
    });

    // Update missed statuses to local storage implicitly in UI
    
    setStats({
      totalEmiRevenue: totalCollected,
      downPaymentReceived: downPayment,
      remainingAmount: totalRemaining - totalCollected,
      overduePayments: overdue,
      thisMonthDue: thisMonth
    });
  };

  useEffect(() => {
    loadInstallments();
    const handleStorageChange = () => loadInstallments();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = installments.filter(plan => {
    const searchMatch = (plan.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (plan.orderId || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return searchMatch;
    
    // Check if plan has installments matching filter
    const hasStatus = plan.installments.some((inst: any) => {
      if(filter === 'Missed') return inst.status === 'Missed' || (new Date(inst.dueDate) < new Date() && inst.status === 'Pending');
      return inst.status === filter;
    });

    return searchMatch && hasStatus;
  });

  const handleApproveInstallment = (plan: any, instId: string) => {
    if(confirm('Approve this installment payment?')) {
      const updatedPlans = installments.map(p => {
        if (p.orderId === plan.orderId) {
          return {
            ...p,
            installments: p.installments.map((i: any) => {
              if (i.id === instId) {
                return { ...i, status: 'Paid', paidDate: new Date().toISOString() };
              }
              return i;
            })
          };
        }
        return p;
      });

      localStorage.setItem('wcs_installments', JSON.stringify(updatedPlans));
      
      // Also update remaining in order
      const orders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
      const updatedOrders = orders.map((o: any) => {
        if (o.id === plan.orderId) {
          const amt = plan.installments.find((i:any) => i.id === instId)?.amount || 0;
          return {
            ...o,
            payment: {
              ...o.payment,
              paidNow: (o.payment.paidNow || 0) + amt,
              remaining: Math.max(0, (o.payment.remaining || 0) - amt)
            }
          }
        }
        return o;
      });
      localStorage.setItem('wcs_orders', JSON.stringify(updatedOrders));
      
      loadInstallments();
      const updatedPlan = updatedPlans.find(p => p.orderId === plan.orderId);
      if (updatedPlan) setSelectedPlan(updatedPlan);
    }
  };

  const handleRejectInstallment = (plan: any, instId: string) => {
    const reason = prompt('Please enter the reason for rejection:');
    if(reason !== null) {
      const updatedPlans = installments.map(p => {
        if (p.orderId === plan.orderId) {
          return {
            ...p,
            installments: p.installments.map((i: any) => {
              if (i.id === instId) {
                return { ...i, status: 'Rejected', rejectReason: reason };
              }
              return i;
            })
          };
        }
        return p;
      });

      localStorage.setItem('wcs_installments', JSON.stringify(updatedPlans));
      loadInstallments();
      const updatedPlan = updatedPlans.find(p => p.orderId === plan.orderId);
      if (updatedPlan) setSelectedPlan(updatedPlan);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-neutral-50 text-neutral-600 border-neutral-200';
      case 'Pending Verification': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Missed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  if (selectedPlan) {
    const paidCount = selectedPlan.installments.filter((i:any) => i.status === 'Paid').length;
    const progress = (paidCount / selectedPlan.totalMonths) * 100;

    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedPlan(null)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm">
            <X className="w-4 h-4" />
            Back to Installments
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black mb-4">
                {selectedPlan.customerName.charAt(0)}
              </div>
              <h2 className="text-xl font-black text-neutral-900">{selectedPlan.customerName}</h2>
              <div className="text-sm font-bold text-indigo-600 mb-6 bg-indigo-50 px-3 py-1 rounded-full mt-2">
                Order: {selectedPlan.orderId}
              </div>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Phone className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-xs text-neutral-500 font-bold">Phone</div>
                    <div className="text-sm font-medium text-neutral-900">{selectedPlan.customerPhone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Globe className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-xs text-neutral-500 font-bold">Project</div>
                    <div className="text-sm font-medium text-neutral-900 line-clamp-1">{selectedPlan.websiteName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Payment Progress</h3>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span className="text-emerald-600">{paidCount} Paid</span>
                <span className="text-neutral-400">{selectedPlan.totalMonths} Total</span>
              </div>
              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 font-bold">Total EMI Amount</span>
                  <span className="font-bold text-neutral-900">৳{selectedPlan.totalRemaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 font-bold">Remaining</span>
                  <span className="font-bold text-rose-600">
                    ৳{(selectedPlan.totalRemaining - selectedPlan.installments.filter((i:any)=>i.status==='Paid').reduce((s:number, i:any)=>s+i.amount, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Installment Schedule</h3>
            
            {selectedPlan.installments.map((inst: any, idx: number) => {
              const isMissed = new Date(inst.dueDate) < new Date() && inst.status === 'Pending';
              const displayStatus = isMissed ? 'Missed' : inst.status;

              return (
                <div key={inst.id} className={cn(
                  "p-5 rounded-2xl border transition-all",
                  displayStatus === 'Paid' ? "bg-white border-neutral-200 opacity-70" :
                  displayStatus === 'Pending Verification' ? "bg-white border-amber-200 shadow-md ring-1 ring-amber-100" :
                  displayStatus === 'Missed' ? "bg-rose-50/30 border-rose-200" :
                  "bg-white border-neutral-200"
                )}>
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg",
                        displayStatus === 'Paid' ? "bg-emerald-100 text-emerald-600" :
                        "bg-neutral-100 text-neutral-500"
                      )}>
                        {inst.number}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 text-lg">৳{inst.amount.toLocaleString()}</div>
                        <div className="text-sm font-medium text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due: {new Date(inst.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      getStatusColor(displayStatus)
                    )}>
                      {displayStatus}
                    </span>
                  </div>

                  {inst.status === 'Pending Verification' && (
                    <div className="mt-4 pt-4 border-t border-neutral-100/60 bg-amber-50/50 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-amber-800 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Payment Verification Required
                        </span>
                        <div className="text-xs font-mono text-neutral-500">TrxID: {inst.trxId}</div>
                      </div>
                      
                      {inst.screenshot && (
                        <a href={inst.screenshot} target="_blank" rel="noreferrer" className="block text-sm text-indigo-600 font-bold hover:underline mb-4">
                          View Payment Screenshot
                        </a>
                      )}

                      <div className="flex items-center gap-3">
                        <button onClick={() => handleApproveInstallment(selectedPlan, inst.id)} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRejectInstallment(selectedPlan, inst.id)} className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {displayStatus === 'Missed' && (
                    <div className="mt-4 pt-4 border-t border-rose-100">
                      <button className="text-sm font-bold text-rose-600 flex items-center gap-2 hover:text-rose-700">
                        <Bell className="w-4 h-4" />
                        Send Reminder SMS
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Installment Management</h2>
          <p className="text-neutral-500 font-medium mt-1">Track and manage customer EMIs</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> Collected EMI</div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.totalEmiRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4 text-indigo-600" /> Remaining EMI</div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.remainingAmount.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> This Month Due</div>
          <div className="text-3xl font-black text-neutral-900">৳{stats.thisMonthDue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" /> Overdue Payments</div>
          <div className="text-3xl font-black text-rose-600">{stats.overduePayments}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by customer name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Plans</option>
            <option value="Pending Verification">Needs Verification</option>
            <option value="Missed">Missed Payments</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredPlans.map((plan, idx) => {
            const paidCount = plan.installments.filter((i:any) => i.status === 'Paid').length;
            const needsVerification = plan.installments.some((i:any) => i.status === 'Pending Verification');
            const hasMissed = plan.installments.some((i:any) => new Date(i.dueDate) < new Date() && i.status === 'Pending');

            return (
              <div key={idx} onClick={() => setSelectedPlan(plan)} className="group bg-white border border-neutral-200 rounded-2xl p-5 hover:border-indigo-600/30 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                    {plan.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                      {plan.customerName}
                      {needsVerification && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase px-2 py-0.5 rounded-full font-black animate-pulse">Action Required</span>}
                      {hasMissed && <span className="bg-rose-100 text-rose-700 text-[10px] uppercase px-2 py-0.5 rounded-full font-black">Overdue</span>}
                    </div>
                    <div className="text-sm font-medium text-neutral-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4" /> {plan.orderId}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {plan.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-neutral-100">
                  <div className="text-center">
                    <div className="text-xs font-bold text-neutral-400 uppercase mb-1">Progress</div>
                    <div className="font-black text-neutral-900">{paidCount} / {plan.totalMonths}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-neutral-400 uppercase mb-1">Remaining</div>
                    <div className="font-black text-rose-600">৳{(plan.totalRemaining - plan.installments.filter((i:any)=>i.status==='Paid').reduce((s:number, i:any)=>s+i.amount, 0)).toLocaleString()}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
          {filteredPlans.length === 0 && (
            <div className="text-center py-12 text-neutral-500 font-medium">
              No installment plans found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
