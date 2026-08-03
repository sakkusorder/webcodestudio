export interface Template {
  id: string;
  title: string;
  category: string;
  image?: string;
  coverImage: string;
  gallery: string[];
  previewVideo?: string;
  price?: string;
  description: string;
  shortDescription?: string;
  technology: string[];
  features?: string[];
  demoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  deliveryTime: string;
  startingPrice: number;
  offerPrice?: number;
  minAdvancePercentage: number;
  lastUpdated: string;
  status: 'Live' | 'Demo';
  isFeatured?: boolean;
  featured?: boolean;
  isClientProject?: boolean;
  visibility?: 'Public' | 'Hidden';
  displayOrder?: number;
}

export const CATEGORIES = [
  'ড্রপশিপিং ওয়েবসাইট',
  'ই-কমার্স ওয়েবসাইট',
  'নিউজ পোর্টাল',
  'রেস্টুরেন্ট ওয়েবসাইট',
  'হোটেল ও রিসোর্ট ওয়েবসাইট',
  'হাসপাতাল ওয়েবসাইট',
  'ক্লিনিক ওয়েবসাইট',
  'ফার্মেসি ওয়েবসাইট',
  'ডায়াগনস্টিক সেন্টার ওয়েবসাইট',
  'শিক্ষা প্রতিষ্ঠান ওয়েবসাইট',
  'ফুড ডেলিভারি ওয়েবসাইট',
  'ট্রাভেল ও ট্যুরিজম ওয়েবসাইট',
  'গাড়ি ভাড়া ওয়েবসাইট',
  'ব্যবসায়িক ওয়েবসাইট',
  'ব্যক্তিগত পোর্টফোলিও',
  'অনলাইন বুকিং ও অ্যাপয়েন্টমেন্ট',
  'জিম ও ফিটনেস',
  'বিউটি পার্লার ও স্যালন',
  'ব্লগ ও ম্যাগাজিন',
  'কাস্টম ওয়েব অ্যাপ্লিকেশন'
];

export const TECHNOLOGIES = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 
  'Node.js', 'Express', 'PHP', 'Laravel', 'WordPress', 
  'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Tailwind', 'Bootstrap'
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'E-Commerce Pro',
    category: 'ই-কমার্স ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=600',
    gallery: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=600',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&h=600'
    ],
    price: '$499',
    description: 'A complete, high-conversion e-commerce platform designed for modern brands. Includes inventory management, advanced analytics, and multiple payment gateway integrations.',
    shortDescription: 'High-conversion e-commerce platform with inventory and analytics.',
    technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    deliveryTime: '14 - 21 Days',
    startingPrice: 499,
    minAdvancePercentage: 30,
    lastUpdated: 'Aug 12, 2026',
    status: 'Demo',
    isClientProject: false,
    isFeatured: true,
    visibility: 'Public',
    displayOrder: 1,
    demoUrl: 'https://demo.example.com',
    features: ['Admin Dashboard', 'Mobile Friendly', 'Payment Gateway']
  },
  {
    id: '2',
    title: 'Minimalist Portfolio',
    category: 'ব্যক্তিগত পোর্টফোলিও',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600'
    ],
    price: '$299',
    description: 'A clean, minimalist personal portfolio for freelancers and creatives.',
    shortDescription: 'Clean personal portfolio for creatives.',
    technology: ['Next.js', 'Tailwind'],
    deliveryTime: '7 - 10 Days',
    startingPrice: 299,
    minAdvancePercentage: 50,
    lastUpdated: 'Aug 15, 2026',
    status: 'Demo',
    isClientProject: false,
    isFeatured: false,
    visibility: 'Public',
    displayOrder: 2,
    demoUrl: 'https://demo.example.com'
  },
  {
    id: '3',
    title: 'Restaurant Elite',
    category: 'রেস্টুরেন্ট ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=400',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&h=600',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&h=600'
    ],
    price: '$349',
    description: 'Perfect for fine dining restaurants. Includes online table reservations, interactive menus, and delivery integration.',
    shortDescription: 'Fine dining template with reservations and interactive menus.',
    technology: ['React', 'Firebase', 'Tailwind'],
    deliveryTime: '10 - 15 Days',
    startingPrice: 349,
    minAdvancePercentage: 40,
    lastUpdated: 'Sep 02, 2026',
    status: 'Live',
    isFeatured: true,
    isClientProject: true,
    visibility: 'Public',
    displayOrder: 3,
    liveUrl: 'https://example.com'
  },
  {
    id: '4',
    title: 'City Hospital Portal',
    category: 'হাসপাতাল ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600&h=400',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200&h=600',
    gallery: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200&h=600'
    ],
    price: '$899',
    description: 'Comprehensive hospital management and patient portal with appointment booking, doctor profiles, and secure records.',
    shortDescription: 'Patient portal with appointment booking and doctor profiles.',
    technology: ['Next.js', 'Node.js', 'MongoDB'],
    deliveryTime: '21 - 30 Days',
    startingPrice: 899,
    minAdvancePercentage: 30,
    lastUpdated: 'Jul 20, 2026',
    status: 'Demo',
    isClientProject: false,
    isFeatured: false,
    visibility: 'Hidden',
    displayOrder: 4
  }
];
