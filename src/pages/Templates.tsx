import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, ShoppingCart, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_TEMPLATES, CATEGORIES } from '../data/templates';
import { useState, useMemo } from 'react';

export function Templates() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return MOCK_TEMPLATES;
    return MOCK_TEMPLATES.filter(template => template.category === activeCategory);
  }, [activeCategory]);

  const clearCategory = () => {
    setActiveCategory(null);
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">{t('templates.title')}</h1>
        <p className="text-lg text-neutral-600 mb-6">{t('templates.subtitle')}</p>
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={clearCategory}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${!activeCategory ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchParams({ category: cat });
              }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {activeCategory && (
         <div className="mb-8 flex items-center justify-between bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
           <div className="font-bold text-indigo-900">
             Showing results for: <span className="text-indigo-600">{activeCategory}</span>
           </div>
           <button onClick={clearCategory} className="text-indigo-500 hover:text-indigo-700">
             <X className="w-5 h-5" />
           </button>
         </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
          <div className="text-neutral-400 mb-4 flex justify-center">
             <ShoppingCart className="w-16 h-16 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">No websites found</h2>
          <p className="text-neutral-500">We don't have any websites in this category yet.</p>
          <button 
            onClick={clearCategory}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            View All Websites
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div key={template.id} className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="aspect-[3/2] overflow-hidden relative">
                <img 
                  src={template.image} 
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-neutral-900 shadow-sm">
                  {template.price ? template.price : `$${template.startingPrice}`}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-semibold tracking-wider uppercase text-indigo-600 mb-2">
                  {template.category}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{template.title}</h3>
                <p className="text-neutral-500 text-sm mb-6 flex-1">{template.shortDescription}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <Link 
                    to={`/templates/${template.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('templates.view_demo')}
                  </Link>
                  <Link
                    to={`/templates/${template.id}`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t('templates.order')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
