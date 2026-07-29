import React, { useState } from 'react';
import { PlusCircle, Search, Filter, MoreVertical, Edit, Trash2, Eye, Copy, Globe, EyeOff, CheckCircle, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Website {
  id: string;
  name: string;
  category: string;
  status: 'Published' | 'Hidden';
  thumbnail: string;
  screenshots: string[];
  liveDemoUrl: string;
  liveWebsiteUrl: string;
  description: string;
  features: string;
  sales: number;
}

const INITIAL_WEBSITES: Website[] = [
  { id: '1', name: 'Modern E-commerce', category: 'E-commerce', status: 'Published', sales: 42, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=100&h=100', screenshots: [], liveDemoUrl: 'https://demo.example.com', liveWebsiteUrl: 'https://example.com', description: 'A modern e-commerce platform.', features: 'Cart, Checkout, Payment' },
  { id: '2', name: 'Corporate Business', category: 'Corporate', status: 'Published', sales: 15, thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=100&h=100', screenshots: [], liveDemoUrl: 'https://demo2.example.com', liveWebsiteUrl: 'https://example2.com', description: 'Professional corporate template.', features: 'About, Services, Contact' },
];

export function Websites() {
  const [websites, setWebsites] = useState<Website[]>(INITIAL_WEBSITES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', category: 'E-commerce', description: '', features: '', liveDemoUrl: '', liveWebsiteUrl: '', status: 'Published' as 'Published' | 'Hidden'
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [screenshotsPreview, setScreenshotsPreview] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this website?')) {
      setWebsites(websites.filter(w => w.id !== id));
    }
  };

  const toggleStatus = (id: string, newStatus: Website['status']) => {
    setWebsites(websites.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setThumbnailPreview(url);
    }
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setScreenshotsPreview([...screenshotsPreview, ...urls]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotsPreview(screenshotsPreview.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setWebsites(websites.map(w => w.id === editingId ? { 
        ...w, ...formData, 
        thumbnail: thumbnailPreview || w.thumbnail,
        screenshots: screenshotsPreview.length > 0 ? screenshotsPreview : w.screenshots
      } : w));
      setEditingId(null);
    } else {
      const newWebsite: Website = {
        id: Date.now().toString(),
        ...formData,
        sales: 0,
        thumbnail: thumbnailPreview || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=100&h=100',
        screenshots: screenshotsPreview
      };
      setWebsites([newWebsite, ...websites]);
    }
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'E-commerce', description: '', features: '', liveDemoUrl: '', liveWebsiteUrl: '', status: 'Published' });
    setThumbnailPreview('');
    setScreenshotsPreview([]);
  };

  const openEdit = (item: Website) => {
    setFormData({ 
      name: item.name, 
      category: item.category, 
      description: item.description, 
      features: item.features, 
      liveDemoUrl: item.liveDemoUrl, 
      liveWebsiteUrl: item.liveWebsiteUrl,
      status: item.status 
    });
    setThumbnailPreview(item.thumbnail);
    setScreenshotsPreview(item.screenshots);
    setEditingId(item.id);
  };

  if (isAdding || editingId) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            {editingId ? 'Edit Website' : 'Add New Website'}
          </h2>
          <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="text-neutral-500 hover:text-neutral-900 font-bold">
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Media Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Thumbnail</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-indigo-300 transition-colors relative overflow-hidden">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-500">
                        <UploadCloud className="w-8 h-8 mb-2 text-indigo-500" />
                        <p className="text-xs font-medium">Click to upload thumbnail</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Screenshots</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-indigo-300 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-500">
                      <ImageIcon className="w-8 h-8 mb-2 text-indigo-500" />
                      <p className="text-xs font-medium">Click to upload multiple screenshots</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleScreenshotsChange} />
                  </label>
                </div>
              </div>
              
              {screenshotsPreview.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {screenshotsPreview.map((src, idx) => (
                    <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeScreenshot(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-rose-500 hover:text-rose-700"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 border-b border-neutral-100 my-2"></div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Website Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                <option>E-commerce</option>
                <option>Corporate</option>
                <option>Portfolio</option>
                <option>Blog</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Live Demo URL</label>
              <input type="url" value={formData.liveDemoUrl} onChange={e => setFormData({...formData, liveDemoUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Live Website URL</label>
              <input type="url" value={formData.liveWebsiteUrl} onChange={e => setFormData({...formData, liveWebsiteUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-700 mb-1">Features</label>
              <input type="text" placeholder="Comma separated features" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-700 mb-1">Description</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
            
             <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Publish Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none">
                <option value="Published">Published</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="px-6 py-3 rounded-xl font-bold text-neutral-700 hover:bg-neutral-100 transition-colors">
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Website Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search websites..." className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>
          <button className="p-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 shadow-sm transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusCircle className="w-4 h-4" /> Add Website
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {websites.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">{item.name}</div>
                      <div className="text-xs font-medium text-neutral-500 flex gap-2">
                        {item.liveDemoUrl && <a href={item.liveDemoUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600">Demo</a>}
                        {item.liveWebsiteUrl && <a href={item.liveWebsiteUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600">Live</a>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      item.status === 'Published' ? "bg-emerald-100 text-emerald-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status !== 'Published' && (
                        <button onClick={() => toggleStatus(item.id, 'Published')} title="Publish" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {item.status === 'Published' && (
                        <button onClick={() => toggleStatus(item.id, 'Hidden')} title="Hide" className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><EyeOff className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => openEdit(item)} title="Edit" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} title="Delete" className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {websites.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No websites found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
