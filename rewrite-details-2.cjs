const fs = require('fs');
let code = fs.readFileSync('src/pages/TemplateDetails.tsx', 'utf-8');

// The prompt requested deleting Extra Features, changing delivery, and order submit flows.
// I will just use sed or rewrite the file with the modified text since `TemplateDetails.tsx` was just written by me.

const newCode = `import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Share2, Heart, Monitor, Tablet, Smartphone, 
  ExternalLink, CheckCircle2, LayoutDashboard, ShieldCheck, 
  Search, Bell, FileText, Zap, CreditCard, PlayCircle, X,
  Upload, Info, Facebook, MessageCircle, Send, Link2, ChevronLeft, ChevronRight, Clock, DollarSign, List, Tag
} from 'lucide-react';
import { cn } from '../lib/utils';

// Mock data matching the previous MOCK_TEMPLATES IDs
const MOCK_TEMPLATE = {
  id: '1',
  title: 'E-Commerce Pro',
  category: 'E-Commerce',
  coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=600',
  screenshots: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=600',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600'
  ],
  description: 'A complete, high-conversion e-commerce platform designed for modern brands. Includes inventory management, advanced analytics, and multiple payment gateway integrations. This professional website is built to boost your sales and provide an excellent shopping experience for your customers.',
  technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Stripe'],
  deliveryTime: '14 - 21 Days',
  startingPrice: 499,
  minAdvancePercentage: 30,
  lastUpdated: 'Aug 12, 2026',
  demoUrl: 'https://demo.example.com',
  features: [
    { icon: <LayoutDashboard />, title: 'Admin Dashboard' },
    { icon: <Smartphone />, title: 'Mobile Friendly' },
    { icon: <Zap />, title: 'Fast Loading' },
    { icon: <ShieldCheck />, title: 'Secure Login' },
    { icon: <CreditCard />, title: 'Payment Gateway' },
    { icon: <FileText />, title: 'Order Management' },
    { icon: <Search />, title: 'SEO Ready' },
    { icon: <Bell />, title: 'Notifications' },
  ],
  included: [
    'Domain Setup (1 Year)',
    'Premium Hosting Setup',
    'SSL Certificate Installation',
    'Full Source Code Access',
    'Admin Panel Credentials',
    'Payment Gateway Integration',
    '3 Months Free Support'
  ],
  faq: [
    {
      q: 'Do I get the full source code?',
      a: 'Yes, once the full payment is completed, you will receive the complete source code and ownership rights to the website.'
    },
    {
      q: 'Can I request customizations?',
      a: 'Absolutely. We offer tailored customization to fit your specific brand needs.'
    }
  ]
};

export function TemplateDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'features' | 'included' | 'faq'>('features');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    businessName: '',
    deliveryTime: '১৫ দিন',
    paymentOption: 'Full Payment',
    installmentMonths: '৬ মাস',
    projectDetails: '',
    paymentMethod: 'bkash',
    transactionId: ''
  });

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/auth', { state: { from: location } });
  };

  const handleLiveDemo = () => {
    window.open(MOCK_TEMPLATE.demoUrl, '_blank');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp': shareUrl = \`https://api.whatsapp.com/send?text=\${encodeURIComponent(url)}\`; break;
      case 'facebook': shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`; break;
      case 'telegram': shareUrl = \`https://t.me/share/url?url=\${encodeURIComponent(url)}\`; break;
      case 'copy': 
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowShareModal(false);
        return;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const submitOrder = (e: any) => {
    e.preventDefault();
    setShowOrderModal(false);
    setShowPaymentModal(true);
  };

  const submitPayment = (e: any) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === MOCK_TEMPLATE.screenshots.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? MOCK_TEMPLATE.screenshots.length - 1 : prev - 1));
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* ==================================================== */}
      {/* 📱 MOBILE UI DESIGN */}
      {/* ==================================================== */}
      <div className="block lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-40 px-4 flex items-center justify-between border-b border-neutral-100 shadow-sm">
          <Link to="/templates" className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-3">
            <button onClick={() => setIsSaved(!isSaved)} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isSaved ? "bg-rose-100 text-rose-600" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
              <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
            </button>
            <button onClick={() => setShowShareModal(true)} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. Website Preview Slider */}
        <div className="mt-16 bg-neutral-900 relative aspect-[4/3] w-full overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: \`translateX(-\${currentSlide * 100}%)\` }}
          >
            {MOCK_TEMPLATE.screenshots.map((img, i) => (
              <div key={i} className="min-w-full h-full relative">
                <img src={img} alt={\`Screenshot \${i+1}\`} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </div>
            ))}
          </div>
          
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {MOCK_TEMPLATE.screenshots.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={cn("w-2 h-2 rounded-full transition-all", currentSlide === i ? "bg-white w-4" : "bg-white/50")}
              />
            ))}
          </div>
        </div>

        <div className="px-4 pt-6 pb-20 space-y-6">
          {/* 2. Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handleLiveDemo} className="flex-1 bg-white border border-indigo-200 text-indigo-700 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-indigo-50 transition-colors text-[13px]">
              <ExternalLink className="w-4 h-4" />
              🌐 লাইভ ওয়েবসাইট দেখুন
            </button>
            <button onClick={handleOrderClick} className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors text-[13px]">
              🛒 ওয়েবসাইট অর্ডার করুন
            </button>
          </div>

          {/* 3. Website Information */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-neutral-100">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg mb-2 uppercase tracking-wide">
                {MOCK_TEMPLATE.category}
              </span>
              <h1 className="text-2xl font-black text-neutral-900 leading-tight">
                {MOCK_TEMPLATE.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div className="bg-neutral-50 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-semibold">Price</span>
                </div>
                <div className="text-lg font-black text-indigo-600">\${MOCK_TEMPLATE.startingPrice}</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-2xl">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Delivery Time</span>
                </div>
                <div className="text-sm font-bold text-neutral-900">{MOCK_TEMPLATE.deliveryTime}</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-2xl col-span-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-500">Payment Options</div>
                    <div className="text-sm font-bold text-neutral-900">Full or Installment (EMI)</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. & 5. Website Details */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-neutral-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-neutral-900">ওয়েবসাইটের বিস্তারিত</h2>
            </div>
            <p className="text-neutral-600 text-[15px] leading-relaxed mb-6 font-medium">
              {MOCK_TEMPLATE.description}
            </p>

            {/* Included Features */}
            <div className="pt-5 border-t border-neutral-100">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-indigo-600" /> Included with Website
              </h3>
              <div className="space-y-3">
                {MOCK_TEMPLATE.included.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-[14px] text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="pt-6 mt-6 border-t border-neutral-100">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_TEMPLATE.technology.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg font-bold text-[13px]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================== */}
      {/* 💻 DESKTOP UI DESIGN (Original) */}
      {/* ==================================================== */}
      <div className="hidden lg:block">
        {/* Header Bar */}
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/templates" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {MOCK_TEMPLATE.category}
                  </span>
                  <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> Updated: {MOCK_TEMPLATE.lastUpdated}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{MOCK_TEMPLATE.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={() => setIsSaved(!isSaved)} className={cn("flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-colors", isSaved ? "text-rose-600 bg-rose-50" : "text-neutral-600 hover:bg-rose-50 hover:text-rose-600")}>
                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} /> Save
              </button>
              <button 
                onClick={handleOrderClick}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                🛒 ওয়েবসাইট অর্ডার করুন
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Template Preview Display */}
              <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute top-4 left-0 w-full flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-neutral-700/50">
                    <button 
                      onClick={() => setDeviceView('desktop')}
                      className={cn("p-2 rounded-xl transition-all", deviceView === 'desktop' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-white")}
                    >
                      <Monitor className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setDeviceView('tablet')}
                      className={cn("p-2 rounded-xl transition-all", deviceView === 'tablet' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-white")}
                    >
                      <Tablet className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setDeviceView('mobile')}
                      className={cn("p-2 rounded-xl transition-all", deviceView === 'mobile' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-white")}
                    >
                      <Smartphone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="aspect-[16/10] bg-neutral-900 flex items-center justify-center p-4 sm:p-8">
                  <div className={cn(
                    "bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top border border-neutral-800",
                    deviceView === 'desktop' ? "w-full rounded-xl aspect-[16/9]" :
                    deviceView === 'tablet' ? "w-[768px] rounded-3xl aspect-[3/4]" :
                    "w-[375px] rounded-[3rem] aspect-[9/19] border-8 border-neutral-800"
                  )}>
                    <img 
                      src={MOCK_TEMPLATE.coverImage} 
                      alt="Template Preview" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Overview Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-black text-neutral-900 mb-4">{t('details.overview')}</h2>
                <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                  {MOCK_TEMPLATE.description}
                </p>
                
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('details.tech')}</h3>
                <div className="flex flex-wrap gap-2">
                  {MOCK_TEMPLATE.technology.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-xl font-bold text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200">
                <div className="flex overflow-x-auto border-b border-neutral-100 scrollbar-hide">
                  {[
                    { id: 'features', label: t('details.tabs.features') },
                    { id: 'included', label: t('details.tabs.included') },
                    { id: 'faq', label: t('details.tabs.faq') }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "px-8 py-5 font-bold text-sm whitespace-nowrap transition-colors relative",
                        activeTab === tab.id ? "text-indigo-600" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {activeTab === 'features' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {MOCK_TEMPLATE.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                            {feature.icon}
                          </div>
                          <span className="font-bold text-neutral-900">{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'included' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {MOCK_TEMPLATE.included.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="font-medium text-neutral-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'faq' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {MOCK_TEMPLATE.faq.map((item, i) => (
                        <div key={i}>
                          <h4 className="font-bold text-neutral-900 mb-2">{item.q}</h4>
                          <p className="text-neutral-600 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* Action Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 sticky top-28">
                <div className="text-3xl font-black text-neutral-900 mb-6">
                  \${MOCK_TEMPLATE.startingPrice}
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.delivery')}</div>
                    <div className="font-semibold text-neutral-900">{MOCK_TEMPLATE.deliveryTime}</div>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.advance')}</div>
                    <div className="font-semibold text-neutral-900">{MOCK_TEMPLATE.minAdvancePercentage}% (Min. \${Math.round(MOCK_TEMPLATE.startingPrice * (MOCK_TEMPLATE.minAdvancePercentage / 100))})</div>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.support')}</div>
                    <div className="font-semibold text-neutral-900">3 Months Included</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleOrderClick}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    🛒 ওয়েবসাইট অর্ডার করুন
                  </button>
                  <button onClick={handleLiveDemo} className="w-full bg-neutral-100 text-neutral-900 py-4 rounded-xl font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    🌐 লাইভ ওয়েবসাইট দেখুন
                  </button>
                </div>
              </div>

              {/* Guarantee Card */}
              <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-24 h-24" />
                </div>
                <ShieldCheck className="w-8 h-8 text-indigo-300 mb-4" />
                <h3 className="text-lg font-bold mb-2">100% Satisfaction</h3>
                <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                  We guarantee a full refund of your advance payment if you are not satisfied with the initial design drafts.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Shared Modals for both Desktop and Mobile */}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-neutral-900">Share Website</h3>
              <button onClick={() => setShowShareModal(false)} className="text-neutral-400 hover:text-neutral-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-600">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-600">Facebook</span>
              </button>
              <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-600">Telegram</span>
              </button>
              <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Link2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-600">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 mb-2">{t('auth.login_required')}</h3>
            <p className="text-neutral-600 mb-6 font-medium">
              {t('auth.login_desc')}
            </p>
            <button 
              onClick={handleLoginRedirect}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mb-3"
            >
              {t('auth.login_now')}
            </button>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="w-full bg-neutral-100 text-neutral-700 font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors"
            >
              {t('auth.close')}
            </button>
          </div>
        </div>
      )}

      {/* Professional Order Form Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
            
            {/* Modal Header */}
            <div className="px-5 md:px-8 py-5 md:py-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-neutral-900">অর্ডার ফর্ম</h3>
                <p className="text-neutral-500 text-sm mt-1">দয়া করে আপনার প্রোজেক্টের বিস্তারিত তথ্য দিন</p>
              </div>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors bg-neutral-50"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-50">
              <form onSubmit={submitOrder} className="space-y-6 md:space-y-8 mx-auto">
                
                {/* 1. Website Info */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-base md:text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">1. নির্বাচিত ওয়েবসাইট</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">ওয়েবসাইটের নাম</label>
                      <input type="text" readOnly value={MOCK_TEMPLATE.title} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* 2. Personal Info */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-base md:text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">2. ব্যক্তিগত ও ব্যবসা তথ্য</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Mobile Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Business Name (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Delivery & Payment */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-base md:text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">3. ডেলিভারি ও পেমেন্ট</h4>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">ডেলিভারি সময়</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { time: 'জরুরি (৭ দিন)', price: '+৳৫,০০০ জরুরি ডেলিভারি চার্জ' },
                        { time: '১৫ দিন', price: '' },
                        { time: '৩০ দিন', price: '' },
                        { time: 'Custom Time', price: '' }
                      ].map(d => (
                        <label key={d.time} className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", formData.deliveryTime === d.time ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                          <input type="radio" name="delivery" className="hidden" checked={formData.deliveryTime === d.time} onChange={() => setFormData({...formData, deliveryTime: d.time})} />
                          <div className={cn("font-bold", formData.deliveryTime === d.time ? "text-indigo-700" : "text-neutral-700")}>{d.time}</div>
                          {d.price && <div className="text-sm font-semibold text-rose-600 mt-1">{d.price}</div>}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">পেমেন্ট অপশন</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", formData.paymentOption === 'Full Payment' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={formData.paymentOption === 'Full Payment'} onChange={() => setFormData({...formData, paymentOption: 'Full Payment'})} />
                        <div className="font-bold text-neutral-900 mb-1">Full Payment</div>
                        <div className="text-sm text-neutral-500">এককালীন সম্পূর্ণ পেমেন্ট</div>
                      </label>
                      
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", formData.paymentOption === 'Installment' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={formData.paymentOption === 'Installment'} onChange={() => setFormData({...formData, paymentOption: 'Installment'})} />
                        <div className="font-bold text-neutral-900 mb-1">Installment (কিস্তি)</div>
                        <div className="text-sm text-neutral-500">মাসিক কিস্তিতে পেমেন্ট করুন</div>
                      </label>
                    </div>

                    {formData.paymentOption === 'Installment' && (
                      <div className="mt-4 p-4 md:p-5 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-semibold text-blue-900 mb-3">কিস্তির মেয়াদ নির্বাচন করুন:</label>
                        <div className="flex gap-6 mb-4">
                          {['৬ মাস', '১২ মাস'].map(m => (
                            <label key={m} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="installment" className="w-5 h-5 text-indigo-600" checked={formData.installmentMonths === m} onChange={() => setFormData({...formData, installmentMonths: m})} />
                              <span className="font-bold text-blue-900">{m}</span>
                            </label>
                          ))}
                        </div>
                        <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm font-bold text-neutral-900 mb-1">ডাউন পেমেন্ট আবশ্যক।</p>
                          <p className="text-sm text-neutral-700">ওয়েবসাইটের কাজ শুরু করার পূর্বে নির্ধারিত ডাউন পেমেন্ট পরিশোধ করতে হবে। বাকি টাকা নির্বাচিত কিস্তি অনুযায়ী পরিশোধ করা যাবে।</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sticky bottom-0 bg-neutral-50 pt-4 pb-2 border-t border-neutral-200 flex justify-end gap-3 md:gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 md:px-6 py-2.5 md:py-3 font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-xl transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 md:px-8 py-2.5 md:py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm md:text-base"
                  >
                    Order Confirm
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Screen Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900">Payment Process</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors bg-neutral-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={submitPayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all", formData.paymentMethod === 'bkash' ? "border-pink-500 bg-pink-50" : "border-neutral-200 hover:border-neutral-300")}>
                      <input type="radio" name="payment_method" className="hidden" checked={formData.paymentMethod === 'bkash'} onChange={() => setFormData({...formData, paymentMethod: 'bkash'})} />
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {/* Placeholder for bKash Logo */}
                        <div className="text-pink-600 font-black text-xl">b</div>
                      </div>
                      <span className="font-bold text-neutral-900">বিকাশ</span>
                    </label>
                    <label className={cn("flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all", formData.paymentMethod === 'nagad' ? "border-orange-500 bg-orange-50" : "border-neutral-200 hover:border-neutral-300")}>
                      <input type="radio" name="payment_method" className="hidden" checked={formData.paymentMethod === 'nagad'} onChange={() => setFormData({...formData, paymentMethod: 'nagad'})} />
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {/* Placeholder for Nagad Logo */}
                        <div className="text-orange-600 font-black text-xl">ন</div>
                      </div>
                      <span className="font-bold text-neutral-900">নগদ</span>
                    </label>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl text-center border border-neutral-200">
                  <div className="text-sm font-semibold text-neutral-500 mb-1">Payment Number</div>
                  <div className="text-2xl font-black text-indigo-600 tracking-wide">01613071344</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Transaction ID</label>
                  <input 
                    type="text" 
                    required
                    value={formData.transactionId}
                    onChange={e => setFormData({...formData, transactionId: e.target.value})}
                    placeholder="e.g. 8JD6K8G3K"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 text-center hover:bg-neutral-50 transition-colors cursor-pointer group relative">
                    <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-neutral-600">Upload Screenshot</span>
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
`;
fs.writeFileSync('src/pages/TemplateDetails.tsx', newCode);
