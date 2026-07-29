import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, ShoppingCart, Code2, Presentation, Settings, Zap, ArrowLeft, Briefcase, Store, Laptop, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MOCK_CATEGORIES = [
  { id: 1, name: 'E-commerce', icon: <ShoppingCart />, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' },
  { id: 2, name: 'Corporate', icon: <Briefcase />, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  { id: 3, name: 'Portfolio', icon: <Presentation />, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  { id: 4, name: 'Restaurant', icon: <Store />, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
  { id: 5, name: 'Blog', icon: <Laptop />, image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80' },
  { id: 6, name: 'Healthcare', icon: <Activity />, image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80' },
];

export function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000",
      titleKey: 'slider.1.title',
      btnKey: 'slider.1.btn',
      icon: <Laptop className="w-12 h-12 text-white/90" />
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
      titleKey: 'slider.2.title',
      btnKey: 'slider.2.btn',
      icon: <Code2 className="w-12 h-12 text-white/90" />
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000",
      titleKey: 'slider.3.title',
      btnKey: 'slider.3.btn',
      icon: <Store className="w-12 h-12 text-white/90" />
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
      titleKey: 'slider.4.title',
      btnKey: 'slider.4.btn',
      icon: <Briefcase className="w-12 h-12 text-white/90" />
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",
      titleKey: 'slider.5.title',
      btnKey: 'slider.5.btn',
      icon: <Settings className="w-12 h-12 text-white/90" />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="w-full bg-neutral-50 pb-20">
      {/* Hero Slider */}
      <div className="relative w-full h-[600px] overflow-hidden bg-neutral-900">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src={slide.image} 
              alt="" 
              className="w-full h-full object-cover object-center scale-105 transform transition-transform duration-[10000ms] ease-out"
              style={{ transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)' }}
            />
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <div className="mb-6 transform transition-all duration-700 translate-y-0 opacity-100 drop-shadow-lg">
                {slide.icon}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8 max-w-4xl drop-shadow-xl leading-tight">
                {t(slide.titleKey)}
              </h1>
              <Link 
                to="/templates" 
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] transform hover:-translate-y-1"
              >
                {t(slide.btnKey)}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute z-30 bottom-8 left-0 right-0 flex justify-center items-center gap-4">
          <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-indigo-500 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Custom Website Quick Button (Premium Card) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-40">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white to-indigo-50/50">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4">
              <Zap className="w-4 h-4" />
              Premium Service
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4">{t('custom.title')}</h2>
            <p className="text-lg text-neutral-600 max-w-2xl">{t('custom.desc')}</p>
          </div>
          <div className="flex-shrink-0">
            <Link 
              to="/custom-project" 
              className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg w-full md:w-auto text-lg"
            >
              <Code2 className="w-6 h-6" />
              {t('custom.btn')}
            </Link>
          </div>
        </div>
      </div>

      {/* Website Categories (Horizontal Scroll) */}
      <div className="mt-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">{t('categories.title')}</h2>
          <div className="flex gap-2 hidden sm:flex">
            <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {MOCK_CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              className="snap-start flex-shrink-0 w-[280px] group cursor-pointer"
            >
              <div className="relative h-[360px] rounded-3xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 border border-white/30 shadow-lg">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-indigo-300 font-medium text-sm mt-2">
                    Explore Templates <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
