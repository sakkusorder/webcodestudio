import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, LayoutTemplate, Star, TrendingUp, Clock, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Homepage() {
  const [activeTab, setActiveTab] = useState<'banners'|'featured'|'popular'|'latest'>('banners');

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Homepage Management</h2>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        <button onClick={() => setActiveTab('banners')} className={cn("px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'banners' ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50")}>
          <ImageIcon className="w-4 h-4" /> Banners & Sliders
        </button>
        <button onClick={() => setActiveTab('featured')} className={cn("px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'featured' ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50")}>
          <Star className="w-4 h-4" /> Featured Websites
        </button>
        <button onClick={() => setActiveTab('popular')} className={cn("px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'popular' ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50")}>
          <TrendingUp className="w-4 h-4" /> Popular Websites
        </button>
        <button onClick={() => setActiveTab('latest')} className={cn("px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'latest' ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50")}>
          <Clock className="w-4 h-4" /> Latest Websites
        </button>
      </div>

      {activeTab === 'banners' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900">Manage Banners</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
              <PlusCircle className="w-4 h-4" /> Add Banner
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="border border-neutral-200 rounded-2xl overflow-hidden group">
                <div className="h-40 bg-neutral-100 relative">
                  <img src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=300`} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white text-neutral-900 rounded-lg hover:bg-indigo-50 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-neutral-900 mb-1">Summer Sale Banner</div>
                  <div className="text-sm text-neutral-500 truncate">Link: /categories/ecommerce</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'featured' || activeTab === 'popular' || activeTab === 'latest') && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 capitalize">{activeTab} Websites</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
              <PlusCircle className="w-4 h-4" /> Select Websites
            </button>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=100&h=100`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Website Name {i}</div>
                    <div className="text-xs font-medium text-neutral-500">E-commerce • $299</div>
                  </div>
                </div>
                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
