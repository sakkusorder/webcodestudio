import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, ShoppingCart, Code2, MessageCircle, Mail, HeadphonesIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_TEMPLATES } from '../data/templates';
import { useMemo } from 'react';

export function Templates() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const activeCategory = categoryParam;

  const filteredTemplates = useMemo(() => {
    if (!activeCategory) return MOCK_TEMPLATES;
    return MOCK_TEMPLATES.filter(template => template.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          {activeCategory ? activeCategory : t('templates.title')}
        </h1>
        <p className="text-lg text-neutral-600 mb-6">
          {activeCategory 
            ? `Explore our collection of ${activeCategory} templates` 
            : t('templates.subtitle')}
        </p>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-neutral-100 shadow-sm mt-8">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
             <Code2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4 leading-snug">
            🚀 আমরা এখনও এই ধরনের ওয়েবসাইট তৈরি করার সুযোগ পাইনি।
          </h2>
          <p className="text-lg text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            আপনি যদি এই ধরনের একটি ওয়েবসাইট তৈরি করতে চান, তাহলে আমাদের সাথে যোগাযোগ করুন। আমরা আপনার চাহিদা অনুযায়ী সম্পূর্ণ কাস্টম ওয়েবসাইট তৈরি করে দিতে প্রস্তুত।
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all hover:-translate-y-1 shadow-sm">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a href="mailto:support@webcodestudio.com" className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-4 py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all hover:-translate-y-1 shadow-sm">
              <Mail className="w-5 h-5" />
              Email
            </a>
            <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-sm">
              <HeadphonesIcon className="w-5 h-5" />
              Support
            </button>
          </div>
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
