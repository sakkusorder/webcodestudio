import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronRight, ChevronLeft, Check, Upload, ShieldCheck,
  Building, User, Mail, Phone, Globe, Layout, Settings, 
  Palette, DollarSign, Clock, FileText, Send
} from 'lucide-react';
import { cn } from '../lib/utils';

const WEBSITE_TYPES = [
  'Ecommerce', 'Business', 'Portfolio', 'Agency', 'School', 
  'Hospital', 'Restaurant', 'Travel', 'Blog', 'News', 
  'Landing Page', 'Real Estate', 'Others'
];

const FEATURES = [
  'Admin Panel', 'Customer Login', 'User Dashboard', 'Shopping Cart', 
  'Checkout', 'Payment Gateway', 'Invoice System', 'Notifications', 
  'Blog', 'Chat', 'Appointment Booking', 'Booking System', 'POS', 
  'Inventory', 'Reports', 'Analytics', 'SEO', 'Multi Language', 
  'Dark Mode', 'Mobile App API', 'Live Chat', 'Social Login', 
  'Wishlist', 'Coupons', 'Offers', 'Review System', 'Order Tracking', 
  'Delivery Tracking', 'QR Code', 'Barcode', 'Affiliate System', 
  'Referral System', 'Membership', 'Subscription', 'Others'
];

const STYLES = [
  'Minimal', 'Corporate', 'Luxury', 'Modern', 'Dark', 'Light', 
  'Glassmorphism', 'Material', 'Custom'
];

const PRIORITIES = ['Normal', 'Urgent', 'Very Urgent'];

export function CustomProject() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Client Information
    fullName: '', email: '', mobile: '', whatsapp: '', 
    companyName: '', businessType: '', country: '', city: '',
    // Step 2: Project Information
    websiteName: '', websiteType: '', projectDescription: '',
    // Step 3: Required Features
    features: [] as string[],
    // Step 4: Design Reference
    referenceUrl: '', preferredColor: '', preferredStyle: '',
    // Step 5: Budget & Timeline
    budget: '', deliveryTime: '', launchDate: '', priority: 'Normal',
    // Additional Notes
    notes: ''
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      processSubmission();
    }
  };

  const handleMockLogin = () => {
    navigate('/auth');
  };

  const processSubmission = async () => {
    try {
      const newCustomOrder = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        client: formData.fullName || 'Unknown',
        type: formData.projectType || 'Custom Project',
        budget: formData.budget || 'Not specified',
        timeline: formData.timeline || 'Not specified',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        details: formData
      };

      const existingOrders = JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]');
      localStorage.setItem('wcs_custom_orders', JSON.stringify([newCustomOrder, ...existingOrders]));

      const response = await fetch('/api/custom-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        navigate('/dashboard', { state: { newProject: true } });
      } else {
        console.error('Failed to submit custom request');
        // Handle failure if needed
      }
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    { num: 1, title: t('custom_project.step1'), icon: <User className="w-5 h-5" /> },
    { num: 2, title: t('custom_project.step2'), icon: <Layout className="w-5 h-5" /> },
    { num: 3, title: t('custom_project.step3'), icon: <Settings className="w-5 h-5" /> },
    { num: 4, title: t('custom_project.step4'), icon: <Palette className="w-5 h-5" /> },
    { num: 5, title: t('custom_project.step5'), icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-indigo-900 text-white pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">{t('custom_project.title')}</h1>
          <p className="text-lg text-indigo-200">{t('custom_project.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-neutral-200 overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="flex bg-neutral-50 border-b border-neutral-100 overflow-x-auto">
            {steps.map((s, idx) => (
              <div 
                key={s.num} 
                className={cn(
                  "flex-1 py-4 px-6 flex items-center justify-center gap-2 border-b-2 transition-all min-w-[200px]",
                  step === s.num 
                    ? "border-indigo-600 bg-white text-indigo-700" 
                    : step > s.num 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-neutral-400"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  step === s.num ? "bg-indigo-100 text-indigo-700" : step > s.num ? "bg-indigo-600 text-white" : "bg-neutral-200 text-neutral-500"
                )}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="font-semibold text-sm whitespace-nowrap">{s.title}</span>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12">
            
            {/* Step 1: Client Information */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('custom_project.step1')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
                    <input type="text" value={formData.fullName} onChange={e => updateFormData('fullName', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address *</label>
                    <input type="email" value={formData.email} onChange={e => updateFormData('email', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Mobile Number *</label>
                    <input type="tel" value={formData.mobile} onChange={e => updateFormData('mobile', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">WhatsApp Number</label>
                    <input type="tel" value={formData.whatsapp} onChange={e => updateFormData('whatsapp', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Company Name (Optional)</label>
                    <input type="text" value={formData.companyName} onChange={e => updateFormData('companyName', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Business Type</label>
                    <input type="text" value={formData.businessType} onChange={e => updateFormData('businessType', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Country</label>
                    <input type="text" value={formData.country} onChange={e => updateFormData('country', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">City</label>
                    <input type="text" value={formData.city} onChange={e => updateFormData('city', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Project Information */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('custom_project.step2')}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Website Name</label>
                    <input type="text" value={formData.websiteName} onChange={e => updateFormData('websiteName', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Website Type</label>
                    <select value={formData.websiteType} onChange={e => updateFormData('websiteType', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none">
                      <option value="">Select a type...</option>
                      {WEBSITE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Project Description</label>
                    <textarea 
                      rows={6} 
                      value={formData.projectDescription} 
                      onChange={e => updateFormData('projectDescription', e.target.value)} 
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                      placeholder="Describe your website in detail. Example: I need a modern ecommerce website with payment gateway, admin panel and inventory management."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Required Features */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">{t('custom_project.step3')}</h2>
                <p className="text-neutral-500 mb-8">Select all the features you need for your project.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {FEATURES.map(feature => {
                    const isSelected = formData.features.includes(feature);
                    return (
                      <div 
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between font-semibold text-sm select-none",
                          isSelected ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                        )}
                      >
                        {feature}
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Design Reference */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('custom_project.step4')}</h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Reference Website URL</label>
                    <input type="text" value={formData.referenceUrl} onChange={e => updateFormData('referenceUrl', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="https://" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Upload Files (Screenshot, PDF, Logo, Documents)</label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:bg-neutral-50 hover:border-indigo-400 transition-colors cursor-pointer group bg-neutral-50/50">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop<br />
                      <span className="text-sm text-neutral-500">SVG, PNG, JPG or PDF (max. 10MB)</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Preferred Colour</label>
                      <input type="text" value={formData.preferredColor} onChange={e => updateFormData('preferredColor', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Blue and White" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Preferred Style</label>
                      <select value={formData.preferredStyle} onChange={e => updateFormData('preferredStyle', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none">
                        <option value="">Select a style...</option>
                        {STYLES.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Budget & Timeline */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('custom_project.step5')}</h2>
                <div className="space-y-8">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Project Budget</label>
                      <input type="text" value={formData.budget} onChange={e => updateFormData('budget', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="$ or BDT" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Expected Delivery Time</label>
                      <input type="text" value={formData.deliveryTime} onChange={e => updateFormData('deliveryTime', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. 2 Weeks" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Preferred Launch Date</label>
                      <input type="date" value={formData.launchDate} onChange={e => updateFormData('launchDate', e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-4">Project Priority</label>
                      <div className="flex gap-4">
                        {PRIORITIES.map(priority => (
                          <label key={priority} className={cn("flex-1 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-semibold text-sm", formData.priority === priority ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-neutral-200 hover:border-neutral-300 text-neutral-700")}>
                            <input type="radio" name="priority" className="hidden" checked={formData.priority === priority} onChange={() => updateFormData('priority', priority)} />
                            {priority}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Additional Notes</label>
                    <textarea 
                      rows={4} 
                      value={formData.notes} 
                      onChange={e => updateFormData('notes', e.target.value)} 
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                      placeholder="Please keep the design simple and mobile friendly..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Summary */}
            {step === 6 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('custom_project.summary')}</h2>
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-neutral-500 mb-1">Website Type</div>
                      <div className="font-bold text-neutral-900">{formData.websiteType || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-500 mb-1">Budget</div>
                      <div className="font-bold text-indigo-600 text-xl">{formData.budget || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-500 mb-1">Timeline</div>
                      <div className="font-bold text-neutral-900">{formData.deliveryTime || 'Not specified'}</div>
                    </div>
                     <div>
                      <div className="text-sm font-semibold text-neutral-500 mb-1">Priority</div>
                      <div className="font-bold text-neutral-900">{formData.priority}</div>
                    </div>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="pt-6 border-t border-neutral-200">
                      <div className="text-sm font-semibold text-neutral-500 mb-3">Selected Features</div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map(f => (
                          <span key={f} className="bg-white border border-neutral-200 text-neutral-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-neutral-200 bg-indigo-50/50 p-6 -mx-6 -mb-6 rounded-b-2xl">
                    <p className="text-neutral-600 font-medium mb-6">
                      Review your requirements above. Once submitted, our team will review your project and prepare a custom quotation for you.
                    </p>
                    <button 
                      onClick={handleSubmit}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-600/30"
                    >
                      {t('custom_project.submit')}
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-100">
              <button 
                onClick={prevStep}
                disabled={step === 1}
                className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all", step === 1 ? "opacity-0 pointer-events-none" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200")}
              >
                <ChevronLeft className="w-5 h-5" />
                {t('custom_project.prev')}
              </button>
              
              {step < 6 && (
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-md"
                >
                  {t('custom_project.next')}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
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
    </div>
  );
}
