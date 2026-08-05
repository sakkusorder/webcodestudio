import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_TEMPLATES } from '../data/templates';
import { CreditCard, Wallet, FileText, CheckCircle, ArrowLeft, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    mobile: '',
    company: '',
    country: 'Bangladesh',
    city: '',
    address: '',
    customFeatures: ''
  });

  // Payment states
  const [paymentOption, setPaymentOption] = useState<'full' | 'installment'>('full');
  const [installmentMonths, setInstallmentMonths] = useState<6 | 12>(6);
  // Get minimum downpayment from admin config (fallback to 30)
  const minDownPaymentPercentage = parseInt(localStorage.getItem('wcs_admin_min_downpayment') || '30', 10);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(minDownPaymentPercentage);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'sslcommerz' | 'card'>('sslcommerz');

  useEffect(() => {
    // Both showcase and templates use MOCK_TEMPLATES in this mock app
    const found = MOCK_TEMPLATES.find(t => t.id === id);
    if (found) {
      setProduct(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setDownPaymentPercentage(val);
    }
  };

  const validateDownPayment = () => {
    if (downPaymentPercentage < minDownPaymentPercentage) {
      setDownPaymentPercentage(minDownPaymentPercentage);
    }
    if (downPaymentPercentage > 99) {
      setDownPaymentPercentage(99);
    }
  };

  // Calculations
  const websitePrice = product.offerPrice || product.startingPrice || 50000;
  const downPaymentAmount = paymentOption === 'full' ? 0 : Math.round(websitePrice * (downPaymentPercentage / 100));
  const payingNow = paymentOption === 'full' ? websitePrice : downPaymentAmount;
  const remainingAmount = paymentOption === 'full' ? 0 : websitePrice - downPaymentAmount;
  const monthlyInstallment = remainingAmount > 0 ? Math.round(remainingAmount / installmentMonths) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentOption === 'installment' && downPaymentPercentage < minDownPaymentPercentage) {
      alert(`Minimum down payment is ${minDownPaymentPercentage}%`);
      return;
    }

    let installments = [];
    if (paymentOption === 'installment') {
      let currentDate = new Date();
      for (let i = 1; i <= installmentMonths; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        installments.push({
          id: `EMI-${uuidv4().substring(0, 8).toUpperCase()}`,
          installmentNumber: i,
          dueDate: new Date(currentDate).toISOString(),
          amount: monthlyInstallment,
          status: 'Pending',
          paidAt: null,
          transactionId: null
        });
      }
    }

    const newOrder = {
      id: `ORD-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: user?.id,
      customer: formData,
      product: {
        id: product.id,
        name: product.title,
        category: product.category,
        package: 'Standard', // Mock
        price: websitePrice,
        deliveryTime: '7-14 Days'
      },
      payment: {
        option: paymentOption,
        method: paymentMethod,
        total: websitePrice,
        paidNow: payingNow,
        remaining: remainingAmount,
        installmentMonths: paymentOption === 'installment' ? installmentMonths : null,
        monthlyInstallment: monthlyInstallment
      },
      installments: installments,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage for mock DB
    const existingOrders = JSON.parse(localStorage.getItem('wcs_orders') || '[]');
    localStorage.setItem('wcs_orders', JSON.stringify([newOrder, ...existingOrders]));

    alert(`Order Confirmed! Your Order ID is ${newOrder.id}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Customer Information */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-sm">1</span>
                  Customer Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Mobile Number *</label>
                    <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Country *</label>
                    <select required name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Address *</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Custom Feature Request */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-sm">2</span>
                  Custom Feature Request
                </h2>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Mention if you need extra features, or if you want to exclude any features from the selected package.
                </label>
                <textarea 
                  name="customFeatures" 
                  value={formData.customFeatures} 
                  onChange={handleInputChange} 
                  rows={5} 
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y" 
                  placeholder="Example: I need a live chat feature, but I don't need the blog section..."
                />
              </div>

              {/* Payment Options */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-sm">3</span>
                  Payment Options
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label className={cn("relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center", paymentOption === 'full' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-indigo-200")}>
                    <input type="radio" name="paymentOption" className="sr-only" checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} />
                    <Wallet className={cn("w-8 h-8 mb-3", paymentOption === 'full' ? "text-indigo-600" : "text-neutral-400")} />
                    <span className="font-bold text-neutral-900 mb-1">Full Payment</span>
                    <span className="text-sm text-neutral-500">Pay the entire amount now</span>
                  </label>
                  
                  <label className={cn("relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center", paymentOption === 'installment' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-indigo-200")}>
                    <input type="radio" name="paymentOption" className="sr-only" checked={paymentOption === 'installment'} onChange={() => setPaymentOption('installment')} />
                    <FileText className={cn("w-8 h-8 mb-3", paymentOption === 'installment' ? "text-indigo-600" : "text-neutral-400")} />
                    <span className="font-bold text-neutral-900 mb-1">Down Payment + Installment</span>
                    <span className="text-sm text-neutral-500">Pay advance and remaining in EMI</span>
                  </label>
                </div>

                {paymentOption === 'installment' && (
                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 mb-2 flex justify-between">
                        <span>Down Payment Percentage</span>
                        <span className="text-indigo-600">{downPaymentPercentage}%</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min={minDownPaymentPercentage} 
                          max="99" 
                          value={downPaymentPercentage} 
                          onChange={handleDownPaymentChange} 
                          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <input 
                          type="number" 
                          min={minDownPaymentPercentage} 
                          max="99"
                          value={downPaymentPercentage}
                          onChange={handleDownPaymentChange}
                          onBlur={validateDownPayment}
                          className="w-20 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="text-sm text-neutral-500">% (Minimum {minDownPaymentPercentage}%)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-neutral-900 mb-3">Installment Duration</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input type="radio" name="installmentMonths" checked={installmentMonths === 6} onChange={() => setInstallmentMonths(6)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
                          <span className="ml-2 text-neutral-700 font-medium">6 Months EMI</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="installmentMonths" checked={installmentMonths === 12} onChange={() => setInstallmentMonths(12)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
                          <span className="ml-2 text-neutral-700 font-medium">12 Months EMI</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Gateway */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-sm">4</span>
                  Payment Gateway
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className={cn("relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center", paymentMethod === 'sslcommerz' ? "border-indigo-600 bg-indigo-50" : "border-neutral-200 hover:border-indigo-200")}>
                    <input type="radio" name="paymentMethod" className="sr-only" checked={paymentMethod === 'sslcommerz'} onChange={() => setPaymentMethod('sslcommerz')} />
                    <CreditCard className="w-6 h-6 mb-2 text-neutral-700" />
                    <span className="font-bold text-sm text-neutral-900">SSLCommerz</span>
                  </label>
                  <label className={cn("relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center", paymentMethod === 'bkash' ? "border-pink-500 bg-pink-50" : "border-neutral-200 hover:border-pink-200")}>
                    <input type="radio" name="paymentMethod" className="sr-only" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                    <Smartphone className="w-6 h-6 mb-2 text-pink-600" />
                    <span className="font-bold text-sm text-neutral-900">bKash</span>
                  </label>
                  <label className={cn("relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center", paymentMethod === 'nagad' ? "border-orange-500 bg-orange-50" : "border-neutral-200 hover:border-orange-200")}>
                    <input type="radio" name="paymentMethod" className="sr-only" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} />
                    <Smartphone className="w-6 h-6 mb-2 text-orange-600" />
                    <span className="font-bold text-sm text-neutral-900">Nagad</span>
                  </label>
                  <label className={cn("relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center", paymentMethod === 'card' ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:border-blue-200")}>
                    <input type="radio" name="paymentMethod" className="sr-only" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <CreditCard className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="font-bold text-sm text-neutral-900">Card</span>
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Order Summary</h3>
              
              <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Website Information</p>
                <p className="font-bold text-neutral-900 mb-1">{product.title}</p>
                <p className="text-sm text-neutral-600 mb-1">Category: {product.category}</p>
                <p className="text-sm text-neutral-600 mb-1">Package: Standard</p>
                <p className="text-sm text-neutral-600">Delivery: 7-14 Days</p>
              </div>

              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-neutral-100">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Website Price</span>
                  <span className="font-semibold text-neutral-900">৳${websitePrice.toLocaleString()}</span>
                </div>
                {paymentOption === 'installment' && (
                  <>
                    <div className="flex justify-between text-indigo-600 font-medium">
                      <span>Down Payment ({downPaymentPercentage}%)</span>
                      <span>৳${downPaymentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Remaining Amount</span>
                      <span className="font-semibold text-neutral-900">৳${remainingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Installment Duration</span>
                      <span className="font-semibold text-neutral-900">{installmentMonths} Months</span>
                    </div>
                    <div className="flex justify-between text-orange-600 font-medium">
                      <span>Monthly EMI</span>
                      <span>৳${monthlyInstallment.toLocaleString()}/mo</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-neutral-900">Total Payable Now</span>
                <span className="text-2xl font-black text-indigo-600">৳${payingNow.toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all"
              >
                Confirm Order <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <p className="text-xs text-center text-neutral-500 mt-4 flex justify-center items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" /> Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
