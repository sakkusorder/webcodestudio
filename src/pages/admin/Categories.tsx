import React, { useState } from 'react';
import { PlusCircle, Search, Filter, Edit, Trash2, Tag, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  coverImage: string | null;
  status: 'Active' | 'Hidden';
  count: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'E-commerce', description: 'Online stores and shopping platforms', icon: null, coverImage: null, status: 'Active', count: 42 },
  { id: '2', name: 'Corporate', description: 'Business and corporate websites', icon: null, coverImage: null, status: 'Active', count: 28 },
];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' as 'Active' | 'Hidden' });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData, icon: iconPreview, coverImage: coverPreview } : c));
      setEditingId(null);
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        icon: iconPreview,
        coverImage: coverPreview,
        count: 0
      };
      setCategories([newCat, ...categories]);
    }
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'Active' });
    setIconPreview(null);
    setCoverPreview(null);
  };

  const openEdit = (cat: Category) => {
    setFormData({ name: cat.name, description: cat.description, status: cat.status });
    setIconPreview(cat.icon);
    setCoverPreview(cat.coverImage);
    setEditingId(cat.id);
  };

  if (isAdding || editingId) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{editingId ? 'Edit Category' : 'Create Category'}</h2>
          <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="text-neutral-500 hover:text-neutral-900 font-bold">Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Category Icon</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-indigo-300 transition-colors overflow-hidden">
                {iconPreview ? (
                  <img src={iconPreview} alt="Icon" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-neutral-500">
                    <UploadCloud className="w-6 h-6 mb-2 text-indigo-500" />
                    <p className="text-xs font-medium">Upload Icon</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setIconPreview)} />
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Cover Image</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-indigo-300 transition-colors overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-neutral-500">
                    <ImageIcon className="w-6 h-6 mb-2 text-indigo-500" />
                    <p className="text-xs font-medium">Upload Cover</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setCoverPreview)} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Category Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" />
          </div>
           <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all">
              <option value="Active">Active</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors w-full sm:w-auto">
              {editingId ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Categories</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="Search categories..." className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusCircle className="w-4 h-4" /> Create Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col hover:border-indigo-300 transition-colors group overflow-hidden">
            {category.coverImage ? (
              <div className="h-32 w-full bg-neutral-100">
                <img src={category.coverImage} className="w-full h-full object-cover" alt="" />
              </div>
            ) : (
              <div className="h-32 w-full bg-indigo-50 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-indigo-200" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4 -mt-10">
                <div className="w-16 h-16 bg-white shadow-sm border border-neutral-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                  {category.icon ? <img src={category.icon} className="w-10 h-10 object-contain" alt="" /> : <Tag className="w-8 h-8 text-indigo-400" />}
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white shadow-sm",
                  category.status === 'Active' ? "text-emerald-600" : "text-neutral-500"
                )}>
                  {category.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-neutral-900 mb-1">{category.name}</h3>
              <p className="text-sm font-medium text-neutral-500 line-clamp-2 flex-1">{category.description}</p>
              
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="text-sm font-bold text-neutral-900">{category.count} Websites</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(category)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(category.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
