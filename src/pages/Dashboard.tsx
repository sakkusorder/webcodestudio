
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
Globe, Package, History, Bell, HelpCircle, ChevronRight, CheckCircle2,
AlertCircle, MessageCircle, ArrowLeft, Upload, X, ShoppingBag, User, Camera, Save, Loader2
, Download
, FileText, Calendar, DollarSign, Activity, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../utils/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    autoTable(doc, {
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
        let orderInstallments: any[] = o.installments || [];
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
          installments: orderInstallments.length > 0 ? orderInstallments : (o.installments || []),
          installmentMonths: o.payment?.installmentMonths || (o.installments ? o.installments.length : 0),
          monthlyInstallment: o.payment?.monthlyInstallment || 0,
          isInstallmentUnlocked: o.isInstallmentUnlocked || false,
          installmentStartDate: o.installmentStartDate || null,
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
installments: o.installments.map((i: any) => i.id === paymentData.installmentId ? { ...i, status: 'Pending Verification', trxId: paymentData.trxId } : i)
};
}
return o;
});
setOrders(updatedOrders);
if (activeOrder) {
  const updatedActive = updatedOrders.find(o => o.id === activeOrder.id);
  setActiveOrder(updatedActive);
  
  // Update localStorage for persistence
  const tOrders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
  const tIndex = tOrders.findIndex((o: any) => o.id === activeOrder.id);
  if (tIndex >= 0) {
    tOrders[tIndex].installments = updatedActive.installments;
    localStorage.setItem('wcs_orders', JSON.stringify(tOrders));
  }
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

{/* হিসাবের বিবরণ */}
<div className="mt-8">
  <div className="flex items-center gap-2 mb-4">
    <FileText className="w-5 h-5 text-indigo-500" />
    <h3 className="text-lg font-bold text-neutral-900">হিসাবের বিবরণ</h3>
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4">
    <div className="bg-neutral-50 p-4 md:p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-neutral-500 mb-1">মোট মূল্য</div>
      <div className="text-xl md:text-2xl font-black text-indigo-600">৳ {activeOrder.totalPrice?.toLocaleString()}</div>
    </div>
    
    <div className="bg-neutral-50 p-4 md:p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-neutral-500 mb-1">ডাউন পেমেন্ট</div>
      <div className="text-xl md:text-2xl font-black text-indigo-600">৳ {activeOrder.downPayment?.toLocaleString()}</div>
      <div className="mt-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">পরিশোধিত</div>
    </div>

    <div className="bg-neutral-50 p-4 md:p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-neutral-500 mb-1">বাকী পরিমাণ</div>
      <div className="text-xl md:text-2xl font-black text-indigo-600">৳ {activeOrder.remainingAmount?.toLocaleString()}</div>
    </div>

    <div className="bg-neutral-50 p-4 md:p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
      <div className="text-xs font-bold text-neutral-500 mb-1">মোট কিস্তি</div>
      <div className="text-xl md:text-2xl font-black text-indigo-600">{activeOrder.installmentMonths || 0} টি</div>
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-b border-neutral-100 pb-8 mb-8">
    <div className="bg-white p-4 rounded-xl border border-neutral-100 flex items-center gap-3">
      <Calendar className="w-5 h-5 text-indigo-400" />
      <div>
        <div className="text-[10px] font-bold text-neutral-500 mb-0.5">ডাউন পেমেন্ট তারিখ</div>
        <div className="text-sm font-bold text-neutral-900">{new Date(activeOrder.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl border border-neutral-100 flex items-center gap-3">
      <Calendar className="w-5 h-5 text-indigo-400" />
      <div>
        <div className="text-[10px] font-bold text-neutral-500 mb-0.5">কিস্তি শুরু তারিখ</div>
        <div className="text-sm font-bold text-neutral-900">
           {activeOrder.isInstallmentUnlocked && activeOrder.installmentStartDate ? new Date(activeOrder.installmentStartDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : 'অপেক্ষমান'}
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl border border-neutral-100 flex items-center gap-3">
      <DollarSign className="w-5 h-5 text-indigo-400" />
      <div>
        <div className="text-[10px] font-bold text-neutral-500 mb-0.5">প্রতি কিস্তি পরিমাণ</div>
        <div className="text-sm font-bold text-neutral-900">৳ {activeOrder.monthlyInstallment?.toLocaleString() || 0}</div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl border border-neutral-100 flex items-center gap-3">
      <Activity className="w-5 h-5 text-indigo-400" />
      <div>
        <div className="text-[10px] font-bold text-neutral-500 mb-0.5">কিস্তির মেয়াদ</div>
        <div className="text-sm font-bold text-neutral-900">{activeOrder.installmentMonths || 0} মাস</div>
      </div>
    </div>
  </div>
</div>

{activeOrder.isInstallment && (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <FileText className="w-5 h-5 text-indigo-500" />
      <h3 className="text-lg font-bold text-neutral-900">কিস্তির তালিকা</h3>
    </div>

    {!activeOrder.isInstallmentUnlocked && (
       <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 text-center flex flex-col items-center mb-6">
         <AlertCircle className="w-8 h-8 text-indigo-400 mb-3" />
         <p className="text-neutral-600 font-semibold text-sm">ওয়েবসাইট ডেলিভারি সম্পন্ন হওয়ার পর কিস্তি পরিশোধের সুবিধা চালু হবে।</p>
       </div>
    )}

    {activeOrder.installments && activeOrder.installments.length > 0 && (
      <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-100 shadow-sm mb-6">
        <table className="w-full text-left whitespace-nowrap min-w-[600px]">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">কিস্তি নং</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">তারিখ</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">পরিমাণ</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">অবস্থা</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">পেমেন্ট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {activeOrder.installments.map((inst: any, idx: number) => {
               let dueDateDisplay = 'অপেক্ষমান';
               if (activeOrder.isInstallmentUnlocked && activeOrder.installmentStartDate) {
                  const startDate = new Date(activeOrder.installmentStartDate);
                  startDate.setMonth(startDate.getMonth() + idx);
                  dueDateDisplay = startDate.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
               }

               const isLocked = !activeOrder.isInstallmentUnlocked;
               const isPaid = inst.status === 'Paid' || inst.status === 'Success';
               const isPending = inst.status === 'Pending Verification';

               return (
                <tr key={inst.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-neutral-900">{dueDateDisplay}</div>
                    {idx === 0 && activeOrder.isInstallmentUnlocked && <div className="text-[10px] text-neutral-500 mt-0.5">আজ থেকে শুরু</div>}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                    ৳ {inst.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isLocked ? (
                      <span className="text-xs font-bold text-neutral-400">অপেক্ষমান</span>
                    ) : (
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full",
                        isPaid ? "bg-emerald-100 text-emerald-700" :
                        isPending ? "bg-amber-100 text-amber-700" :
                        "bg-neutral-100 text-neutral-600"
                      )}>
                        {isPaid ? 'পরিশোধিত' : isPending ? 'যাচাই হচ্ছে' : 'বাকি আছে'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isLocked ? (
                      <button disabled className="px-6 py-2.5 bg-neutral-100 text-neutral-400 font-bold rounded-xl text-xs cursor-not-allowed">
                        পেমেন্ট
                      </button>
                    ) : isPaid ? (
                       <div className="text-emerald-600 font-bold text-sm flex items-center justify-end gap-1">
                         <CheckCircle className="w-4 h-4" />
                       </div>
                    ) : isPending ? (
                       <button disabled className="px-6 py-2.5 bg-amber-100 text-amber-700 font-bold rounded-xl text-xs cursor-not-allowed">
                         অপেক্ষমান
                       </button>
                    ) : (
                       <button onClick={() => handlePayClick(inst, activeOrder.id)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm">
                         পেমেন্ট
                       </button>
                    )}
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    )}

    {/* Important Info Card */}
    <div className="bg-indigo-900/5 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
       <div className="flex items-start gap-4">
         <div className="shrink-0 p-3 bg-indigo-100 text-indigo-600 rounded-xl">
           <FileText className="w-6 h-6" />
         </div>
         <div>
           <h4 className="text-indigo-900 font-bold mb-3 text-lg">গুরুত্বপূর্ণ তথ্য</h4>
           <ul className="space-y-2 text-sm text-indigo-900/80 font-medium">
             <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-indigo-400 before:rounded-full">ওয়েবসাইট ডেলিভারি এবং পেমেন্ট আনলক হওয়ার পর কিস্তির সময় গণনা শুরু হবে।</li>
             <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-indigo-400 before:rounded-full">প্রতি মাসের নির্দিষ্ট তারিখে কিস্তি পরিশোধ করুন।</li>
             <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-indigo-400 before:rounded-full">কোনো কিস্তি মিস হলে নির্ধারিত সময়ের পরে লেট ফি প্রযোজ্য হতে পারে।</li>
           </ul>
         </div>
       </div>
    </div>
  </div>
)}
</div>
</div>
)}

{activeTab === 'payments' && (
  <div className="animate-in fade-in zoom-in-95 duration-300">
    <div className="mb-6 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">My Payments</h2>
      <p className="text-sm md:text-base text-neutral-600 font-medium">Transaction history and invoices.</p>
    </div>
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap min-w-[600px]">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">ID</th>
            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {payments.map(p => (
            <tr key={p.id}>
              <td className="px-6 py-4 font-mono text-sm">{p.id}</td>
              <td className="px-6 py-4 font-bold">৳{p.amount?.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm">{p.status}</td>
              <td className="px-6 py-4">
                <button onClick={() => downloadInvoice(p)} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
                  <Download className="w-4 h-4"/> Invoice
                </button>
              </td>
            </tr>
          ))}
          {payments.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No payments found.</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
)}

{activeTab === 'support' && (
  <div className="animate-in fade-in zoom-in-95 duration-300">
    <div className="mb-6 md:mb-10 flex justify-between items-center">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">Support Tickets</h2>
        <p className="text-sm md:text-base text-neutral-600 font-medium">We are here to help.</p>
      </div>
      <button onClick={() => setShowNewTicketModal(true)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
        New Ticket
      </button>
    </div>
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
      {tickets.length === 0 ? <p className="text-center text-neutral-500 py-8">No tickets found.</p> : 
        tickets.map(t => <div key={t.id} className="p-4 border-b border-neutral-100">{t.subject}</div>)
      }
    </div>
  </div>
)}

{activeTab === 'profile' && (
  <div className="animate-in fade-in zoom-in-95 duration-300">
    <div className="mb-6 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2">My Profile</h2>
    </div>
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm max-w-2xl">
      <form onSubmit={updateProfile}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Full Name</label>
            <input type="text" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full px-4 py-3 border border-neutral-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Phone</label>
            <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-3 border border-neutral-200 rounded-xl" />
          </div>
        </div>
        {profileError && (
          <div className="p-4 mb-4 bg-rose-50 text-rose-700 rounded-xl font-bold flex items-center gap-2 border border-rose-100">
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
</div>
</div>
);
}