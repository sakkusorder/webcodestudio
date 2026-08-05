const fs = require('fs');

const newCode = `import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Share2, Heart, Monitor, Tablet, Smartphone, 
  ExternalLink, CheckCircle2, LayoutDashboard, ShieldCheck, 
  Search, Bell, FileText, Zap, CreditCard, PlayCircle, X,
  Upload, Info, Facebook, MessageCircle, Send, Link2
} from 'lucide-react';
import { cn } from '../lib/utils';

// Mock data matching the previous MOCK_TEMPLATES IDs
const MOCK_TEMPLATE = {
  id: '1',
  title: 'E-Commerce Pro',
  category: 'E-Commerce',
  coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=600',
  description: 'A complete, high-conversion e-commerce platform designed for modern brands. Includes inventory management, advanced analytics, and multiple payment gateway integrations.',
  technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
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

const EXTRA_FEATURES = [
  'Logo Design',
  'Domain Registration',
  'Hosting',
  'SEO Setup',
  'Android App',
  'iOS App',
  'Admin Panel',
  'Custom Feature'
];

export default function TemplateDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'features' | 'included' | 'faq'>('features');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    businessName: '',
    deliveryTime: '১৫ দিনের মধ্যে',
    paymentOption: 'Full Payment',
    installmentMonths: '৬ মাস',
    projectDetails: '',
    extraFeatures: [] as string[]
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

  const handleToggleFeature = (feature: string) => {
    setFormData(prev => {
      const exists = prev.extraFeatures.includes(feature);
      if (exists) {
        return { ...prev, extraFeatures: prev.extraFeatures.filter(f => f !== feature) };
      }
      return { ...prev, extraFeatures: [...prev.extraFeatures, feature] };
    });
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

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate DB save and navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
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
            <button onClick={() => setShowShareModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={() => setIsSaved(!isSaved)} className={cn("hidden sm:flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-colors", isSaved ? "text-rose-600 bg-rose-50" : "text-neutral-600 hover:bg-rose-50 hover:text-rose-600")}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div>
                <h3 className="text-2xl font-black text-neutral-900">অর্ডার ফর্ম</h3>
                <p className="text-neutral-500 text-sm mt-1">দয়া করে আপনার প্রোজেক্টের বিস্তারিত তথ্য দিন</p>
              </div>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-neutral-50">
              <form onSubmit={submitOrder} className="space-y-8 max-w-4xl mx-auto">
                
                {/* 1. Website Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">1. নির্বাচিত ওয়েবসাইট</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">ওয়েবসাইটের নাম</label>
                      <input type="text" readOnly value={MOCK_TEMPLATE.title} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">ক্যাটাগরি</label>
                      <input type="text" readOnly value={MOCK_TEMPLATE.category} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* 2. Personal Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">2. ব্যক্তিগত ও ব্যবসা তথ্য</h4>
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">3. ডেলিভারি ও পেমেন্ট</h4>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">ডেলিভারি সময়</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['জরুরি (৭ দিন)', '১৫ দিনের মধ্যে', '৩০ দিনের মধ্যে', 'কাস্টম সময়'].map(time => (
                        <label key={time} className={cn("block relative p-3 rounded-xl border-2 cursor-pointer transition-all text-center", formData.deliveryTime === time ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                          <input type="radio" name="delivery" className="hidden" checked={formData.deliveryTime === time} onChange={() => setFormData({...formData, deliveryTime: time})} />
                          <span className={cn("text-sm font-bold", formData.deliveryTime === time ? "text-indigo-700" : "text-neutral-700")}>{time}</span>
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
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-semibold text-blue-900 mb-3">কিস্তির মেয়াদ নির্বাচন করুন:</label>
                        <div className="flex gap-4">
                          {['৬ মাস', '১২ মাস'].map(m => (
                            <label key={m} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="installment" className="w-4 h-4 text-indigo-600" checked={formData.installmentMonths === m} onChange={() => setFormData({...formData, installmentMonths: m})} />
                              <span className="font-semibold text-blue-800">{m}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Extra Features */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">4. এক্সট্রা ফিচার্স</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {EXTRA_FEATURES.map(feature => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-600"
                          checked={formData.extraFeatures.includes(feature)}
                          onChange={() => handleToggleFeature(feature)}
                        />
                        <span className="text-sm font-semibold text-neutral-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Project Details & Files */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">5. প্রোজেক্টের বিস্তারিত</h4>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Project Requirements</label>
                    <textarea 
                      rows={5}
                      required
                      value={formData.projectDetails}
                      onChange={e => setFormData({...formData, projectDetails: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-y"
                      placeholder="আপনার প্রোজেক্ট সম্পর্কে বিস্তারিত লিখুন..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Upload Files (Multiple)</label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:bg-neutral-50 hover:border-indigo-400 transition-colors cursor-pointer group relative">
                      <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip" />
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop<br />
                      <span className="text-sm text-neutral-500 mt-1 block">Screenshot, Design Image, PDF, DOC, ZIP (max. 10MB each)</span>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-neutral-50 pt-4 pb-2 border-t border-neutral-200 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-6 py-3 font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  >
                    Confirm Order
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
`

fs.writeFileSync('src/pages/TemplateDetails.tsx', newCode);
