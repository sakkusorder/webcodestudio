
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Globe, Package, History, Bell, HelpCircle, ChevronRight, CheckCircle2,
  AlertCircle, MessageCircle, ArrowLeft, Upload, X, ShoppingBag, User, Camera, Save, Loader2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_ORDERS: any[] = [];

const MOCK_PAYMENTS: any[] = [];

const MOCK_NOTIFICATIONS: any[] = [];

export function Dashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  const isNewUser = searchParams.get('new') === 'true';
  
  // Profile State
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phoneNumber: user?.user_metadata?.phone_number || '',
    avatarUrl: user?.user_metadata?.avatar_url || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Handle Profile Update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const { error } = await updateProfile({
        full_name: profileData.fullName,
        phone_number: profileData.phoneNumber,
        avatar_url: profileData.avatarUrl
      });
      if (error) throw error;
      setProfileSuccess('Profile updated successfully!');
      if (isNewUser) {
        // Remove the 'new' flag after setup
        setSearchParams({ tab: 'profile' });
      }
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };
  
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

              {MOCK_PAYMENTS.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 md:p-16 border border-neutral-200 shadow-sm text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                    <History className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-3">কোনো পেমেন্ট হিস্টরি নেই</h3>
                  <p className="text-neutral-500 font-medium max-w-md">আপনি এখনো কোনো পেমেন্ট করেননি।</p>
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">নোটিফিকেশন</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার একাউন্টের আপডেটসমূহ।</p>
              </div>

              {MOCK_NOTIFICATIONS.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 md:p-16 border border-neutral-200 shadow-sm text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                    <Bell className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-3">কোনো নোটিফিকেশন নেই</h3>
                  <p className="text-neutral-500 font-medium max-w-md">আপনার একাউন্টে বর্তমানে কোনো নতুন আপডেট বা নোটিফিকেশন নেই।</p>
                </div>
              ) : (
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
              )}
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

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">প্রোফাইল সেটিংস</h2>
                <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার ব্যক্তিগত তথ্য আপডেট করুন।</p>
              </div>

              <div className="bg-white rounded-2xl md:rounded-3xl border border-neutral-200 shadow-sm p-6 md:p-10 max-w-2xl mx-auto">
                {isNewUser && (
                  <div className="mb-8 p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl">
                    <h3 className="text-indigo-800 font-bold mb-1">Welcome to Web Code Studio!</h3>
                    <p className="text-indigo-600 text-sm font-medium">Please take a moment to set up your profile details below.</p>
                  </div>
                )}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer mb-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-neutral-50 shadow-md bg-indigo-50 flex items-center justify-center">
                        {profileData.avatarUrl ? (
                          <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-indigo-300" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                      <input 
                        type="url" 
                        placeholder="Image URL (optional)"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        title="You can also paste an image URL below"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2 text-center">Profile Image URL</label>
                      <input 
                        type="url"
                        value={profileData.avatarUrl}
                        onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      placeholder="e.g. +880 1613071344"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address (Read-only)</label>
                    <input 
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 font-medium outline-none cursor-not-allowed"
                    />
                  </div>

                  {profileSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold flex items-center gap-2 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                      {profileSuccess}
                    </div>
                  )}

                  {profileError && (
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-xl font-bold flex items-center gap-2 border border-rose-100">
                      <AlertCircle className="w-5 h-5" />
                      {profileError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {profileLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {profileLoading ? 'Saving Profile...' : 'Save Profile Details'}
                  </button>
                </form>
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
