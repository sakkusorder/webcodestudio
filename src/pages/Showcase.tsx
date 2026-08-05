import { useState, useMemo, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, ShoppingCart, Search, LayoutGrid, List, Filter, Star, CheckCircle2, PlayCircle, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getStoredTemplates, CATEGORIES, TECHNOLOGIES } from '../data/templates';

export function Showcase() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Live' | 'Demo'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = useMemo(() => {
    return getStoredTemplates().filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesTech = selectedTechnology === 'All' || template.technology.includes(selectedTechnology);
      const matchesStatus = selectedStatus === 'All' || template.status === selectedStatus;
      
      // Don't show hidden items in public view
      const isPublic = template.visibility === 'Public';

      return matchesSearch && matchesCategory && matchesTech && matchesStatus && isPublic;
    });
  }, [searchQuery, selectedCategory, selectedTechnology, selectedStatus]);

  return (
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 mb-6 tracking-tight">
              Website Showcase
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600 leading-relaxed">
              Explore our premium collection of ready-to-use website templates and live client projects. Find the perfect foundation for your next digital venture.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0 space-y-8">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search websites..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-600" /> Project Type
              </h3>
              <div className="space-y-2">
                {['All', 'Live', 'Demo'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                      selectedStatus === status ? "bg-indigo-600 border-indigo-600" : "border-neutral-300 group-hover:border-indigo-400"
                    )}>
                      {selectedStatus === status && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={cn(
                      "font-medium transition-colors",
                      selectedStatus === status ? "text-neutral-900" : "text-neutral-600 group-hover:text-neutral-900"
                    )}>{status === 'All' ? 'All Projects' : status === 'Live' ? 'Live Client Sites' : 'Premium Templates'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" /> Categories
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                {['All', ...CATEGORIES].map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                      selectedCategory === category ? "bg-indigo-600 border-indigo-600" : "border-neutral-300 group-hover:border-indigo-400"
                    )}>
                      {selectedCategory === category && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={cn(
                      "font-medium transition-colors",
                      selectedCategory === category ? "text-neutral-900" : "text-neutral-600 group-hover:text-neutral-900"
                    )}>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" /> Technology
              </h3>
              <div className="flex flex-wrap gap-2">
                {['All', ...TECHNOLOGIES].map(tech => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTechnology(tech)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                      selectedTechnology === tech 
                        ? "bg-indigo-600 text-white" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                    )}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="text-neutral-600 font-medium">
                Showing <span className="font-bold text-neutral-900">{filteredTemplates.length}</span> results
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-neutral-200 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-indigo-50 text-indigo-600" : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50")}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 rounded-lg transition-colors", viewMode === 'list' ? "bg-indigo-50 text-indigo-600" : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50")}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 border-dashed">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No websites found</h3>
                <p className="text-neutral-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTechnology('All');
                    setSelectedStatus('All');
                  }}
                  className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="group bg-white rounded-3xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden relative bg-neutral-100">
                      <img 
                        src={template.coverImage} 
                        alt={template.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {template.isFeatured && (
                          <div className="bg-amber-400/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-950 shadow-sm flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" /> Featured
                          </div>
                        )}
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm",
                          template.status === 'Live' ? "bg-emerald-500/90 text-white" : "bg-blue-500/90 text-white"
                        )}>
                          {template.status === 'Live' ? 'Live Project' : 'Template'}
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-black text-neutral-900 shadow-sm border border-white/20">
                        ${template.startingPrice}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs font-bold tracking-wider uppercase text-indigo-600 mb-2">
                        {template.category}
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
                      <p className="text-sm text-neutral-500 mb-6 line-clamp-2 leading-relaxed flex-1">
                        {template.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {template.technology.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">
                            {tech}
                          </span>
                        ))}
                        {template.technology.length > 3 && (
                          <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">
                            +{template.technology.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-6 border-t border-neutral-100 mt-auto">
                        <Link 
                          to={`/showcase/${template.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2.5 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Details
                        </Link>
                        <Link
                          to={`/showcase/${template.id}`} 
                          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Order
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="group bg-white rounded-3xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col md:flex-row">
                    <div className="w-full md:w-64 aspect-[16/10] md:aspect-auto md:h-full relative overflow-hidden bg-neutral-100 shrink-0">
                      <img 
                        src={template.coverImage} 
                        alt={template.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {template.isFeatured && (
                          <div className="bg-amber-400/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-950 shadow-sm flex items-center gap-1 uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs font-bold tracking-wider uppercase text-indigo-600 mb-1">
                            {template.category}
                          </div>
                          <h3 className="text-2xl font-black text-neutral-900 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
                        </div>
                        <div className="text-2xl font-black text-neutral-900 bg-neutral-50 px-4 py-2 rounded-2xl">
                          ${template.startingPrice}
                        </div>
                      </div>
                      
                      <p className="text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            template.status === 'Live' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {template.status === 'Live' ? 'Live Project' : 'Template'}
                          </div>
                          {template.technology.slice(0, 4).map((tech, i) => (
                            <span key={i} className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                          <Link 
                            to={`/showcase/${template.id}`}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 px-6 py-2.5 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Details
                          </Link>
                          <Link
                            to={`/showcase/${template.id}`} 
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Order
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
