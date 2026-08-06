import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, Eye, EyeOff, Tag, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CategoryInfo, getStoredCategories } from '../../data/templates';
import { useLanguage } from '../../contexts/LanguageContext';

export function Categories() {
  const { t } = useLanguage();
  const [categories, setCategoriesState] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    setCategoriesState(getStoredCategories());
  }, []);

  const setCategories = (newCategories: CategoryInfo[] | ((prev: CategoryInfo[]) => CategoryInfo[])) => {
    setCategoriesState((prev) => {
      const updated = typeof newCategories === 'function' ? newCategories(prev) : newCategories;
      localStorage.setItem('wcs_categories', JSON.stringify(updated));
      return updated;
    });
  };

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<CategoryInfo>>({
    name: '',
    description: '',
    icon: '',
    status: 'Active'
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } as CategoryInfo : c));
    } else {
      const newCategory: CategoryInfo = {
        id: `cat-${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        icon: formData.icon || '',
        status: formData.status as 'Active' | 'Inactive'
      };
      setCategories([newCategory, ...categories]);
    }
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (category: CategoryInfo) => {
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      status: category.status
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdding) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-neutral-500 font-medium mt-1">Manage website categories</p>
          </div>
          <button 
            onClick={() => { setIsAdding(false); setEditingId(null); }}
            className="px-4 py-2 text-neutral-600 bg-white border border-neutral-200 rounded-xl font-bold hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm shadow-neutral-200/50">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-900">Category Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                placeholder="e.g. E-Commerce"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-900">Thumbnail / Icon URL (Optional)</label>
              <input 
                type="text" 
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-900">Description (Optional)</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium resize-none"
                placeholder="Description of the category..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-900">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all">
              {editingId ? 'Save Changes' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{t('admin.website_categories')}</h2>
          <p className="text-neutral-500 font-medium mt-1">Manage website categories</p>
        </div>
        <button 
          onClick={() => { 
            setFormData({ name: '', description: '', icon: '', status: 'Active' });
            setIsAdding(true); 
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm shadow-neutral-200/50">
        <div className="mb-6 max-w-sm relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 font-bold text-neutral-400 text-sm">Category Info</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm">Status</th>
                <th className="pb-4 font-bold text-neutral-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCategories.map(category => (
                <tr key={category.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      {category.icon ? (
                        <img src={category.icon} alt={category.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                          <Tag className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-neutral-900">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-neutral-500 max-w-md truncate">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      category.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-600"
                    )}>
                      {category.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(category.id)}
                        title={category.status === 'Active' ? 'Hide' : 'Show'}
                        className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        {category.status === 'Active' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-neutral-500 font-medium">
                    No categories found.
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
