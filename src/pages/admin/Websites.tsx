import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, Eye, EyeOff, Copy, FileText, Image as ImageIcon, CheckCircle, UploadCloud, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Template, getStoredTemplates, getStoredCategories, CategoryInfo } from '../../data/templates';
import { useLanguage } from '../../contexts/LanguageContext';

export function Websites() {
  const { t } = useLanguage();
  const [websites, setWebsitesState] = useState<Template[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    setWebsitesState(getStoredTemplates());
    setCategories(getStoredCategories());
  }, []);

  const setWebsites = (newWebsites: Template[] | ((prev: Template[]) => Template[])) => {
    setWebsitesState((prev) => {
      const updated = typeof newWebsites === 'function' ? newWebsites(prev) : newWebsites;
      localStorage.setItem('wcs_templates', JSON.stringify(updated));
      return updated;
    });
  };

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const initialFormState: Partial<Template> = {
    title: '',
    category: categories[0]?.name || '',
    coverImage: '',
    liveUrl: '',
    startingPrice: 0,
    deliveryTime: '7 days',
    urgentDeliveryPossible: false,
    urgentDeliveryCharge: 0,
    downPaymentAmount: 0,
    installmentAvailable: false,
    installmentOptions: [],
    description: '',
    adminStatus: 'Active',
    features: [],
    technology: []
  };

  const [formData, setFormData] = useState<Partial<Template>>(initialFormState);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this website?')) {
      setWebsites(websites.filter(w => w.id !== id));
    }
  };

  const toggleStatus = (id: string, currentStatus: string = 'Active') => {
    const newStatus = currentStatus === 'Active' ? 'Hidden' : 'Active';
    setWebsites(websites.map(w => w.id === id ? { ...w, adminStatus: newStatus as any } : w));
  };

  const handleDuplicate = (website: Template) => {
    if (confirm('Duplicate this website?')) {
      const copy = { ...website, id: `wcs-${Date.now()}`, title: `${website.title} (Copy)` };
      setWebsites([copy, ...websites]);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert('Website ID Copied: ' + id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setWebsites(websites.map(w => w.id === editingId ? { ...w, ...formData } as Template : w));
    } else {
      const newWebsite: Template = {
        ...(formData as Template),
        id: `wcs-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
        status: 'Live', // User panel status
        gallery: formData.coverImage ? [formData.coverImage] : [],
        totalOrders: 0
      };
      setWebsites([newWebsite, ...websites]);
    }
    alert(`Website ${editingId ? 'updated' : 'uploaded'} successfully!`);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (website: Template) => {
    setFormData({ ...website, adminStatus: website.adminStatus || 'Active' });
    setEditingId(website.id);
    setIsAdding(true);
  };

  const filteredWebsites = websites.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || w.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || w.category === categoryFilter;
    const adminStat = w.adminStatus || 'Active';
    const matchStatus = statusFilter === 'All' || adminStat === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const toggleInstallmentOption = (option: string) => {
    const current = formData.installmentOptions || [];
    if (current.includes(option)) {
      setFormData({ ...formData, installmentOptions: current.filter(o => o !== option) });
    } else {
      setFormData({ ...formData, installmentOptions: [...current, option] });
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      alert('Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData({ ...formData, coverImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const [isDragging, setIsDragging] = useState(false);

  if (isAdding) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {editingId ? 'Edit Website' : 'Upload New Website'}
            </h2>
          </div>
          <button 
            onClick={() => { setIsAdding(false); setEditingId(null); }}
            className="px-4 py-2 text-neutral-600 bg-white border border-neutral-200 rounded-xl font-bold hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Website Name *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Website Category *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20">
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Website Price (BDT) *</label>
                <input required type="number" value={formData.startingPrice} onChange={e => setFormData({...formData, startingPrice: Number(e.target.value)})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Down Payment Amount (BDT) *</label>
                <input required type="number" value={formData.downPaymentAmount || ''} onChange={e => setFormData({...formData, downPaymentAmount: Number(e.target.value)})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-neutral-900">Delivery Time *</label>
                <input required type="text" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} placeholder="e.g. 7-10 Days" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Upload Section</h3>
            <div className="space-y-8">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Website Thumbnail *</label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-8 text-center transition-all",
                    isDragging ? "border-indigo-600 bg-indigo-50" : "border-neutral-300 hover:border-indigo-400 bg-neutral-50/50"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                >
                  {formData.coverImage ? (
                    <div className="relative inline-block">
                      <img src={formData.coverImage} alt="Thumbnail Preview" className="max-h-64 rounded-xl shadow-md object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, coverImage: ''})}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-white text-rose-600 rounded-full shadow-lg flex items-center justify-center hover:bg-rose-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-indigo-600">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 mb-1">Upload Thumbnail</h4>
                      <p className="text-sm text-neutral-500 mb-4">Drag & drop your image here, or click to browse</p>
                      <p className="text-xs text-neutral-400 mb-6">Supported formats: JPG, JPEG, PNG, WEBP (Max 5MB)</p>
                      <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all">
                        Browse Files
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/jpeg, image/png, image/jpg, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900">Live Website URL *</label>
                <input required type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} placeholder="https://example.com" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Website Description</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-900">Detailed Description (Features, Services, Hosting etc.) *</label>
              <textarea required rows={10} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm resize-y" placeholder="- Website Features\n- Included Services\n- Hosting Information\n- Domain Information\n- Support Information\n- Additional সুবিধা"></textarea>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Website Status</h3>
            <div className="space-y-2 max-w-sm">
              <select value={formData.adminStatus || 'Active'} onChange={e => setFormData({...formData, adminStatus: e.target.value as any})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20">
                <option value="Active">Active</option>
                <option value="Hidden">Hidden</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all">
              {editingId ? 'Save Changes' : 'Upload Website'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{t('admin.website_management')}</h2>
          <p className="text-neutral-500 font-medium mt-1">Manage and upload templates</p>
        </div>
        <button 
          onClick={() => { setFormData(initialFormState); setIsAdding(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Upload Website
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 font-bold text-neutral-400 text-sm">Website</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Category</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Price</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Orders</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Status</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredWebsites.map(website => (
                <tr key={website.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      {website.coverImage ? (
                        <img src={website.coverImage} alt={website.title} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-neutral-900 truncate max-w-[200px]">{website.title}</div>
                        <div className="text-xs text-neutral-500 font-mono mt-1 flex items-center gap-1">
                          {website.id}
                          <button onClick={() => handleCopyId(website.id)} className="hover:text-indigo-600"><Copy className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-neutral-700">{website.category}</span>
                  </td>
                  <td className="py-4">
                    <div className="font-bold text-neutral-900">৳{website.startingPrice?.toLocaleString()}</div>
                    {website.downPaymentAmount ? (
                      <div className="text-xs text-neutral-500">Down: ৳{website.downPaymentAmount.toLocaleString()}</div>
                    ) : null}
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-bold text-neutral-900">{website.totalOrders || 0}</span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      (website.adminStatus || 'Active') === 'Active' ? "bg-emerald-50 text-emerald-600" : 
                      (website.adminStatus === 'Hidden' ? "bg-neutral-100 text-neutral-600" : "bg-amber-50 text-amber-600")
                    )}>
                      {website.adminStatus || 'Active'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleStatus(website.id, website.adminStatus)} title="Toggle Visibility" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        {(website.adminStatus || 'Active') === 'Active' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button onClick={() => handleDuplicate(website)} title="Duplicate" className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Copy className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEdit(website)} title="Edit" className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(website.id)} title="Delete" className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredWebsites.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                    No websites found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
