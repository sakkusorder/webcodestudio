import React, { useState, useEffect } from 'react';
import { Save, User, Lock, Globe, Bell, CreditCard, Building, Monitor, Smartphone, Mail, MapPin, Database, Download, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    general: {
      websiteName: 'Web Code Studio',
      companyInfo: 'Premium Web Development Agency'
    },
    contact: {
      mobileNumber: '+8801900000000',
      whatsappNumber: '+8801900000000',
      email: 'contact@webcodestudio.com',
      officeAddress: 'Dhaka, Bangladesh'
    },
    payment: {
      bkash: '01900000000',
      nagad: '01900000000',
      rocket: '01900000000'
    },
    security: {
      autoSessionTimeout: '30'
    }
  });

  const [activityLog, setActivityLog] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wcs_admin_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    const log = JSON.parse(localStorage.getItem('wcs_admin_activity') || '[]');
    setActivityLog(log.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleSave = () => {
    localStorage.setItem('wcs_admin_settings', JSON.stringify(settings));
    
    // Add to activity log
    const log = JSON.parse(localStorage.getItem('wcs_admin_activity') || '[]');
    log.unshift({
      id: Date.now().toString(),
      adminName: 'Super Admin',
      action: 'Updated System Settings',
      date: new Date().toISOString()
    });
    localStorage.setItem('wcs_admin_activity', JSON.stringify(log));
    setActivityLog(log);
    
    alert('Settings saved successfully!');
  };

  const handleBackup = () => {
    const data = {
      orders: JSON.parse(localStorage.getItem('wcs_orders') || '[]'),
      customOrders: JSON.parse(localStorage.getItem('wcs_custom_orders') || '[]'),
      installments: JSON.parse(localStorage.getItem('wcs_installments') || '[]'),
      settings: settings,
      tickets: JSON.parse(localStorage.getItem('wcs_support_tickets') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wcs_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TABS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'language', label: 'Language', icon: Monitor },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'activity', label: 'Activity Log', icon: Bell },
    { id: 'backup', label: 'Backup & Restore', icon: Database }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">System Settings</h2>
          <p className="text-neutral-500 font-medium mt-1">Manage global configuration and security</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left",
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm min-h-[500px]">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Website Name</label>
                  <input 
                    type="text" 
                    value={settings.general.websiteName}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, websiteName: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Company Information</label>
                  <textarea 
                    value={settings.general.companyInfo}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, companyInfo: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4"/> Mobile Number</label>
                  <input 
                    type="text" 
                    value={settings.contact.mobileNumber}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, mobileNumber: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={settings.contact.whatsappNumber}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, whatsappNumber: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
                  <input 
                    type="email" 
                    value={settings.contact.email}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Office Address</label>
                  <input 
                    type="text" 
                    value={settings.contact.officeAddress}
                    onChange={(e) => setSettings({...settings, contact: {...settings.contact, officeAddress: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Payment Methods</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">bKash Personal Number</label>
                  <input 
                    type="text" 
                    value={settings.payment.bkash}
                    onChange={(e) => setSettings({...settings, payment: {...settings.payment, bkash: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Nagad Personal Number</label>
                  <input 
                    type="text" 
                    value={settings.payment.nagad}
                    onChange={(e) => setSettings({...settings, payment: {...settings.payment, nagad: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Rocket Personal Number</label>
                  <input 
                    type="text" 
                    value={settings.payment.rocket}
                    onChange={(e) => setSettings({...settings, payment: {...settings.payment, rocket: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Language Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-indigo-900">English</div>
                      <div className="text-sm text-indigo-700">Set as default language</div>
                    </div>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", language === 'en' ? "border-indigo-600" : "border-neutral-300")}
                    >
                      {language === 'en' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-indigo-900">বাংলা</div>
                      <div className="text-sm text-indigo-700">Set as default language</div>
                    </div>
                    <button 
                      onClick={() => setLanguage('bn')}
                      className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", language === 'bn' ? "border-indigo-600" : "border-neutral-300")}
                    >
                      {language === 'bn' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Auto Session Timeout (Minutes)</label>
                  <select 
                    value={settings.security.autoSessionTimeout}
                    onChange={(e) => setSettings({...settings, security: {...settings.security, autoSessionTimeout: e.target.value}})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                  </select>
                </div>
                <div className="pt-6 border-t border-neutral-100">
                  <button className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors">
                    Logout From All Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Admin Activity Log</h3>
              <div className="space-y-4">
                {activityLog.slice(0, 50).map((log, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      {log.adminName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">{log.action}</div>
                      <div className="text-sm font-medium text-neutral-500 flex items-center gap-2 mt-1">
                        <User className="w-3 h-3" /> {log.adminName} • 
                        {new Date(log.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {activityLog.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 font-medium">No activity recorded yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-black text-neutral-900 mb-6">Backup & Restore</h3>
              
              <div className="p-6 border border-neutral-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Export Database</h4>
                    <p className="text-sm text-neutral-500 mb-4">Download a complete JSON backup of all orders, tickets, and settings.</p>
                    <button onClick={handleBackup} className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4" /> Generate Backup File
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-neutral-200 rounded-2xl bg-neutral-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-200 text-neutral-500 rounded-xl flex items-center justify-center shrink-0">
                    <Download className="w-6 h-6 rotate-180" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Restore Database</h4>
                    <p className="text-sm text-neutral-500 mb-4">Upload a JSON backup file to restore system state.</p>
                    <input type="file" accept=".json" className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
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
