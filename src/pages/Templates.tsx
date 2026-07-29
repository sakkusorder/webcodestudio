import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_TEMPLATES = [
  {
    id: 1,
    title: 'E-Commerce Pro',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
    price: '$499',
  },
  {
    id: 2,
    title: 'Agency Minimal',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
    price: '$299',
  },
  {
    id: 3,
    title: 'Restaurant Elite',
    category: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=400',
    price: '$349',
  },
  {
    id: 4,
    title: 'Medical Care',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600&h=400',
    price: '$399',
  }
];

export function Templates() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">{t('templates.title')}</h1>
        <p className="text-lg text-neutral-600">{t('templates.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_TEMPLATES.map(template => (
          <div key={template.id} className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl transition-all duration-300">
            <div className="aspect-[3/2] overflow-hidden relative">
              <img 
                src={template.image} 
                alt={template.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-neutral-900 shadow-sm">
                {template.price}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold tracking-wider uppercase text-indigo-600 mb-2">
                {template.category}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-6">{template.title}</h3>
              <div className="flex items-center gap-3">
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
    </div>
  );
}
