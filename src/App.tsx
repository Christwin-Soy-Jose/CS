import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Smartphone, 
  Palette, 
  Layers, 
  ShoppingBag, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  Filter,
  CloudSun,
  Globe,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Play,
  SmartphoneIcon,
  Maximize2,
  Shirt,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// --- Types & Constants ---

const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Workflow', href: '#workflow' },
  { name: 'Pricing', href: '#pricing' },
];

// --- Components ---

import { ColorBlindTest } from './components/ColorBlindTest';
import { AROutfitRecommender } from './components/AROutfitRecommender';
import { Wardrobe } from './components/Wardrobe';

const MagneticButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 ${className}`}>
    {children}
  </span>
);

const ColorHarmonyTool = () => {
  const [selectedColor, setSelectedColor] = useState('#0A0A0B');
  const palette = [
    { name: 'Deep Black', hex: '#0A0A0B' },
    { name: 'Electric Blue', hex: '#00D1FF' },
    { name: 'Bright Orange', hex: '#FF3D00' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Dark Gray', hex: '#1A1A1E' },
    { name: 'Neon Purple', hex: '#8B5CF6' },
  ];

  return (
    <div className="glass-card rounded-3xl p-10 shadow-2xl shine-effect">
      <h3 className="text-2xl font-display font-bold text-brand-primary dark:text-white mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center">
          <Palette className="w-5 h-5 text-brand-secondary" />
        </div>
        Harmony Explorer
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-5 mb-10">
        {palette.map((color) => (
          <button
            key={color.hex}
            onClick={() => setSelectedColor(color.hex)}
            className={`group relative aspect-square rounded-2xl transition-all duration-500 ${
              selectedColor === color.hex ? 'ring-4 ring-brand-secondary ring-offset-4 dark:ring-offset-bg-dark scale-110 shadow-lg shadow-brand-secondary/20' : 'hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 className={`w-6 h-6 ${color.hex === '#FFFFFF' ? 'text-brand-primary' : 'text-white'}`} />
            </span>
          </button>
        ))}
      </div>
      <div className="p-8 rounded-2xl bg-stone-50/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Selected Palette</span>
          <span className="text-xs font-mono font-bold text-brand-secondary px-3 py-1 bg-brand-secondary/10 rounded-full">{selectedColor}</span>
        </div>
        <div className="flex gap-6 items-center">
          <motion.div 
            key={selectedColor}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-2xl shadow-2xl" 
            style={{ backgroundColor: selectedColor }} 
          />
          <div>
            <div className="text-base font-bold text-brand-primary dark:text-white mb-2">Style Intelligence</div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-light">
              This tone pairs exceptionally with <span className="text-brand-secondary font-bold">Electric Blue</span> for a modern, high-tech aesthetic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisionSimulator = () => {
  const [visionType, setVisionType] = useState('normal');
  const types = [
    { id: 'normal', name: 'Normal', filter: 'none' },
    { id: 'protanopia', name: 'Protanopia', filter: 'contrast(1.1) brightness(1.1) hue-rotate(-15deg) saturate(0.8)' },
    { id: 'deuteranopia', name: 'Deuteranopia', filter: 'contrast(1.1) brightness(1.1) hue-rotate(10deg) saturate(0.8)' },
    { id: 'tritanopia', name: 'Tritanopia', filter: 'contrast(1.1) brightness(1.1) hue-rotate(180deg) saturate(0.8)' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-primary dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-secondary" />
          Vision Simulator
        </h3>
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setVisionType(t.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                visionType === t.id 
                  ? 'bg-brand-secondary text-white shadow-md' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800">
        <motion.img 
          key={visionType}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1, filter: types.find(t => t.id === visionType)?.filter }}
          src="https://picsum.photos/seed/fashion-vision/800/450" 
          alt="Vision Simulation"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {types.find(t => t.id === visionType)?.name} View
        </div>
      </div>
      <p className="mt-4 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
        Experience how different color vision deficiencies perceive fashion choices. Our AI accounts for these variations to provide truly accessible advice.
      </p>
    </div>
  );
};

const Navbar = ({ isDark, toggleTheme, onShowWardrobe, onShowAIAssistant }: { 
  isDark: boolean; 
  toggleTheme: () => void;
  onShowWardrobe: () => void;
  onShowAIAssistant: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex justify-between items-center px-8 py-4 rounded-2xl transition-all duration-500 ${scrolled ? 'glass shadow-2xl border-white/10' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-brand-secondary rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-brand-secondary/30">
              <Palette className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter text-brand-primary dark:text-white">COLOR<span className="text-brand-secondary">SMART</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary/60 dark:text-stone-400 hover:text-brand-secondary dark:hover:text-brand-secondary transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all group-hover:w-full" />
              </a>
            ))}
            <div className="h-5 w-px bg-stone-200 dark:bg-white/10 mx-2" />
            <button 
              onClick={onShowWardrobe}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent/20 to-brand-secondary/20 text-brand-secondary rounded-xl text-[11px] font-bold uppercase tracking-wider hover:from-brand-accent/30 hover:to-brand-secondary/30 transition-all border border-brand-secondary/30"
            >
              <Shirt className="w-4 h-4" />
              Wardrobe
            </button>
            <button 
              onClick={onShowAIAssistant}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-brand-accent/20 text-brand-accent rounded-xl text-[11px] font-bold uppercase tracking-wider hover:from-purple-500/30 hover:to-brand-accent/30 transition-all border border-brand-accent/30"
            >
              <Bot className="w-4 h-4" />
              AI Assistant
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5 transition-all active:scale-90"
            >
              {isDark ? <Sun className="w-4 h-4 text-stone-400" /> : <Moon className="w-4 h-4 text-brand-secondary" />}
            </button>
            <MagneticButton>
              <button className="bg-brand-primary dark:bg-brand-secondary text-white px-7 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20 dark:shadow-brand-secondary/20 shine-effect">
                Sign In
              </button>
            </MagneticButton>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full p-6 md:hidden"
          >
            <div className="glass-card rounded-3xl p-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-brand-primary dark:text-white"
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-brand-primary dark:bg-white text-white dark:text-brand-primary w-full py-3.5 rounded-lg font-bold">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay, className = "" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className={`p-10 rounded-[2rem] glass-card group shine-effect ${className}`}
  >
    <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-secondary group-hover:text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
      <Icon className="w-6 h-6 text-brand-secondary group-hover:text-white" />
    </div>
    <h3 className="text-2xl font-display font-bold mb-4 tracking-tight text-brand-primary dark:text-white">{title}</h3>
    <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed font-light">
      {description}
    </p>
  </motion.div>
);

const PricingCard = ({ title, price, features, isPopular }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={`p-12 rounded-[2.5rem] relative flex flex-col h-full transition-all duration-500 shine-effect ${
      isPopular 
        ? 'bg-brand-primary text-white shadow-[0_20px_50px_rgba(0,209,255,0.15)] scale-105 z-10 border border-brand-secondary/30' 
        : 'glass-card text-brand-primary dark:text-white shadow-xl'
    }`}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-secondary text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand-secondary/20">
        Most Popular
      </div>
    )}
    <div className="mb-12">
      <h3 className={`text-[11px] font-bold uppercase tracking-[0.3em] mb-4 ${isPopular ? 'text-brand-secondary' : 'text-stone-500'}`}>{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-5xl font-display font-extrabold ${isPopular ? 'text-white' : 'text-brand-primary dark:text-white'}`}>₹{price}</span>
        <span className={`text-sm font-medium opacity-60`}>/mo</span>
      </div>
    </div>
    <div className="space-y-5 mb-12 flex-grow">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-start gap-4">
          <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPopular ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-stone-100 dark:bg-white/5 text-brand-secondary'}`}>
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <span className="text-sm font-light leading-tight opacity-90">{f}</span>
        </div>
      ))}
    </div>
    <MagneticButton>
      <button className={`w-full py-5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
        isPopular 
          ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 hover:bg-brand-secondary/90' 
          : 'bg-brand-primary dark:bg-white text-white dark:text-brand-primary hover:opacity-90'
      }`}>
        Choose {title}
      </button>
    </MagneticButton>
  </motion.div>
);

const ShoppingSection = ({ visionType, onShowARRecommender, onAddToBag }: { 
  visionType: string | null;
  onShowARRecommender: () => void;
  onAddToBag: (productId: number) => void;
}) => {
  type VisionProfile = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'other';

  const simplifiedVision: VisionProfile = React.useMemo(() => {
    if (!visionType) return 'other';
    const lower = visionType.toLowerCase();
    if (lower.includes('protan')) return 'protanopia';
    if (lower.includes('deuter')) return 'deuteranopia';
    if (lower.includes('tritan')) return 'tritanopia';
    if (lower.includes('normal')) return 'normal';
    return 'other';
  }, [visionType]);

  interface Product {
    id: number;
    name: string;
    description: string;
    hex: string;
    image: string;
    category: 'clothes';
    recommendedFor: Exclude<VisionProfile, 'other'>[];
  }

  const products: Product[] = [
    {
      id: 1,
      name: 'ContrastSafe Denim Jacket',
      description: 'High-contrast seams and buttons that stay visible for red–green profiles.',
      hex: '#1E3A8A',
      image: 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800', // denim jacket on hanger
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia'],
    },
    {
      id: 2,
      name: 'SignalStripe Tee',
      description: 'Bold striping pattern using luminance contrast instead of subtle hue shifts.',
      hex: '#F97316',
      image: 'https://images.pexels.com/photos/6311654/pexels-photo-6311654.jpeg?auto=compress&cs=tinysrgb&w=800', // striped t‑shirt and pants
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 3,
      name: 'Monochrome Essentials Pack',
      description: 'Curated neutrals that always coordinate, no matter your color perception.',
      hex: '#0F172A',
      image: 'https://images.pexels.com/photos/3738084/pexels-photo-3738084.jpeg?auto=compress&cs=tinysrgb&w=800', // folded neutral clothes stack
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 4,
      name: 'High-Definition Parka',
      description: 'Bold color blocking and reflective piping to stand out in low light.',
      hex: '#EA580C',
      image: 'https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=800', // bright parka on model
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia'],
    },
    {
      id: 5,
      name: 'Signal Trail Sneakers',
      description: 'Heel and toe accents tuned for clearer hue separation in red–green profiles.',
      hex: '#4F46E5',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', // running sneakers
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'normal'],
    },
    {
      id: 6,
      name: 'Skyline Hoodie',
      description: 'Cool-toned gradients chosen to remain distinct for tritanopia.',
      hex: '#0EA5E9',
      image: 'https://images.pexels.com/photos/7671164/pexels-photo-7671164.jpeg?auto=compress&cs=tinysrgb&w=800', // blue hoodie on person
      category: 'clothes',
      recommendedFor: ['tritanopia', 'normal'],
    },
    {
      id: 7,
      name: 'Monochrome Street Set',
      description: 'Pure luminance contrast for days when you don’t want to think about color at all.',
      hex: '#020617',
      image: 'https://images.pexels.com/photos/7671170/pexels-photo-7671170.jpeg?auto=compress&cs=tinysrgb&w=800', // black streetwear outfit
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 8,
      name: 'Citrus Accent Shirt',
      description: 'Blue–yellow emphasis that stays punchy for red–green deficiencies.',
      hex: '#F59E0B',
      image: 'https://images.pexels.com/photos/7671109/pexels-photo-7671109.jpeg?auto=compress&cs=tinysrgb&w=800', // yellow shirt on hanger
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia'],
    },
    {
      id: 10,
      name: 'Contrast Panel Joggers',
      description: 'Color-block panels that read clearly in motion for all profiles.',
      hex: '#111827',
      image: 'https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=800', // joggers on model
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 11,
      name: 'Aurora Windbreaker',
      description: 'Vertical bands tuned separately for red–green and blue–yellow deficiencies.',
      hex: '#22C55E',
      image: 'https://images.pexels.com/photos/6311577/pexels-photo-6311577.jpeg?auto=compress&cs=tinysrgb&w=800', // color-block windbreaker
      category: 'clothes',
      recommendedFor: ['protanopia', 'tritanopia'],
    },
    {
      id: 12,
      name: 'Signal Beanie',
      description: 'Crisp ribbing and a bright cuff so edges stand out even on cloudy days.',
      hex: '#DC2626',
      image: 'https://images.pexels.com/photos/7671241/pexels-photo-7671241.jpeg?auto=compress&cs=tinysrgb&w=800', // close-up of knit beanie
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia'],
    },
    {
      id: 14,
      name: 'Studio Lounge Set',
      description: 'Soft gradients balanced by bold cuffs for extra figure/ground separation.',
      hex: '#6366F1',
      image: 'https://images.pexels.com/photos/7671163/pexels-photo-7671163.jpeg?auto=compress&cs=tinysrgb&w=800', // matching lounge set
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia'],
    },
    {
      id: 15,
      name: 'Everyday Contrast Tee',
      description: 'Our baseline tee that passes WCAG contrast checks across vision types.',
      hex: '#0F172A',
      image: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800', // basic t‑shirt on hanger
      category: 'clothes',
      recommendedFor: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
    },
    {
      id: 16,
      name: 'Ocean Depths Sweater',
      description: 'Chunky knit in deep teal with light cuffs for clear edge definition.',
      hex: '#0f766e',
      image: 'https://images.pexels.com/photos/6311574/pexels-photo-6311574.jpeg?auto=compress&cs=tinysrgb&w=800', // teal sweater
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'normal'],
    },
    {
      id: 17,
      name: 'Sunrise Layered Shirt',
      description: 'Layered shirt with warm accents that pop for red–green profiles.',
      hex: '#ea580c',
      image: 'https://images.pexels.com/photos/6311567/pexels-photo-6311567.jpeg?auto=compress&cs=tinysrgb&w=800', // layered shirt
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia'],
    },
    {
      id: 18,
      name: 'Glacier Puffer Jacket',
      description: 'High-contrast puffer with bright zips to remain visible in snow and fog.',
      hex: '#38bdf8',
      image: 'https://images.pexels.com/photos/6311580/pexels-photo-6311580.jpeg?auto=compress&cs=tinysrgb&w=800', // puffer jacket
      category: 'clothes',
      recommendedFor: ['tritanopia', 'normal'],
    },
    {
      id: 19,
      name: 'Metro Chinos',
      description: 'Slim chinos with a strong value split against common shoe colors.',
      hex: '#92400e',
      image: 'https://images.pexels.com/photos/6311581/pexels-photo-6311581.jpeg?auto=compress&cs=tinysrgb&w=800', // chinos
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'normal'],
    },
    {
      id: 20,
      name: 'Aurora Gradient Tee',
      description: 'Soft gradient tee tuned separately for each deficiency profile in enhanced view.',
      hex: '#4f46e5',
      image: 'https://images.pexels.com/photos/6311565/pexels-photo-6311565.jpeg?auto=compress&cs=tinysrgb&w=800', // gradient tee
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 21,
      name: 'Urban Cargo Pants',
      description: 'Multi-pocket design with high-contrast stitching for maximum visibility.',
      hex: '#374151',
      image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'normal'],
    },
    {
      id: 22,
      name: 'Neon Sport Tank',
      description: 'Bright athletic tank with high-visibility accents for active lifestyles.',
      hex: '#10B981',
      image: 'https://images.pexels.com/photos/5386754/pexels-photo-5386754.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
    {
      id: 23,
      name: 'Classic Oxford Shirt',
      description: 'Timeless button-down with enhanced contrast patterns for professional settings.',
      hex: '#1F2937',
      image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'normal'],
    },
    {
      id: 24,
      name: 'Alpine Fleece Jacket',
      description: 'Cozy fleece with bold color blocking for outdoor adventures in any light.',
      hex: '#DC2626',
      image: 'https://images.pexels.com/photos/1472940/pexels-photo-1472940.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clothes',
      recommendedFor: ['tritanopia', 'normal'],
    },
    {
      id: 25,
      name: 'Striped Polo Shirt',
      description: 'Classic polo with high-contrast stripes that work across all vision profiles.',
      hex: '#2563EB',
      image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clothes',
      recommendedFor: ['protanopia', 'deuteranopia', 'tritanopia', 'normal'],
    },
  ];

  const highlightedProducts = products
    .filter((p) =>
      simplifiedVision === 'other'
        ? true
        : p.recommendedFor.includes(simplifiedVision as Exclude<VisionProfile, 'other'>),
    )
    .map((p) => ({
      ...p,
      isRecommended:
        simplifiedVision === 'other'
          ? false
          : p.recommendedFor.includes(simplifiedVision as Exclude<VisionProfile, 'other'>),
    }));

  const enhancementFilter = React.useMemo(() => {
    switch (simplifiedVision) {
      case 'protanopia':
        return 'saturate(1.6) hue-rotate(-15deg) contrast(1.2)';
      case 'deuteranopia':
        return 'saturate(1.5) hue-rotate(18deg) contrast(1.18)';
      case 'tritanopia':
        return 'saturate(1.7) hue-rotate(90deg) contrast(1.12)';
      case 'normal':
        return 'none';
      default:
        return 'saturate(1.4) contrast(1.1)';
    }
  }, [simplifiedVision]);

  return (
    <section
      id="shop"
      className="relative py-24 md:py-32 bg-white/60 dark:bg-bg-dark/80 border-t border-stone-100/70 dark:border-stone-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between gap-6 mb-12">
          <div>
            <Badge className="mb-4 bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary">
              Vision-Aware Shopping
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-primary dark:text-white mb-4">
              Shop for your vision profile
            </h2>
            <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-xl">
              Based on your Ishihara result, we recommend clothing with strong luminance contrast and smart color
              pairings. Each piece shows its original photo and, for color vision deficiencies, an enhanced view tuned
              to that specific profile.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              <Eye className="w-4 h-4 text-brand-secondary" />
              {visionType ? 'Active Vision Profile' : 'Take the test to personalize'}
            </div>
            <div className="text-sm font-bold text-brand-primary dark:text-white">
              {visionType ?? 'No profile selected yet'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-brand-primary dark:text-white">
                Clothes
              </h3>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400">
                Outfits with clear edges, strong contrast, and reliable pairings for your vision profile.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400">
                <ShoppingBag className="w-3 h-3" />
                <span>{highlightedProducts.length} curated picks</span>
              </div>
              <MagneticButton>
                <button 
                  onClick={onShowARRecommender}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-secondary to-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-brand-secondary/20"
                >
                  <Camera className="w-4 h-4" />
                  AR Outfit Recommender
                </button>
              </MagneticButton>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlightedProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                className="glass-card rounded-3xl overflow-hidden p-5 flex flex-col gap-6"
                data-product-card
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl border border-black/5 dark:border-white/10 shadow-sm"
                      style={{ backgroundColor: product.hex }}
                    />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                        HEX {product.hex}
                      </div>
                      <h4 className="text-base font-bold text-brand-primary dark:text-white">
                        {product.name}
                      </h4>
                    </div>
                  </div>
                  {product.isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 text-[10px] font-semibold uppercase tracking-[0.18em]">
                      <CheckCircle2 className="w-3 h-3" />
                      Recommended
                    </span>
                  )}
                </div>

                <div
                  className={`grid gap-3 ${
                    simplifiedVision === 'normal' ? 'grid-cols-1' : 'grid-cols-2'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                      <span>Actual</span>
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const card = e.currentTarget.closest('[data-product-card]');
                          if (card) {
                            const status = card.querySelector('[data-stock-status]');
                            if (status) {
                              status.textContent = 'Out of stock';
                            }
                          }
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {simplifiedVision !== 'normal' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                        <span>Enhanced</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-brand-secondary">
                          <Sparkles className="w-3 h-3" />
                          Profile Tuned
                        </span>
                      </div>
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60">
                        <img
                          src={product.image}
                          alt={`${product.name} enhanced`}
                          className="w-full h-full object-cover"
                          style={{ filter: enhancementFilter }}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const card = e.currentTarget.closest('[data-product-card]');
                            if (card) {
                              const status = card.querySelector('[data-stock-status]');
                              if (status) {
                                status.textContent = 'Out of stock';
                              }
                            }
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400" data-stock-status>
                  <ShoppingBag className="w-3 h-3" />
                  <span>Free returns if colors feel off.</span>
                </div>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary dark:bg-brand-secondary text-white text-[10px] font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-all">
                    Add to bag
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

type Page = 'landing' | 'shop';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [userVisionType, setUserVisionType] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('landing');
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [showARRecommender, setShowARRecommender] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleShowARRecommender = () => {
    setShowARRecommender(true);
  };

  const handleHideARRecommender = () => {
    setShowARRecommender(false);
  };

  const handleAddToBag = (productId: number) => {
    console.log('Added to bag:', productId);
    // Here you would typically add to cart state
  };

  const handleShowWardrobe = () => {
    setShowWardrobe(true);
  };

  const handleHideWardrobe = () => {
    setShowWardrobe(false);
  };

  const handleShowAIAssistant = () => {
    setShowAIAssistant(true);
  };

  const handleHideAIAssistant = () => {
    setShowAIAssistant(false);
  };

  const workflowSteps = [
    { title: "Vision Type", desc: "Select your specific color vision profile." },
    { title: "Capture", desc: "Snap a photo or use live AR camera." },
    { title: "Analyze", desc: "AI processes color harmony and contrast." },
    { title: "Outfit", desc: "Receive smart, confident recommendations." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      ref={containerRef} 
      className={`min-h-screen transition-colors duration-700 relative ${isDark ? 'dark bg-bg-dark' : 'bg-bg-light'}`}
    >
      <div className="noise fixed inset-0 z-0" />
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-brand-accent/5 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-brand-secondary/5 blur-[150px]"
        />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} onShowWardrobe={handleShowWardrobe} onShowAIAssistant={handleShowAIAssistant} />

      <AnimatePresence>
        {userVisionType && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-20 left-0 right-0 z-40 px-6"
          >
            <div className="max-w-3xl mx-auto bg-brand-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Active Profile</div>
                  <div className="text-sm font-bold">{userVisionType}</div>
                </div>
              </div>
              <button 
                onClick={() => setUserVisionType(null)}
                className="text-xs font-bold hover:text-brand-secondary transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTest && (
          <ColorBlindTest 
            onCancel={() => setShowTest(false)}
            onComplete={(type) => {
              setUserVisionType(type);
              setShowTest(false);
              setPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {page === 'landing' && (
        <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5 }}
            src="https://storage.googleapis.com/mle-it-ais-auth-dev-th4ewu33m6niokxfep7a5g-272696740364.asia-southeast1.run.app/user_files/chrissoy789@gmail.com/chrissoy789@gmail.com_1741028045763_image.png" 
            alt="Fashion Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-light/50 via-bg-light to-bg-light dark:from-bg-dark/50 dark:via-bg-dark to-bg-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-light via-bg-light/40 to-transparent dark:from-bg-dark dark:via-bg-dark/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              style={{ opacity, scale }}
              className="text-left relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">AI-Powered Fashion</Badge>
                <h1 className="text-6xl md:text-8xl font-display font-extrabold mb-8 leading-[0.95] tracking-tighter text-brand-primary dark:text-white text-glow">
                  Dress with <br />
                  <span className="text-brand-secondary italic">Confidence.</span>
                </h1>
                <p className="text-xl text-stone-600 dark:text-stone-400 max-w-lg mb-12 leading-relaxed font-light">
                  The intelligent fashion assistant designed for the colorblind community. Precise color detection, harmony analysis, and smart wardrobe organization.
                </p>
                <div className="flex flex-wrap gap-5">
                  <MagneticButton>
                    <button 
                      onClick={() => setShowTest(true)}
                      className="group relative bg-brand-secondary text-white px-10 py-5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,209,255,0.3)] shine-effect"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </MagneticButton>
                  <button className="glass px-10 py-5 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-3 text-brand-primary dark:text-white border border-white/10 shine-effect">
                    <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                      <Play className="w-3 h-3 fill-current text-brand-secondary" />
                    </div>
                    Watch Demo
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-20 flex items-center gap-12"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-brand-primary dark:text-white">300M+</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Users Impacted</span>
                </div>
                <div className="h-8 w-px bg-stone-200 dark:bg-stone-800" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-brand-primary dark:text-white">99.9%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">AI Accuracy</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 glass-card p-2 rounded-2xl shadow-lg">
                <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800">
                  <img 
                    src="https://picsum.photos/seed/fashion-pro/800/1000" 
                    alt="App Interface" 
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-5 -right-5 glass-card p-4 rounded-xl shadow-md z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="text-emerald-600 w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-brand-primary dark:text-white">Perfect Harmony</div>
                      <div className="text-[9px] text-stone-600 dark:text-stone-400 uppercase font-semibold tracking-wider">Score: 98/100</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-8 -left-8 glass-card p-4 rounded-xl shadow-md z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                      <Palette className="text-brand-secondary w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-brand-primary dark:text-white">Charcoal Black</div>
                      <div className="text-[9px] text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider">Detected</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Vision Simulator Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6">Interactive Demo</Badge>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tighter text-brand-primary dark:text-white">See the World <br /><span className="text-brand-secondary">Differently</span></h2>
              <p className="text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed font-light">
                ColorSmart isn't just a tool; it's an empathetic companion. Our technology simulates various vision types to ensure that every outfit recommendation is perfectly balanced for your specific needs.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Real-time AI Analysis", desc: "Instant color recognition with 99.9% accuracy." },
                  { title: "Accessibility First", desc: "Designed with and for the colorblind community." },
                  { title: "Smart Harmony", desc: "Advanced algorithms for perfect color coordination." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-brand-secondary/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-brand-secondary group-hover:text-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-primary dark:text-white mb-1">{item.title}</h4>
                      <p className="text-base text-stone-500 dark:text-stone-400 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <VisionSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-32 relative bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <Badge className="mb-6">Capabilities</Badge>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-brand-primary dark:text-white">Built for Precision</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-lg font-light">
              Advanced computer vision and color theory combined into a seamless, professional interface.
            </p>
          </div>

          <div className="grid md:grid-cols-6 gap-6">
            <FeatureCard 
              icon={Sparkles}
              title="AI Outfit Matcher"
              description="Coordinate suggestions based on learned style preferences and color harmony rules."
              delay={0.1}
              className="md:col-span-4 bg-gradient-to-br from-white/80 to-stone-50/50 dark:from-bg-card-dark/80 dark:to-stone-900/50"
            />
            <FeatureCard 
              icon={Camera}
              title="Color Identification"
              description="Instant identification with accessibility-optimized naming conventions."
              delay={0.2}
              className="md:col-span-2"
            />
            <FeatureCard 
              icon={Eye}
              title="Contrast Analysis"
              description="Simulate vision types and ensure high-contrast combinations for every look."
              delay={0.3}
              className="md:col-span-2"
            />
            <FeatureCard 
              icon={Zap}
              title="AR Visualization"
              description="Visualize outfits in real-time using advanced augmented reality overlays."
              delay={0.4}
              className="md:col-span-4 bg-gradient-to-br from-white/80 to-stone-50/50 dark:from-bg-card-dark/80 dark:to-stone-900/50"
            />
            <FeatureCard 
              icon={SmartphoneIcon}
              title="Wardrobe Management"
              description="Digitize and search your entire closet using automated AI categorization."
              delay={0.5}
              className="md:col-span-3"
            />
            <FeatureCard 
              icon={Calendar}
              title="Style Planner"
              description="Schedule looks based on environmental factors and upcoming occasions."
              delay={0.6}
              className="md:col-span-3"
            />
          </div>
        </div>
      </section>
        </>
      )}

      {page === 'landing' ? (
        <>
          {/* Harmony Explorer Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <ColorHarmonyTool />
                <div>
                  <Badge className="mb-6">Style Intelligence</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-brand-primary dark:text-white">
                    Master the Art of <span className="text-brand-secondary">Coordination</span>
                  </h2>
                  <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
                    Our AI doesn't just name colors; it understands how they interact. Using advanced color theory,
                    ColorSmart helps you build a wardrobe where everything works together perfectly.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-3xl font-bold text-brand-primary dark:text-white mb-2">12+</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Harmony Rules</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-brand-primary dark:text-white mb-2">50k+</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Style Combos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <Badge className="mb-4">Pricing</Badge>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 text-brand-primary dark:text-white">
                  Simple, Transparent Plans
                </h2>
                <p className="text-stone-700 dark:text-stone-400 max-w-2xl mx-auto text-base">
                  Choose the plan that fits your style needs.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                <PricingCard
                  title="Basic"
                  price="0"
                  features={[
                    'Limited outfit suggestions',
                    'Basic color detection',
                    '10 wardrobe items',
                    'Standard support',
                  ]}
                />
                <PricingCard
                  title="Professional"
                  price="199"
                  isPopular={true}
                  features={[
                    'Unlimited outfit suggestions',
                    'Ad-free experience',
                    'Smart wardrobe management',
                    'Advanced contrast analysis',
                    'Favorite outfit saving',
                    'Priority support',
                  ]}
                />
                <PricingCard
                  title="Enterprise"
                  price="499"
                  features={[
                    'Everything in Professional',
                    'Unlimited wardrobe storage',
                    'AI outfit scheduling',
                    'Weather-based styling',
                    'Special occasion planner',
                    'Multi-device sync',
                    '24/7 VIP support',
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-50 -z-10" />
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-8xl font-display font-extrabold mb-10 tracking-tighter text-brand-primary dark:text-white text-glow leading-[0.9]">
                  Ready to See the <br />
                  <span className="text-brand-secondary italic">True Colors</span> of Style?
                </h2>
                <p className="text-xl text-stone-600 dark:text-stone-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
                  Join 300,000+ users dressing with absolute confidence every single day. Experience fashion without
                  boundaries.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <MagneticButton>
                    <button className="w-full sm:w-auto bg-brand-secondary text-white px-12 py-6 rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-2xl shadow-brand-secondary/30 shine-effect">
                      Create Free Account
                    </button>
                  </MagneticButton>
                  <button className="w-full sm:w-auto glass px-12 py-6 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all text-brand-primary dark:text-white border border-white/10 shine-effect">
                    Book a Demo
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        <main className="pt-24">
          <ShoppingSection 
            visionType={userVisionType}
            onShowARRecommender={handleShowARRecommender}
            onAddToBag={handleAddToBag}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="py-24 border-t border-stone-200 dark:border-white/5 relative bg-bg-light dark:bg-bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg shadow-brand-secondary/20">
                  <Palette className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-display font-bold text-brand-primary dark:text-white tracking-tighter">COLOR<span className="text-brand-secondary">SMART</span></span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-8 leading-relaxed font-light">
                Empowering the colorblind community through innovative AI fashion technology. Precision, empathy, and style.
              </p>
              <div className="flex gap-4">
                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                  <motion.a 
                    key={i} 
                    href="#" 
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-brand-secondary dark:hover:text-brand-secondary transition-colors text-stone-400 border border-white/10"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-8 text-brand-primary dark:text-white">Product</h4>
              <ul className="space-y-4 text-xs font-medium text-stone-500 dark:text-stone-400">
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Workflow</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">AR Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-8 text-brand-primary dark:text-white">Company</h4>
              <ul className="space-y-4 text-xs font-medium text-stone-500 dark:text-stone-400">
                <li><a href="#" className="hover:text-brand-secondary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-secondary transition-colors">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-8 text-brand-primary dark:text-white">Newsletter</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 font-light">Join 50,000+ subscribers for style tips.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:border-brand-secondary outline-none px-5 py-3 rounded-xl flex-grow text-xs font-medium transition-all text-brand-primary dark:text-white"
                />
                <button className="bg-brand-secondary p-3 rounded-xl text-white hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-stone-200 dark:border-white/5 gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
              © 2026 COLORSMART FASHION. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <a href="#" className="hover:text-brand-secondary transition-colors">Accessibility</a>
              <a href="#" className="hover:text-brand-secondary transition-colors">Cookies</a>
              <a href="#" className="hover:text-brand-secondary transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AR Outfit Recommender Modal */}
      <AnimatePresence>
        {showARRecommender && (
          <AROutfitRecommender 
            onClose={handleHideARRecommender}
            onAddToBag={handleAddToBag}
          />
        )}
      </AnimatePresence>

      {/* Wardrobe Modal */}
      <AnimatePresence>
        {showWardrobe && (
          <Wardrobe 
            onClose={handleHideWardrobe}
            onAddToBag={handleAddToBag}
          />
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIAssistant && (
          <AIAssistant 
            onClose={handleHideAIAssistant}
            userVisionType={userVisionType}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
