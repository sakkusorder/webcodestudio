
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
Globe, Package, History, Bell, HelpCircle, ChevronRight, CheckCircle2,
AlertCircle, MessageCircle, ArrowLeft, Upload, X, ShoppingBag, User, Camera, Save, Loader2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../utils/supabase';

// Mock Data
const MOCK_ORDERS: any[] = [];

const MOCK_PAYMENTS: any[] = [];

const notifications: any[] = [];

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
const [uploadingAvatar, setUploadingAvatar] = useState(false);

// Handle Avatar Upload
const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
try {
setUploadingAvatar(true);
setProfileError('');
setProfileSuccess('');

const file = e.target.files?.[0];
if (!file) return;

if (file.size > 10 * 1024 * 1024) {
throw new Error('Image size must be less than 10MB');
}

const fileExt = file.name.split('.').pop();
const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
const filePath = `${fileName}`;

const { error: uploadError } = await supabase.storage
.from('avatars')
.upload(filePath, file);

if (uploadError) {
if (uploadError.message.toLowerCase().includes('bucket')) {
throw new Error('Storage error: Please ensure the "avatars" public bucket exists in Supabase Storage.');
}
throw uploadError;
}

const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

setProfileData({ ...profileData, avatarUrl: data.publicUrl });
setProfileSuccess('Image uploaded! Click "Save Profile Details" to apply.');
} catch (err: any) {
setProfileError(err.message || 'Error uploading image');
} finally {
setUploadingAvatar(false);
}
};

// Handle Profile Update
const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const allTickets = JSON.parse(localStorage.getItem('wcs_support_tickets') || '[]');
    const ticket = {
      id: `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user?.id,
      name: profileData.fullName || user?.user_metadata?.full_name || 'Customer',
      email: user?.email,
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'Open',
      createdAt: new Date().toISOString(),
      replies: []
    };
    localStorage.setItem('wcs_support_tickets', JSON.stringify([ticket, ...allTickets]));
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', message: '' });
    setShowNewTicketModal(false);
  };


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

  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

  const downloadInvoice = (payment: any) => {
    const doc = new jsPDF();
    const order = orders.find(o => o.id === payment.orderId);
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("Web Code Studio", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Professional Web Design Agency", 14, 26);
    doc.text("Email: support@webcodestudio.com", 14, 32);
    
    // INVOICE Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 150, 20);
    
    doc.setFontSize(10);
    doc.text(`Invoice No: ${payment.id}`, 150, 26);
    doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 150, 32);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 150, 38);
    
    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Bill To:", 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${payment.customerName || user?.user_metadata?.full_name || 'Customer'}`, 14, 56);
    doc.text(`Email: ${user?.email}`, 14, 62);
    
    // Order Details
    doc.text(`Order ID: ${payment.orderId}`, 150, 56);
    if (order) {
      doc.text(`Project: ${order.websiteName}`, 150, 62);
    }
    
    // Table
    (doc as any).autoTable({
      startY: 75,
      head: [['Description', 'Transaction ID', 'Amount']],
      body: [
        [payment.type, payment.trxId || '-', `BDT ${payment.amount.toLocaleString()}`]
      ],
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'grid',
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text(`Total Paid: BDT ${payment.amount.toLocaleString()}`, 140, finalY + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 14, finalY + 30);
    
    doc.save(`Invoice-${payment.id}.pdf`);
  };

  useEffect(() => {
    if (!user) return;
    const allOrders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    const allCustom = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
    const allInstallments = JSON.parse(localStorage.getItem('wcs_installments') || '[]');

    const userEmail = user.email;
    const userId = user.id;

    // Filter user orders
    const userOrders = allOrders.filter((o: any) => o.userId === userId || o.customer?.email === userEmail);
    const userCustom = allCustom.filter((o: any) => o.userId === userId || o.email === userEmail);

    const normalizedOrders = [
      ...userOrders.map((o: any) => {
        let orderInstallments: any[] = [];
        const plan = allInstallments.find((i: any) => i.orderId === o.id);
        if (plan) orderInstallments = plan.installments;

        const paidInstallments = orderInstallments.filter((i: any) => i.status === 'Paid' || i.status === 'Success');
        const sumPaid = paidInstallments.reduce((sum, i) => sum + i.amount, 0);
        let totalPaid = o.payment?.paidNow || 0;
        if (o.payment?.status === 'Approved' || o.payment?.status === 'Success') {
           if (o.payment.option === 'full') totalPaid = o.payment.total;
        }
        totalPaid += sumPaid;
        const remainingAmount = (o.payment?.total || 0) - totalPaid;

        return {
          id: o.id,
          websiteName: o.product?.name || 'Website Order',
          category: o.product?.category || 'Template',
          orderStatus: o.status || 'Pending Verification',
          projectStatus: o.projectStatus || 'Not Started',
          deliveryStatus: o.deliveryStatus || 'Pending',
          totalPrice: o.payment?.total || 0,
          downPayment: o.payment?.paidNow || 0,
          totalPaid,
          remainingAmount,
          isInstallment: o.payment?.option === 'installment' || o.payment?.option?.startsWith('emi'),
          installments: orderInstallments,
          createdAt: o.createdAt || new Date().toISOString()
        }
      }),
      ...userCustom.map((o: any) => {
        return {
          id: o.id,
          websiteName: 'Custom Website Project',
          category: o.type || 'Custom',
          orderStatus: o.status || 'Pending Verification',
          projectStatus: o.projectStatus || 'Not Started',
          deliveryStatus: o.deliveryStatus || 'Pending',
          totalPrice: parseInt(o.budget) || 0,
          downPayment: o.payment?.amount || 0,
          totalPaid: o.payment?.status === 'Approved' ? (o.payment?.amount || 0) : 0,
          remainingAmount: (parseInt(o.budget) || 0) - (o.payment?.status === 'Approved' ? (o.payment?.amount || 0) : 0),
          isInstallment: false,
          installments: [],
          createdAt: o.createdAt || new Date().toISOString()
        }
      })
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setOrders(normalizedOrders);

    // Extract Payments
    let allPayments: any[] = [];
    userOrders.forEach((o: any) => {
      if (o.payment?.paidNow > 0 || o.payment?.status) {
        allPayments.push({
          id: `PAY-${o.id}`,
          orderId: o.id,
          customerName: o.customer?.fullName,
          amount: o.payment?.paidNow > 0 ? o.payment.paidNow : o.payment?.total,
          type: o.payment?.option === 'installment' ? 'Down Payment' : 'Full Payment',
          date: o.payment?.date || o.createdAt,
          status: o.payment?.status || (o.status === 'Pending Verification' ? 'Pending Verification' : 'Success'),
          trxId: o.payment?.trxId || 'N/A'
        });
      }
    });

    userCustom.forEach((o: any) => {
      if (o.payment?.amount > 0 || o.payment?.status) {
        allPayments.push({
          id: `PAY-${o.id}`,
          orderId: o.id,
          customerName: o.name,
          amount: o.payment?.amount,
          type: 'Custom Order Payment',
          date: o.createdAt,
          status: o.payment?.status || (o.status === 'Pending Verification' ? 'Pending Verification' : 'Success'),
          trxId: o.payment?.trxId || 'N/A'
        });
      }
    });

    allInstallments.forEach((plan: any) => {
      plan.installments.forEach((inst: any) => {
        if (inst.status === 'Paid' || inst.status === 'Pending Verification') {
          allPayments.push({
            id: `PAY-${inst.id}`,
            orderId: plan.orderId,
            customerName: plan.customerName,
            amount: inst.amount,
            type: `Installment #${inst.number}`,
            date: inst.paidDate || inst.dueDate,
            status: inst.status === 'Paid' ? 'Success' : 'Pending Verification',
            trxId: inst.trxId || 'N/A'
          });
        }
      });
    });
    
    const userPaymentList = allPayments.filter(p => normalizedOrders.some(no => no.id === p.orderId));
    setPayments(userPaymentList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Load Notifications
    const allNotifications = JSON.parse(localStorage.getItem('wcs_notifications') || '[]');
    setNotifications(allNotifications.filter((n: any) => n.userId === userId || n.email === userEmail));
    
    // Load Tickets
    const allTickets = JSON.parse(localStorage.getItem('wcs_support_tickets') || '[]');
    setTickets(allTickets.filter((t: any) => t.userId === userId || t.email === userEmail).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  }, [user, activeTab]);


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
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">{activeOrder.websiteName}</h2>
                      <span className="text-neutral-500 font-medium">{activeOrder.category}</span>
                    </div>
                  </div>
                  
                  {/* Visual Order Tracking Timeline */}
                  <div className="mt-8 mb-6 bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900 mb-6">Development Timeline</h3>
                    <div className="relative">
                      {/* Base Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 -translate-y-1/2 rounded-full hidden sm:block"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                        {['Not Started', 'Requirement Gathering', 'Design', 'Development', 'Testing', 'Delivered'].map((step, index, arr) => {
                          // Determine status
                          const statuses = ['Not Started', 'Requirement Gathering', 'Design', 'Development', 'Testing', 'Delivered'];
                          const currentIndex = statuses.indexOf(activeOrder.projectStatus);
                          const stepIndex = statuses.indexOf(step);
                          
                          let statusColor = 'bg-neutral-200 text-neutral-400';
                          let ringColor = 'ring-neutral-100';
                          let icon = <div className="w-2.5 h-2.5 rounded-full bg-neutral-400"></div>;
                          
                          if (stepIndex < currentIndex || (stepIndex === currentIndex && currentIndex === statuses.length - 1)) {
                            statusColor = 'bg-emerald-500 text-white shadow-md shadow-emerald-200';
                            ringColor = 'ring-emerald-100';
                            icon = <CheckCircle2 className="w-4 h-4" />;
                          } else if (stepIndex === currentIndex) {
                            statusColor = 'bg-indigo-600 text-white shadow-md shadow-indigo-200';
                            ringColor = 'ring-indigo-100 animate-pulse';
                            icon = <Loader2 className="w-4 h-4 animate-spin" />;
                          }

                          return (
                            <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-3 group">
                              <div className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ring-4 transition-all duration-300 z-10 shrink-0",
                                statusColor, ringColor
                              )}>
                                {icon}
                              </div>
                              <div className="sm:text-center">
                                <div className={cn(
                                  "text-sm font-bold transition-colors",
                                  stepIndex <= currentIndex ? "text-neutral-900" : "text-neutral-400"
                                )}>
                                  {step}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Active Progress Line (Desktop) */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${
                            ['Not Started', 'Requirement Gathering', 'Design', 'Development', 'Testing', 'Delivered'].indexOf(activeOrder.projectStatus) * 20
                          }%`
                        }}
                      ></div>
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

{payments.length === 0 ? (
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
                          <th className="p-4 md:p-6 text-sm font-bold text-neutral-600">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-4 md:p-6 font-medium text-neutral-900 text-sm whitespace-nowrap">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="p-4 md:p-6 font-black text-neutral-900 text-sm whitespace-nowrap">৳{payment.amount.toLocaleString()}</td>
                            <td className="p-4 md:p-6 text-neutral-500 font-mono text-xs bg-neutral-50/50">{payment.trxId}</td>
                            <td className="p-4 md:p-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                                payment.status === 'Success' || payment.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                payment.status === 'Pending Verification' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                              )}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="p-4 md:p-6">
                              {(payment.status === 'Success' || payment.status === 'Approved') && (
                                <button 
                                  onClick={() => downloadInvoice(payment)}
                                  className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-semibold text-xs flex items-center gap-2 whitespace-nowrap"
                                >
                                  <Download className="w-4 h-4" /> PDF
                                </button>
                              )}
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

{notifications.length === 0 ? (
<div className="bg-white rounded-3xl p-10 md:p-16 border border-neutral-200 shadow-sm text-center flex flex-col items-center">
<div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
<Bell className="w-12 h-12" />
</div>
<h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-3">কোনো নোটিফিকেশন নেই</h3>
<p className="text-neutral-500 font-medium max-w-md">আপনার একাউন্টে বর্তমানে কোনো নতুন আপডেট বা নোটিফিকেশন নেই।</p>
</div>
) : (
<div className="space-y-3 md:space-y-4">
{notifications.map(notification => (
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
              <div className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">সাপোর্ট টিকেট</h2>
                  <p className="text-sm md:text-base text-neutral-600 font-medium">আপনার যেকোনো সমস্যা বা প্রশ্নের জন্য টিকেট ওপেন করুন।</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open('https://wa.me/01613071344', '_blank')}
                    className="px-5 py-2.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors shadow-sm text-sm"
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
                  >
                    New Ticket
                  </button>
                </div>
              </div>
              
              {tickets.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-8">
                    <MessageCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-4">কোনো সাপোর্ট টিকেট নেই</h3>
                  <p className="text-neutral-600 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                    আপনার ওয়েবসাইট নিয়ে যেকোনো প্রশ্ন, সমস্যা বা আপডেটের জন্য আমাদের সাপোর্ট টিমের সাথে কথা বলুন।
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-neutral-900">{ticket.subject}</h4>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-bold",
                            ticket.status === 'Open' ? "bg-amber-100 text-amber-700" :
                            ticket.status === 'Answered' ? "bg-emerald-100 text-emerald-700" :
                            "bg-neutral-100 text-neutral-700"
                          )}>{ticket.status}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 font-medium">
                          <span className="font-mono text-xs">{ticket.id}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-3 text-sm text-neutral-600 line-clamp-2">{ticket.message}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                         {/* Will add reply view in future if needed, for now just show info */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
{uploadingAvatar ? (
<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
) : profileData.avatarUrl ? (
<img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
) : (
<User className="w-12 h-12 text-indigo-300" />
)}
</div>
<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
<Camera className="w-8 h-8 text-white" />
</div>
<input 
type="file"
accept="image/*"
onChange={handleAvatarUpload}
disabled={uploadingAvatar}
className="opacity-0 absolute inset-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
title="Upload profile picture"
/>
</div>
<div className="text-center">
<p className="text-sm font-semibold text-neutral-600">
{uploadingAvatar ? 'Uploading...' : 'Click image to upload'}
</p>
<p className="text-xs text-neutral-500 mt-1">Max size: 10MB</p>
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
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900">Make Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitPayment} className="p-6">
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Amount to Pay (৳)</label>
                  <input 
                    type="number" 
                    disabled
                    value={paymentData.amount}
                    className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-black cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">bKash/Nagad Transaction ID</label>
                  <input 
                    type="text" 
                    required
                    value={paymentData.trxId}
                    onChange={(e) => setPaymentData({...paymentData, trxId: e.target.value})}
                    placeholder="e.g. 9J8X7Y6Z"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                  <p className="text-xs text-neutral-500 mt-2 font-medium">Please send the money to 01XXXXXXXXX and enter the TrxID above.</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Submit Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900">Create New Ticket</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitTicket} className="p-6">
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    placeholder="e.g. Need help with my domain"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}


</div>
);
}
