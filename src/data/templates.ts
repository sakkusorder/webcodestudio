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

export const MOCK_TEMPLATES: Template[] = [];
