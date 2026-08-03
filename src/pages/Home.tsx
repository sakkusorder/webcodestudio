import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowRight, Code2, Settings, Zap, ArrowLeft, Laptop, 
  ShoppingCart, Store, Newspaper, Building2, Building, Stethoscope,
  Pill, Activity, GraduationCap, Truck, Plane, Car, Briefcase,
  User, CalendarCheck, Dumbbell, Scissors, FileText, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DYNAMIC_CATEGORIES = [
  { id: 'dropshipping', name: 'ড্রপশিপিং ওয়েবসাইট', icon: <ShoppingCart />, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' },
  { id: 'ecommerce', name: 'ই-কমার্স ওয়েবসাইট', icon: <Store />, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80' },
  { id: 'news', name: 'নিউজ পোর্টাল', icon: <Newspaper />, image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=80' },
  { id: 'restaurant', name: 'রেস্টুরেন্ট ওয়েবসাইট', icon: <Store />, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
  { id: 'hotel', name: 'হোটেল ও রিসোর্ট ওয়েবসাইট', icon: <Building2 />, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' },
  { id: 'hospital', name: 'হাসপাতাল ওয়েবসাইট', icon: <Building />, image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&q=80' },
  { id: 'clinic', name: 'ক্লিনিক ওয়েবসাইট', icon: <Stethoscope />, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80' },
  { id: 'pharmacy', name: 'ফার্মেসি ওয়েবসাইট', icon: <Pill />, image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a42b10?w=400&q=80' },
  { id: 'diagnostic', name: 'ডায়াগনস্টিক সেন্টার ওয়েবসাইট', icon: <Activity />, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80' },
  { id: 'education', name: 'শিক্ষা প্রতিষ্ঠান ওয়েবসাইট', icon: <GraduationCap />, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' },
  { id: 'food', name: 'ফুড ডেলিভারি ওয়েবসাইট', icon: <Truck />, image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&q=80' },
  { id: 'travel', name: 'ট্রাভেল ও ট্যুরিজম ওয়েবসাইট', icon: <Plane />, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
  { id: 'car', name: 'গাড়ি ভাড়া ওয়েবসাইট', icon: <Car />, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80' },
  { id: 'business', name: 'ব্যবসায়িক ওয়েবসাইট', icon: <Briefcase />, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  { id: 'portfolio', name: 'ব্যক্তিগত পোর্টফোলিও', icon: <User />, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  { id: 'booking', name: 'অনলাইন বুকিং ও অ্যাপয়েন্টমেন্ট', icon: <CalendarCheck />, image: 'https://images.unsplash.com/photo-1506784951206-3971c890787e?w=400&q=80' },
  { id: 'gym', name: 'জিম ও ফিটনেস', icon: <Dumbbell />, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'beauty', name: 'বিউটি পার্লার ও স্যালন', icon: <Scissors />, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80' },
  { id: 'blog', name: 'ব্লগ ও ম্যাগাজিন', icon: <FileText />, image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80' },
  { id: 'custom', name: 'কাস্টম ওয়েব অ্যাপ্লিকেশন', icon: <Code2 />, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
];

export function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  const scrollToCategories = () => {
    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
              <button 
                onClick={scrollToCategories}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] transform hover:-translate-y-1"
              >
                সকল ক্যাটাগরি দেখুন
                <ArrowRight className="w-5 h-5" />
              </button>
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

      {/* Website Categories (Grid Layout) */}
      <div id="categories-section" className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 leading-tight">
            আপনি কোন ধরনের ব্যবসার জন্য<br className="hidden sm:block" /> ওয়েবসাইট খুঁজছেন?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            নিচের ক্যাটাগরি থেকে আপনার পছন্দের ওয়েবসাইট নির্বাচন করুন।
          </p>
        </div>

        <div className="mb-8 border-b border-neutral-200 pb-4">
          <h3 className="text-2xl font-bold text-neutral-900">সকল ক্যাটাগরি</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-20">
          {DYNAMIC_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/templates?category=${encodeURIComponent(category.name)}`)}
              className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-neutral-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300 shadow-sm">
                {category.icon}
              </div>
              <span className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
