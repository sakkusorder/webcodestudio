import React, { useState } from 'react';
import { PlusCircle, Search, Edit, Trash2, EyeOff, CheckCircle, X, GripVertical, Star, LayoutTemplate, Briefcase, Globe, Lock, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_TEMPLATES, CATEGORIES, TECHNOLOGIES, Template } from '../../data/templates';

export function Websites() {
  const [websites, setWebsites] = useState<Template[]>(MOCK_TEMPLATES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const initialFormState: Partial<Template> = {
    title: '',
    category: CATEGORIES[0],
    shortDescription: '',
    description: '',
    coverImage: '',
    gallery: [],
    previewVideo: '',
    liveUrl: '',
    demoUrl: '',
    githubUrl: '',
    status: 'Live',
    isClientProject: false,
    visibility: 'Public',
    startingPrice: 0,
    offerPrice: undefined,
    deliveryTime: '',
    technology: [],
    features: [],
    isFeatured: false,
    displayOrder: 0,
    minAdvancePercentage: 30, // Default value
  };

  const [formData, setFormData] = useState<Partial<Template>>(initialFormState);
  
  // Handlers
  const resetForm = () => setFormData(initialFormState);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this website?')) {
      setWebsites(websites.filter(w => w.id !== id));
    }
  };

  const handleDuplicate = (website: Template) => {
    const duplicated = {
      ...website,
      id: Date.now().toString(),
      title: `${website.title} (Copy)`,
    };
    setWebsites([duplicated, ...websites]);
  };

  const toggleVisibility = (id: string, visibility: 'Public' | 'Hidden') => {
    setWebsites(websites.map(w => w.id === id ? { ...w, visibility } : w));
  };

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    setWebsites(websites.map(w => w.id === id ? { ...w, isFeatured } : w));
  };

  const openEdit = (website: Template) => {
    setFormData(website);
    setEditingId(website.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setWebsites(websites.map(w => w.id === editingId ? { ...w, ...formData } as Template : w));
    } else {
      const newWebsite: Template = {
        ...(formData as Template),
        id: Date.now().toString(),
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setWebsites([newWebsite, ...websites]);
    }
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  // Features Array Handlers
  const handleFeatureAdd = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...(formData.features || [])];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };
  const handleFeatureRemove = (index: number) => {
    const updated = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  // Tech Array Handlers
  const handleTechToggle = (tech: string) => {
    const current = formData.technology || [];
    const updated = current.includes(tech)
      ? current.filter(t => t !== tech)
      : [...current, tech];
    setFormData({ ...formData, technology: updated });
  };

  // Gallery Handlers
  const handleGalleryAdd = () => {
    setFormData({ ...formData, gallery: [...(formData.gallery || []), ''] });
  };
  const handleGalleryChange = (index: number, value: string) => {
    const updated = [...(formData.gallery || [])];
    updated[index] = value;
    setFormData({ ...formData, gallery: updated });
  };
  const handleGalleryRemove = (index: number) => {
    const updated = (formData.gallery || []).filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: updated });
  };

  // Filtered Websites
  const filteredWebsites = websites.filter(w => {
    if (categoryFilter !== 'All' && w.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && w.status !== statusFilter) return false;
    if (searchTerm && !w.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Stats
  const stats = {
    total: websites.length,
    live: websites.filter(w => w.status === 'Live').length,
    demo: websites.filter(w => w.status === 'Demo').length,
    client: websites.filter(w => w.isClientProject).length,
    hidden: websites.filter(w => w.visibility === 'Hidden').length,
    featured: websites.filter(w => w.isFeatured).length,
  };

  if (isAdding) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            {editingId ? 'Edit Website' : 'Add New Website'}
          </h2>
          <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          
          <div className="p-8 space-y-12">
            
            {/* Section: Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Basic Information</h3>
                <p className="text-sm text-neutral-500">Core details about the website project.</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Website Name</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Status</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Live' | 'Demo'})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="Live">Live</option>
                      <option value="Demo">Demo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Project Type</label>
                    <select required value={formData.isClientProject ? 'Client' : 'Demo'} onChange={e => setFormData({...formData, isClientProject: e.target.value === 'Client'})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="Demo">Demo Project</option>
                      <option value="Client">Client Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Visibility</label>
                    <select required value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value as 'Public' | 'Hidden'})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="Public">Public</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Short Description</label>
                  <textarea rows={2} value={formData.shortDescription || ''} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Full Description</label>
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Section: Pricing & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Pricing & Delivery</h3>
                <p className="text-sm text-neutral-500">Set the pricing and expected delivery timeframe.</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Website Price ($)</label>
                    <input type="number" required value={formData.startingPrice || ''} onChange={e => setFormData({...formData, startingPrice: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Offer Price ($) <span className="text-neutral-400 font-normal">(Optional)</span></label>
                    <input type="number" value={formData.offerPrice || ''} onChange={e => setFormData({...formData, offerPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Estimated Delivery Time</label>
                  <input type="text" required placeholder="e.g. 14 - 21 Days" value={formData.deliveryTime || ''} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Section: Links & URLs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Links</h3>
                <p className="text-sm text-neutral-500">External URLs for live demo, repository, etc.</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Live Website URL</label>
                    <input type="url" value={formData.liveUrl || ''} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Demo Website URL</label>
                    <input type="url" value={formData.demoUrl || ''} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">GitHub Repository <span className="text-neutral-400 font-normal">(Optional)</span></label>
                  <input type="url" value={formData.githubUrl || ''} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Section: Media */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Media</h3>
                <p className="text-sm text-neutral-500">Thumbnail, gallery images, and video previews.</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Featured Thumbnail URL</label>
                  <input required type="url" value={formData.coverImage || ''} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none mb-2" />
                  {formData.coverImage && (
                    <div className="w-full max-w-sm h-48 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200">
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-neutral-700">Gallery Images (Screenshots)</label>
                    <button type="button" onClick={handleGalleryAdd} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">+ Add Screenshot URL</button>
                  </div>
                  <div className="space-y-3">
                    {(formData.gallery || []).map((img, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="url" 
                            value={img} 
                            placeholder="https://..."
                            onChange={(e) => handleGalleryChange(index, e.target.value)} 
                            className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                          />
                          {img && (
                            <div className="w-32 h-20 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200">
                              <img src={img} className="w-full h-full object-cover" alt="Gallery Preview" />
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={() => handleGalleryRemove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg mt-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {(!formData.gallery || formData.gallery.length === 0) && (
                      <div className="text-sm text-neutral-500 text-center py-6 border-2 border-dashed border-neutral-200 rounded-xl">No gallery images added yet. Click + Add Screenshot URL.</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Preview Video URL <span className="text-neutral-400 font-normal">(Optional)</span></label>
                  <input type="url" value={formData.previewVideo || ''} onChange={e => setFormData({...formData, previewVideo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Section: Tech Stack & Features */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Stack & Features</h3>
                <p className="text-sm text-neutral-500">Technologies used and dynamic feature list.</p>
              </div>
              <div className="md:col-span-8 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">Technology Stack (Select multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {TECHNOLOGIES.map(tech => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechToggle(tech)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border",
                          (formData.technology || []).includes(tech) ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-neutral-700">Dynamic Features List</label>
                    <button type="button" onClick={handleFeatureAdd} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">+ Add Feature</button>
                  </div>
                  <div className="space-y-3">
                    {(formData.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={feature} 
                          onChange={(e) => handleFeatureChange(index, e.target.value)} 
                          className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                        />
                        <button type="button" onClick={() => handleFeatureRemove(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {(!formData.features || formData.features.length === 0) && (
                      <div className="text-sm text-neutral-500 text-center py-4 border-2 border-dashed border-neutral-200 rounded-xl">No features added yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Section: Display Settings */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Display Settings</h3>
                <p className="text-sm text-neutral-500">Order, featured status, and layout.</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Display Order</label>
                  <input type="number" value={formData.displayOrder || 0} onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})} className="w-full max-w-xs px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>

                <div>
                  <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors w-max">
                    <input type="checkbox" checked={formData.isFeatured || false} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-600" />
                    <div>
                      <div className="font-bold text-neutral-900">Featured Website</div>
                      <div className="text-sm text-neutral-500">Show this website prominently with a featured badge.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>
          
          <div className="flex justify-end gap-3 p-6 bg-neutral-50 border-t border-neutral-200">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="px-6 py-3 rounded-xl font-bold text-neutral-700 hover:bg-neutral-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
              {editingId ? 'Update Website' : 'Save Website'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Website Management</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusCircle className="w-4 h-4" /> Add Website
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Total Websites</div>
          <div className="text-2xl font-black text-neutral-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Live Websites</div>
          <div className="text-2xl font-black text-emerald-600">{stats.live}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Demo Websites</div>
          <div className="text-2xl font-black text-blue-600">{stats.demo}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Client Projects</div>
          <div className="text-2xl font-black text-indigo-600">{stats.client}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Hidden</div>
          <div className="text-2xl font-black text-neutral-400">{stats.hidden}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 text-sm font-semibold mb-1">Featured</div>
          <div className="text-2xl font-black text-amber-500">{stats.featured}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input 
            type="text" 
            placeholder="Search websites..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" 
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
        </div>
        
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="Live">Live</option>
          <option value="Demo">Demo</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4 w-10">Order</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status & Type</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredWebsites.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-neutral-400">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-neutral-300" />
                      {item.displayOrder || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 relative group-hover:border-indigo-200 transition-colors">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                        {item.isFeatured && (
                          <div className="absolute top-1 left-1 bg-amber-400 text-amber-950 p-0.5 rounded shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-2">
                          {item.title}
                          {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800"><Globe className="w-3.5 h-3.5" /></a>}
                        </div>
                        <div className="text-xs font-medium text-neutral-500 flex gap-2 mt-0.5">
                          ${item.startingPrice} {item.offerPrice && <span className="text-rose-500 line-through text-[10px]">${item.offerPrice}</span>}
                          <span>•</span> {item.deliveryTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide w-max",
                          item.status === 'Live' ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                        {item.isClientProject ? <Briefcase className="w-3.5 h-3.5" /> : <LayoutTemplate className="w-3.5 h-3.5" />}
                        {item.isClientProject ? 'Client Project' : 'Demo Project'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max",
                      item.visibility === 'Public' ? "bg-indigo-50 text-indigo-700" : "bg-neutral-100 text-neutral-600"
                    )}>
                      {item.visibility === 'Public' ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {item.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* Publish / Unpublish (Visibility) */}
                      {item.visibility === 'Hidden' ? (
                        <button onClick={() => toggleVisibility(item.id, 'Public')} title="Publish (Make Public)" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                      ) : (
                        <button onClick={() => toggleVisibility(item.id, 'Hidden')} title="Unpublish (Hide)" className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"><EyeOff className="w-4 h-4" /></button>
                      )}
                      
                      {/* Featured Toggle */}
                      <button onClick={() => toggleFeatured(item.id, !item.isFeatured)} title={item.isFeatured ? "Remove Featured" : "Make Featured"} className={cn("p-2 rounded-lg transition-colors", item.isFeatured ? "text-amber-500 hover:bg-amber-50" : "text-neutral-400 hover:bg-neutral-100")}>
                        <Star className={cn("w-4 h-4", item.isFeatured && "fill-current")} />
                      </button>

                      {/* Duplicate */}
                      <button onClick={() => handleDuplicate(item)} title="Duplicate" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                      
                      {/* Edit */}
                      <button onClick={() => openEdit(item)} title="Edit" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      
                      {/* Delete */}
                      <button onClick={() => handleDelete(item.id)} title="Delete" className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredWebsites.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-neutral-400 mb-2"><Globe className="w-8 h-8 mx-auto opacity-50" /></div>
                    <div className="text-neutral-900 font-bold">No websites found</div>
                    <div className="text-neutral-500 text-sm mt-1">Adjust your filters or add a new website to get started.</div>
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
