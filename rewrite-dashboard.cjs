const fs = require('fs');

const dashboardCode = `
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Globe, Package, History, Bell, HelpCircle, ChevronRight, CheckCircle2,
  AlertCircle, MessageCircle, ArrowLeft, Upload, X, ShoppingBag
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_ORDERS = [
  {
    id: 'ORD-8924',
    websiteName: 'Restaurant Management System',
    category: 'Business Website',
    orderStatus: 'Down Payment Pending Verification',
    projectStatus: 'Waiting for Payment Approval',
    deliveryStatus: 'Not Started',
    totalPrice: 20000,
    downPayment: 5000,
    totalPaid: 0,
    remainingAmount: 17000, // 20000 + 2000 (10%) = 22000 - 5000 = 17000
    isInstallment: true,
    installments: [
      { id: 'INS-10', number: 1, amount: 2833, status: 'Locked' },
      { id: 'INS-11', number: 2, amount: 2833, status: 'Locked' },
    ]
  },
  {
    id: 'ORD-8923',
    websiteName: 'My E-Commerce Store',
    category: 'E-commerce',
    orderStatus: 'Confirmed',
    projectStatus: 'Development Phase',
    deliveryStatus: 'Expected in 12 days',
    totalPrice: 15000,
    downPayment: 3000,
    totalPaid: 3000,
    remainingAmount: 13500, // Includes 10% charge
    isInstallment: true,
    installments: [
      { id: 'INS-1', number: 1, amount: 2250, status: 'Success' },
      { id: 'INS-2', number: 2, amount: 2250, status: 'Pending Verification' },
      { id: 'INS-3', number: 3, amount: 2250, status: 'Rejected' },
      { id: 'INS-4', number: 4, amount: 2250, status: 'Locked' },
      { id: 'INS-5', number: 5, amount: 2250, status: 'Locked' },
      { id: 'INS-6', number: 6, amount: 2250, status: 'Locked' },
    ]
  },
  {
    id: 'ORD-7612',
    websiteName: 'Corporate Portfolio',
    category: 'Portfolio',
    orderStatus: 'Completed',
    projectStatus: 'Delivered',
    deliveryStatus: 'Delivered',
    totalPrice: 8000,
    downPayment: 8000,
    totalPaid: 8000,
    remainingAmount: 0,
    isInstallment: false,
    installments: []
  }
];

const MOCK_PAYMENTS = [
  { id: 'TXN-9823', date: '2026-08-01', amount: 3000, trxId: '8JD6K8G3K', status: 'Success' },
  { id: 'TXN-7612', date: '2026-05-30', amount: 2250, trxId: '9KL2M4N5P', status: 'Pending Verification' },
  { id: 'TXN-7544', date: '2026-05-15', amount: 8000, trxId: '7GH3J6K1L', status: 'Success' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Payment Accepted', message: 'Your payment of ৳3,000 has been accepted.', time: '2 hours ago', read: false },
  { id: 2, title: 'Website Development Progress', message: 'Development on My E-Commerce Store has begun.', time: '1 day ago', read: true },
  { id: 3, title: 'Next Installment Reminder', message: 'Your next installment of ৳2,250 is due soon.', time: '2 days ago', read: true },
  { id: 4, title: 'Website Delivery Completed', message: 'Corporate Portfolio has been delivered successfully.', time: '1 month ago', read: true },
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    trxId: '',
    installmentId: ''
  });

  useEffect(() => {
    setActiveOrder(null);
  }, [activeTab]);

  const handlePayClick = (inst: any, orderId: string) => {
    setPaymentData({ amount: inst.amount.toString(), trxId: '', installmentId: inst.id });
    setShowPaymentModal(true);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate updating status to Pending Verification
    const updatedOrders = orders.map(o => {
      if (activeOrder && o.id === activeOrder.id) {
        return {
          ...o,
          installments: o.installments.map((i: any) => i.id === paymentData.installmentId ? { ...i, status: 'Pending Verification' } : i)
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    if (activeOrder) {
      setActiveOrder(updatedOrders.find(o => o.id === activeOrder.id));
    }
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && !activeOrder && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">আমার অর্ডার</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার সকল অর্ডার এখানে দেখতে পাবেন।</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 md:p-16 border border-neutral-200 shadow-sm text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-3">আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি।</h3>
                  <p className="text-neutral-500 font-medium mb-8 max-w-md">আমাদের টেমপ্লেট গ্যালারি থেকে আপনার পছন্দের ওয়েবসাইট বেছে নিন এবং আজই অর্ডার করুন।</p>
                  <Link to="/templates" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    ওয়েবসাইট অর্ডার করুন
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-neutral-900 mb-1">{order.websiteName}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 font-medium">
                          <span>{order.category}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 hidden sm:block"></span>
                          <span className="font-mono text-xs hidden sm:block">{order.id}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 hidden sm:block"></span>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-bold",
                            order.orderStatus === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                            order.orderStatus === 'Confirmed' ? "bg-indigo-100 text-indigo-700" :
                            "bg-amber-100 text-amber-700"
                          )}>{order.orderStatus}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveOrder(order)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
                      >
                        বিস্তারিত দেখুন <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE ORDER DETAILS VIEW */}
          {activeOrder && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <button 
                onClick={() => setActiveOrder(null)}
                className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold transition-colors mb-4 md:mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-100 inline-flex"
              >
                <ArrowLeft className="w-4 h-4" /> ফিরে যান
              </button>

              <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-neutral-200 shadow-sm mb-6 md:mb-8">
                <div className="mb-6 border-b border-neutral-100 pb-4">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Project Information</h3>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">{activeOrder.websiteName}</h2>
                      <span className="text-neutral-500 font-medium">{activeOrder.category}</span>
                    </div>
                    <div className="flex flex-col gap-3 text-sm font-semibold">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 w-32">Development Status:</span>
                        <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">{activeOrder.projectStatus}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 w-32">Delivery Status:</span>
                        <span className="text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-xs">{activeOrder.deliveryStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-b border-neutral-100 pb-6 mb-6">
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div className="text-xs font-bold text-neutral-500 mb-1">Total Price</div>
                    <div className="text-xl md:text-2xl font-black text-neutral-900">৳{activeOrder.totalPrice}</div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div className="text-xs font-bold text-neutral-500 mb-1">Down Payment</div>
                    <div className="text-xl md:text-2xl font-black text-neutral-900">৳{activeOrder.downPayment}</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-700 mb-1">Paid Amount</div>
                    <div className="text-xl md:text-2xl font-black text-emerald-700">৳{activeOrder.totalPaid}</div>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <div className="text-xs font-bold text-rose-700 mb-1">Remaining Amount</div>
                    <div className="text-xl md:text-2xl font-black text-rose-700">৳{activeOrder.remainingAmount}</div>
                  </div>
                </div>

                {activeOrder.isInstallment && activeOrder.installments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Installment Information</h3>
                    <div className="space-y-3">
                      {activeOrder.installments.map((inst: any) => (
                        <div key={inst.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-neutral-100 bg-neutral-50 gap-4 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center font-black text-sm shadow-sm">
                              {inst.number}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 text-lg">৳{inst.amount}</div>
                              <div className="text-xs font-semibold text-neutral-500">Status: <span className={cn(
                                inst.status === 'Success' ? 'text-emerald-600' :
                                inst.status === 'Pending Verification' ? 'text-amber-600' :
                                inst.status === 'Rejected' ? 'text-rose-600' : 'text-neutral-400'
                              )}>{inst.status}</span></div>
                            </div>
                          </div>
                          <div>
                            {(inst.status === 'Due' || inst.status === 'Rejected' || inst.status === 'Locked') && inst.status !== 'Locked' ? (
                              <button onClick={() => handlePayClick(inst, activeOrder.id)} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm w-full sm:w-auto">
                                পেমেন্ট করুন
                              </button>
                            ) : inst.status === 'Pending Verification' ? (
                              <button disabled className="px-5 py-2.5 bg-amber-100 text-amber-700 font-bold rounded-xl shadow-sm text-sm w-full sm:w-auto opacity-70 cursor-not-allowed">
                                Pending Verification
                              </button>
                            ) : inst.status === 'Success' ? (
                              <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2 text-sm border border-emerald-100">
                                <CheckCircle2 className="w-4 h-4" /> Success
                              </div>
                            ) : (
                              <button disabled className="px-5 py-2.5 bg-neutral-200 text-neutral-400 font-bold rounded-xl cursor-not-allowed text-sm w-full sm:w-auto">
                                Locked
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">পেমেন্ট হিস্টরি</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার সকল পেমেন্টের তালিকা।</p>
              </div>

              <div className="bg-white rounded-2xl md:rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-100">
                        <th className="p-4 md:p-6 text-sm font-bold text-neutral-600">Date</th>
                        <th className="p-4 md:p-6 text-sm font-bold text-neutral-600">Amount</th>
                        <th className="p-4 md:p-6 text-sm font-bold text-neutral-600">Transaction ID</th>
                        <th className="p-4 md:p-6 text-sm font-bold text-neutral-600">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {MOCK_PAYMENTS.map((payment) => (
                        <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4 md:p-6 font-medium text-neutral-900 text-sm">{payment.date}</td>
                          <td className="p-4 md:p-6 font-black text-neutral-900 text-sm">৳{payment.amount}</td>
                          <td className="p-4 md:p-6 text-neutral-500 font-mono text-xs bg-neutral-50/50">{payment.trxId}</td>
                          <td className="p-4 md:p-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold",
                              payment.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 
                              payment.status === 'Pending Verification' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            )}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">নোটিফিকেশন</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার একাউন্টের আপডেটসমূহ।</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                {MOCK_NOTIFICATIONS.map(notification => (
                  <div key={notification.id} className={cn("bg-white p-4 md:p-5 rounded-2xl border flex gap-4 md:gap-5 transition-colors", notification.read ? "border-neutral-100" : "border-indigo-200 shadow-sm bg-indigo-50/30")}>
                    <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0", notification.read ? "bg-neutral-100 text-neutral-500" : "bg-indigo-600 text-white shadow-md shadow-indigo-200")}>
                      <Bell className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1">
                        <h4 className={cn("font-bold text-sm md:text-base", notification.read ? "text-neutral-700" : "text-neutral-900")}>{notification.title}</h4>
                        <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-neutral-600 text-sm leading-relaxed">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">সাপোর্ট</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।</p>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-8">
                  <MessageCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4">সাহায্য প্রয়োজন?</h3>
                <p className="text-neutral-600 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                  আপনার ওয়েবসাইট নিয়ে যেকোনো প্রশ্ন, সমস্যা বা আপডেটের জন্য আমাদের সাপোর্ট টিমের সাথে কথা বলুন। আমরা দ্রুত উত্তর দেব।
                </p>
                <button 
                  onClick={() => window.open('https://wa.me/01613071344', '_blank')}
                  className="bg-[#25D366] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-200 inline-flex items-center justify-center gap-3 text-lg w-full sm:w-auto"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp Support
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900">Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors bg-neutral-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={submitPayment} className="space-y-6">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-6 space-y-2">
                  <div className="flex justify-between items-center text-sm bg-indigo-100/50 p-2 rounded-lg">
                    <span className="text-indigo-900 font-bold">অ্যামাউন্ট</span>
                    <span className="font-black text-indigo-700">৳{paymentData.amount}</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200">
                  <div className="text-sm font-semibold text-neutral-500 mb-1">Payment Number (বিকাশ/নগদ)</div>
                  <div className="text-2xl font-black text-indigo-600 tracking-wide">01613071344</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">আপনি কত টাকা পাঠিয়েছেন</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">৳</span>
                    <input 
                      type="number" 
                      required
                      min={100}
                      value={paymentData.amount}
                      onChange={e => setPaymentData({...paymentData, amount: e.target.value})}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Transaction ID</label>
                  <input 
                    type="text" 
                    required
                    value={paymentData.trxId}
                    onChange={e => setPaymentData({...paymentData, trxId: e.target.value})}
                    placeholder="e.g. 8JD6K8G3K"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 text-center hover:bg-neutral-50 transition-colors cursor-pointer group relative">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-neutral-600">Upload Screenshot (Optional)</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Submit Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
`

fs.writeFileSync('src/pages/Dashboard.tsx', dashboardCode);
