import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Share2, Heart, Monitor, Tablet, Smartphone, 
  ExternalLink, CheckCircle2, LayoutDashboard, ShieldCheck, 
  Search, Bell, FileText, Zap, CreditCard, PlayCircle, X,
  Upload, Info, CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getStoredTemplates } from '../data/templates';

// Common rich data for templates to keep it simple in data file
const RICH_DATA = {
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
      a: 'Absolutely! You can add custom requirements during the order process. Additional charges may apply based on the complexity of the requests.'
    },
    {
      q: 'What happens after I place an order?',
      a: 'Once you place the order and pay the advance, our team will contact you to gather specific details, branding assets, and contents. We then begin the setup and customization process.'
    },
    {
      q: 'Is hosting included?',
      a: 'We provide free setup on your preferred hosting provider. If you need us to provide hosting, we offer competitive premium hosting packages.'
    }
  ]
};

export function ShowcaseDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'features' | 'included' | 'faq'>('features');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const template = getStoredTemplates().find(t => t.id === id) || getStoredTemplates()[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const minAdvanceAmount = (template.startingPrice * template.minAdvancePercentage) / 100;

  // Order Form State
  const [paymentOption, setPaymentOption] = useState<'min' | 'full' | 'emi6' | 'emi12'>('min');
  const [customAmount, setCustomAmount] = useState<number>(minAdvanceAmount);

  const currentPayment = paymentOption === 'min' ? minAdvanceAmount : paymentOption === 'full' ? template.startingPrice : minAdvanceAmount;
  const emi6Amount = Math.ceil((template.startingPrice - minAdvanceAmount) / 6);
  const emi12Amount = Math.ceil((template.startingPrice - minAdvanceAmount) / 12);

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate(`/checkout/showcase/${id}`);
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLoginRedirect = () => {
    closeAuthModal();
    navigate('/auth');
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
                  {template.category}
                </span>
                <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <PlayCircle className="w-3 h-3" /> Updated: {template.lastUpdated}
                </span>
              </div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{template.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-neutral-600 font-bold hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors">
              <Heart className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={handleOrderClick}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Viewport */}
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
                    src={(template.gallery && template.gallery.length > 0) ? template.gallery[activeGalleryIndex] : (template.coverImage || template.image)} 
                    alt="Template Preview" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {template.gallery && template.gallery.length > 1 && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center z-10">
                   <div className="bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2 border border-neutral-700/50">
                      {template.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={cn(
                            "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                            activeGalleryIndex === idx ? "border-indigo-500 scale-110" : "border-transparent opacity-50 hover:opacity-100"
                          )}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-2xl font-black text-neutral-900 mb-4">{t('details.overview')}</h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                {template.description}
              </p>
              
              <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('details.tech')}</h3>
              <div className="flex flex-wrap gap-2">
                {template.technology.map((tech, i) => (
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
                    {RICH_DATA.features.map((feature, i) => (
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
                    {RICH_DATA.included.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className="font-medium text-neutral-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {RICH_DATA.faq.map((item, i) => (
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
                ${template.startingPrice}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.delivery')}</div>
                  <div className="font-semibold text-neutral-900">{template.deliveryTime}</div>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="text-sm font-semibold text-neutral-500 mb-1">{t('details.info.advance')}</div>
                  <div className="font-semibold text-neutral-900">{template.minAdvancePercentage}% (Min. ${minAdvanceAmount})</div>
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
                  {t('details.order')}
                </button>
                <a 
                  href="#"
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-colors",
                    template.status === 'Live' ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  )}
                >
                  <ExternalLink className="w-5 h-5" />
                  {template.status === 'Live' ? 'Live Website' : 'Live Website'}
                </a>
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
              onClick={closeAuthModal}
              className="w-full bg-neutral-100 text-neutral-700 font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors"
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
                      <input type="text" readOnly value={template.title} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
                      <input type="text" readOnly value={template.category} className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 font-medium focus:outline-none" />
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
                        <span className="text-sm text-neutral-500">{template.minAdvancePercentage}% required to start</span>
                      </label>
                      
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", paymentOption === 'full' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} />
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900">{t('order.payment.full')}</span>
                          <span className="font-bold text-indigo-600">${template.startingPrice}</span>
                        </div>
                        <span className="text-sm text-neutral-500">Pay everything upfront</span>
                      </label>

                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", paymentOption === 'emi6' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={paymentOption === 'emi6'} onChange={() => setPaymentOption('emi6')} />
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900">EMI (6 Months)</span>
                          <span className="font-bold text-indigo-600">${minAdvanceAmount}</span>
                        </div>
                        <span className="text-sm text-neutral-500">Advance + ${emi6Amount}/mo for 6 mos</span>
                      </label>
                      
                      <label className={cn("block relative p-4 rounded-xl border-2 cursor-pointer transition-all", paymentOption === 'emi12' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-neutral-300")}>
                        <input type="radio" name="payment" className="hidden" checked={paymentOption === 'emi12'} onChange={() => setPaymentOption('emi12')} />
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-900">EMI (12 Months)</span>
                          <span className="font-bold text-indigo-600">${minAdvanceAmount}</span>
                        </div>
                        <span className="text-sm text-neutral-500">Advance + ${emi12Amount}/mo for 12 mos</span>
                      </label>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-neutral-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">{t('order.summary.price')}</span>
                        <span className="font-medium text-neutral-900">${template.startingPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900">{t('order.summary.paying')}</span>
                        <span className="font-black text-2xl text-indigo-600">${currentPayment}</span>
                      </div>
                      {paymentOption === 'min' && (
                        <div className="flex justify-between items-center text-sm p-3 bg-amber-50 text-amber-800 rounded-lg">
                          <span className="font-medium">{t('order.summary.remaining')}</span>
                          <span className="font-bold">${template.startingPrice - currentPayment}</span>
                        </div>
                      )}
                      
                      {paymentOption === 'emi6' && (
                        <div className="flex flex-col gap-1 text-sm p-3 bg-blue-50 text-blue-800 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Monthly EMI (6 Months)</span>
                            <span className="font-bold">${emi6Amount}/mo</span>
                          </div>
                          <div className="text-xs opacity-80">First EMI due next month</div>
                        </div>
                      )}
                      
                      {paymentOption === 'emi12' && (
                        <div className="flex flex-col gap-1 text-sm p-3 bg-blue-50 text-blue-800 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Monthly EMI (12 Months)</span>
                            <span className="font-bold">${emi12Amount}/mo</span>
                          </div>
                          <div className="text-xs opacity-80">First EMI due next month</div>
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
