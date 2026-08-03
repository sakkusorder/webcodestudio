import React, { useState, useEffect } from 'react';
import { 
  Save, Percent, Settings as SettingsIcon, CreditCard, ShoppingBag, 
  Bell, Users, Shield, Globe, HardDrive, Search, SearchCode,
  ToggleLeft, ToggleRight, CheckCircle, Smartphone
} from 'lucide-react';
import { cn } from '../../lib/utils';

const TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'payment', label: 'Payments & Gateways', icon: CreditCard },
  { id: 'website', label: 'Orders & Websites', icon: ShoppingBag },
  { id: 'notification', label: 'Notifications', icon: Bell },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'security', label: 'Security & Backup', icon: Shield },
  { id: 'seo', label: 'SEO & Maintenance', icon: SearchCode },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [minDownPayment, setMinDownPayment] = useState('30');
  const [fullPaymentEnabled, setFullPaymentEnabled] = useState(true);
  const [installmentEnabled, setInstallmentEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem('wcs_admin_min_downpayment');
    if (val) setMinDownPayment(val);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('wcs_admin_min_downpayment', minDownPayment);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const Toggle = ({ enabled, onChange, label, desc }: any) => (
    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
      <div>
        <div className="font-bold text-neutral-900">{label}</div>
        {desc && <div className="text-xs text-neutral-500 mt-1">{desc}</div>}
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={cn(
          "w-12 h-6 rounded-full flex items-center transition-colors px-1",
          enabled ? "bg-indigo-600 justify-end" : "bg-neutral-300 justify-start"
        )}
      >
        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">System Settings</h2>
          <p className="text-neutral-500 font-medium mt-1">Configure global application preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Website Name</label>
                    <input type="text" defaultValue="Web Code Studio" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Contact Number</label>
                    <input type="text" defaultValue="+880 123 456 789" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@webcodestudio.com" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Office Address</label>
                    <textarea rows={3} defaultValue="Dhaka, Bangladesh" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Google Map Location</label>
                    <input type="text" placeholder="Map iframe URL" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Gateways */}
          {activeTab === 'payment' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Payment Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Toggle enabled={fullPaymentEnabled} onChange={setFullPaymentEnabled} label="Full Payment" desc="Allow customers to pay full amount" />
                    <Toggle enabled={installmentEnabled} onChange={setInstallmentEnabled} label="Installment Payment" desc="Enable EMI system for websites" />
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2 mt-4">Minimum Down Payment (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={minDownPayment}
                          onChange={(e) => setMinDownPayment(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        />
                        <Percent className="w-4 h-4 text-neutral-400 absolute left-4 top-3" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Toggle enabled={true} onChange={() => {}} label="Late Fee Penalty" desc="Charge penalty for overdue EMI" />
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2 mt-4">Grace Period (Days)</label>
                      <input type="number" defaultValue="3" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Payment Gateways</h3>
                <div className="space-y-4">
                  {['bKash', 'Nagad', 'SSLCommerz', 'Stripe / Cards'].map(gw => (
                    <div key={gw} className="p-4 border border-neutral-100 rounded-2xl bg-neutral-50 flex items-center justify-between">
                      <div className="font-bold text-neutral-900">{gw} API Settings</div>
                      <button className="text-indigo-600 text-sm font-bold">Configure</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders & Websites */}
          {activeTab === 'website' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Order Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Order Prefix</label>
                      <input type="text" defaultValue="WCS-" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                    </div>
                    <Toggle enabled={true} onChange={() => {}} label="Auto Invoice Number" desc="Generate invoice number automatically" />
                    <Toggle enabled={true} onChange={() => {}} label="Order Confirmation" desc="Auto-confirm ready website orders" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Website Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Default Currency</label>
                      <select className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium">
                        <option>USD ($)</option>
                        <option>BDT (৳)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Delivery Time Options</label>
                      <input type="text" defaultValue="3 Days, 7 Days, 15 Days" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notification' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
               <h3 className="text-lg font-bold text-neutral-900 mb-6">Notification Channels</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <Toggle enabled={true} onChange={() => {}} label="System Notification" desc="In-app notification system" />
                 <Toggle enabled={true} onChange={() => {}} label="Email Notification" desc="Send emails via SMTP" />
                 <Toggle enabled={false} onChange={() => {}} label="SMS Notification" desc="Future ready (Requires API)" />
                 <Toggle enabled={false} onChange={() => {}} label="Push Notification" desc="Future ready Firebase feature" />
               </div>

               <h3 className="text-lg font-bold text-neutral-900 mb-6 border-t border-neutral-100 pt-8">EMI Reminders</h3>
               <div className="space-y-4">
                  {['7 Days Before', '3 Days Before', '1 Day Before', 'On Due Date', 'Overdue'].map(rem => (
                    <label key={rem} className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                      <span className="text-sm font-semibold text-neutral-700">{rem}</span>
                    </label>
                  ))}
               </div>
            </div>
          )}

          {/* Users & Roles */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900">Admin Roles & Permissions</h3>
                <button className="text-indigo-600 text-sm font-bold">Add New Role</button>
              </div>
              <div className="space-y-4">
                {['Super Admin', 'Admin', 'Manager', 'Support Staff', 'Finance Manager'].map((role, i) => (
                  <div key={i} className="p-4 border border-neutral-100 rounded-2xl flex items-center justify-between hover:bg-neutral-50">
                    <div className="font-bold text-neutral-900">{role}</div>
                    <button className="text-neutral-500 hover:text-indigo-600 text-sm font-bold">Edit Permissions</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Backup */}
          {activeTab === 'security' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
               <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                 <h3 className="text-lg font-bold text-neutral-900 mb-6">Security Settings</h3>
                 <div className="space-y-4">
                   <Toggle enabled={false} onChange={() => {}} label="2-Factor Authentication" desc="Require OTP for admin login" />
                   <div>
                     <label className="block text-sm font-semibold text-neutral-700 mb-2">Max Login Attempts</label>
                     <input type="number" defaultValue="5" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-neutral-700 mb-2">Session Timeout (Minutes)</label>
                     <input type="number" defaultValue="120" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                 <h3 className="text-lg font-bold text-neutral-900 mb-6">Backup & Restore</h3>
                 <div className="space-y-4">
                   <button className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                     <HardDrive className="w-5 h-5" /> Database Backup
                   </button>
                   <button className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                     <Globe className="w-5 h-5" /> Website Files Backup
                   </button>
                   <Toggle enabled={true} onChange={() => {}} label="Auto Weekly Backup" desc="Schedule automatic system backups" />
                 </div>
               </div>
             </div>
          )}

          {/* SEO & Maintenance */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Meta Title</label>
                    <input type="text" defaultValue="Web Code Studio - Premium Web Development" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Meta Description</label>
                    <textarea rows={3} defaultValue="Professional web development services with flexible installment plans." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 border-l-4 border-l-rose-500">
                <h3 className="text-lg font-bold text-rose-600 mb-6">System Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} label="Maintenance Mode" desc="Show 'Under Construction' to users" />
                    <Toggle enabled={debugMode} onChange={setDebugMode} label="Debug Mode" desc="Enable error reporting (Dev Only)" />
                  </div>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                      Clear System Cache
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                      View System Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
