import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Share2, Heart, Monitor, Tablet, Smartphone, 
  ExternalLink, CheckCircle2, LayoutDashboard, ShieldCheck, 
  Search, Bell, FileText, Zap, CreditCard, PlayCircle, X,
  Upload, Info
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
    'Video User Manual',
    '3 Months Basic Support'
  ]
};

export function TemplateDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activePreview, setActivePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const minAdvanceAmount = (MOCK_TEMPLATE.startingPrice * MOCK_TEMPLATE.minAdvancePercentage) / 100;

  // Order Form State
  const [paymentOption, setPaymentOption] = useState<'min' | 'full' | 'custom'>('min');
  const [customAmount, setCustomAmount] = useState<number>(minAdvanceAmount);

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleMockLogin = () => {
    navigate('/auth');
  };

  const currentPayment = paymentOption === 'min' ? minAdvanceAmount : paymentOption === 'full' ? MOCK_TEMPLATE.startingPrice : customAmount;

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-[80px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/templates" className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('details.back')}
            </Link>
            <div className="h-6 w-px bg-neutral-200 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                {MOCK_TEMPLATE.category}
              </span>
              <h1 className="text-lg font-bold text-neutral-900">{MOCK_TEMPLATE.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column - Content */}
        <div className="flex-1 space-y-10">
          
          {/* Visual Preview Section */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-neutral-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActivePreview('desktop')}
                  className={cn("p-2 rounded-lg transition-all", activePreview === 'desktop' ? "bg-white shadow-sm text-indigo-600" : "text-neutral-500 hover:text-neutral-700")}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActivePreview('tablet')}
                  className={cn("p-2 rounded-lg transition-all", activePreview === 'tablet' ? "bg-white shadow-sm text-indigo-600" : "text-neutral-500 hover:text-neutral-700")}
                >
                  <Tablet className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActivePreview('mobile')}
                  className={cn("p-2 rounded-lg transition-all", activePreview === 'mobile' ? "bg-white shadow-sm text-indigo-600" : "text-neutral-500 hover:text-neutral-700")}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />
                {t('details.live_demo')}
              </button>
            </div>

            <div className="bg-neutral-100 rounded-2xl overflow-hidden aspect-[16/10] flex items-center justify-center relative group">
               <img 
                src={MOCK_TEMPLATE.coverImage} 
                alt="Preview" 
                className={cn(
                  "object-cover transition-all duration-500 shadow-2xl",
                  activePreview === 'desktop' ? "w-full h-full" : 
                  activePreview === 'tablet' ? "w-[60%] h-[80%] rounded-xl" : 
                  "w-[30%] h-[80%] rounded-xl"
                )}
               />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-indigo-600 transition-colors shadow-xl border border-white/30">
                    <PlayCircle className="w-8 h-8" />
                  </button>
               </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Overview</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              {MOCK_TEMPLATE.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.tech')}</div>
                <div className="font-semibold text-neutral-900">{MOCK_TEMPLATE.technology.join(', ')}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.updated')}</div>
                <div className="font-semibold text-neutral-900">{MOCK_TEMPLATE.lastUpdated}</div>
              </div>
               <div>
                <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.delivery')}</div>
                <div className="font-semibold text-neutral-900">{MOCK_TEMPLATE.deliveryTime}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.advance')}</div>
                <div className="font-semibold text-indigo-600">{MOCK_TEMPLATE.minAdvancePercentage}%</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">{t('details.features')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {MOCK_TEMPLATE.features.map((feature, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="text-indigo-600 bg-indigo-50 p-3 rounded-xl">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-neutral-900 text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">{t('details.included')}</h2>
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {MOCK_TEMPLATE.included.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Sticky Order Card */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-[160px] bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl shadow-indigo-100/50">
            <div className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">Starting From</div>
            <div className="text-5xl font-black text-neutral-900 mb-6 flex items-baseline gap-1">
              <span className="text-2xl text-neutral-400 font-medium">$</span>
              {MOCK_TEMPLATE.startingPrice}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600 font-medium">{t('details.info.delivery')}</span>
                <span className="font-bold text-neutral-900">{MOCK_TEMPLATE.deliveryTime}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600 font-medium">{t('details.info.advance')}</span>
                <span className="font-bold text-indigo-600">${minAdvanceAmount} ({MOCK_TEMPLATE.minAdvancePercentage}%)</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleOrderClick}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-600/30"
              >
                {t('details.order')}
              </button>
              <button className="w-full flex justify-center items-center gap-2 bg-white border-2 border-neutral-200 text-neutral-700 font-bold text-lg py-3.5 px-6 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
                <ExternalLink className="w-5 h-5" />
                {t('details.live_demo')}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Login Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-center text-neutral-900 mb-3">{t('auth.required')}</h3>
            <p className="text-center text-neutral-600 mb-8 leading-relaxed">
              {t('auth.required_desc')}
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleMockLogin}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                {t('auth.login')}
              </button>
              <button className="w-full bg-white border border-neutral-200 text-neutral-700 font-bold py-4 rounded-xl hover:bg-neutral-50 transition-colors">
                {t('auth.register')}
              </button>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-6 text-sm font-semibold text-neutral-500 hover:text-neutral-800 w-full text-center"
            >
              {t('auth.close')}
            </button>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div>
                <h3 className="text-2xl font-black text-neutral-900">{t('order.title')}</h3>
                <p className="text-neutral-500 text-sm mt-1">{t('order.desc')}</p>
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
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Form Fields */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Selected Website</label>
                      <input type="text" readOnly value={MOCK_TEMPLATE.title} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
                      <input type="text" readOnly value={MOCK_TEMPLATE.category} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">{t('order.form.desc')} *</label>
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                      placeholder="Describe your business and specific requirements..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">{t('order.form.ref')}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="https://"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Upload Files (Images, Docs)</label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:bg-neutral-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop<br />
                      <span className="text-sm text-neutral-500">SVG, PNG, JPG or PDF (max. 10MB)</span>
                    </div>
                  </div>
                </div>

                {/* Payment Column */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm sticky top-0">
                    <h4 className="text-lg font-bold text-neutral-900 mb-6">{t('order.payment.title')}</h4>
                    
                    <div className="space-y-3 mb-8">
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", paymentOption === 'min' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={paymentOption === 'min'} onChange={() => setPaymentOption('min')} />
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900">{t('order.payment.min')}</span>
                          <span className="font-bold text-indigo-600">${minAdvanceAmount}</span>
                        </div>
                        <span className="text-sm text-neutral-500">{MOCK_TEMPLATE.minAdvancePercentage}% required to start</span>
                      </label>
                      
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", paymentOption === 'full' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} />
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900">{t('order.payment.full')}</span>
                          <span className="font-bold text-indigo-600">${MOCK_TEMPLATE.startingPrice}</span>
                        </div>
                        <span className="text-sm text-neutral-500">Pay everything upfront</span>
                      </label>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-neutral-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">{t('order.summary.price')}</span>
                        <span className="font-medium text-neutral-900">${MOCK_TEMPLATE.startingPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900">{t('order.summary.paying')}</span>
                        <span className="font-black text-2xl text-indigo-600">${currentPayment}</span>
                      </div>
                      {paymentOption !== 'full' && (
                        <div className="flex justify-between items-center text-sm p-3 bg-amber-50 text-amber-800 rounded-lg">
                          <span className="font-medium">{t('order.summary.remaining')}</span>
                          <span className="font-bold">${MOCK_TEMPLATE.startingPrice - currentPayment}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 mt-8"
                    >
                      {t('order.submit')}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium text-neutral-400">
                      <ShieldCheck className="w-4 h-4" /> Secure SSL Payment
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
