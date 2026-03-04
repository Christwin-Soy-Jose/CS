import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Upload, 
  Camera, 
  Shirt, 
  Trash2, 
  Edit2, 
  Save,
  Eye,
  Palette,
  Sparkles,
  ShoppingBag,
  Grid3X3,
  Filter,
  Search
} from 'lucide-react';

interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'accessory' | 'shoes';
  color: string;
  hex: string;
  image: string;
  brand?: string;
  size?: string;
  occasion?: string;
  season?: string;
  dateAdded: string;
}

interface Outfit {
  id: string;
  name: string;
  items: WardrobeItem[];
  dateCreated: string;
  occasion?: string;
}

export const Wardrobe = ({ onClose, onAddToBag }: { 
  onClose: () => void;
  onAddToBag: (productId: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits'>('wardrobe');
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<WardrobeItem[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load wardrobe from localStorage on mount
  useEffect(() => {
    const savedWardrobe = localStorage.getItem('userWardrobe');
    const savedOutfitData = localStorage.getItem('savedOutfits');
    
    if (savedWardrobe) {
      setWardrobeItems(JSON.parse(savedWardrobe));
    }
    if (savedOutfitData) {
      setSavedOutfits(JSON.parse(savedOutfitData));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (wardrobeItems.length > 0) {
      localStorage.setItem('userWardrobe', JSON.stringify(wardrobeItems));
    }
  }, [wardrobeItems]);

  useEffect(() => {
    if (savedOutfits.length > 0) {
      localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
    }
  }, [savedOutfits]);

  const categories = [
    { value: 'all', label: 'All Items', icon: Grid3X3 },
    { value: 'top', label: 'Tops', icon: Shirt },
    { value: 'bottom', label: 'Bottoms', icon: Shirt },
    { value: 'dress', label: 'Dresses', icon: Shirt },
    { value: 'outerwear', label: 'Outerwear', icon: Shirt },
    { value: 'accessory', label: 'Accessories', icon: Shirt },
    { value: 'shoes', label: 'Shoes', icon: Shirt },
  ];

  const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Navy', hex: '#1E3A8A' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Brown', hex: '#92400E' },
    { name: 'Beige', hex: '#D4A574' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
  ];

  const handleImageUpload = (file: File, source: 'upload' | 'camera') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      if (!editingItem) {
        setShowAddItem(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, source: 'upload' | 'camera') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, source);
    }
  };

  const saveWardrobeItem = (itemData: Partial<WardrobeItem>) => {
    if (editingItem) {
      // Update existing item
      setWardrobeItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData, image: previewImage || item.image }
          : item
      ));
    } else {
      // Add new item
      const newItem: WardrobeItem = {
        id: Date.now().toString(),
        name: itemData.name || 'New Item',
        category: itemData.category || 'top',
        color: itemData.color || 'Black',
        hex: itemData.hex || '#000000',
        image: previewImage || '',
        brand: itemData.brand,
        size: itemData.size,
        occasion: itemData.occasion,
        season: itemData.season,
        dateAdded: new Date().toISOString(),
      };
      setWardrobeItems(prev => [...prev, newItem]);
    }
    
    // Reset form
    setShowAddItem(false);
    setEditingItem(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const deleteWardrobeItem = (id: string) => {
    setWardrobeItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = wardrobeItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToOutfit = (item: WardrobeItem) => {
    if (!currentOutfit.find(i => i.id === item.id)) {
      setCurrentOutfit(prev => [...prev, item]);
    }
  };

  const removeFromOutfit = (itemId: string) => {
    setCurrentOutfit(prev => prev.filter(item => item.id !== itemId));
  };

  const saveOutfit = () => {
    if (currentOutfit.length >= 2) {
      const newOutfit: Outfit = {
        id: Date.now().toString(),
        name: `Outfit ${savedOutfits.length + 1}`,
        items: [...currentOutfit],
        dateCreated: new Date().toISOString(),
      };
      setSavedOutfits(prev => [...prev, newOutfit]);
      setCurrentOutfit([]);
      setShowOutfitBuilder(false);
    }
  };

  const deleteOutfit = (id: string) => {
    setSavedOutfits(prev => prev.filter(outfit => outfit.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl w-full bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center">
                <Shirt className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-primary dark:text-white">My Wardrobe</h2>
                <p className="text-sm text-stone-500">Manage your clothes and create outfits</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'wardrobe'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              My Clothes ({wardrobeItems.length})
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'outfits'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              Saved Outfits ({savedOutfits.length})
            </button>
            <button
              onClick={() => setShowOutfitBuilder(true)}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-accent to-brand-secondary text-white transition-all"
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Create Outfit
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Wardrobe Tab */}
          {activeTab === 'wardrobe' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search clothes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-brand-secondary text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Items Buttons */}
              <div className="flex gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInput(e, 'upload')}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileInput(e, 'camera')}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-stone-200 dark:bg-stone-700 text-brand-primary dark:text-white rounded-xl font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
              </div>

              {/* Wardrobe Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative"
                    >
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-transparent group-hover:border-brand-secondary transition-all">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                            <p className="text-white/80 text-xs">{item.brand}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setPreviewImage(item.image);
                              setShowAddItem(true);
                            }}
                            className="p-2 bg-white/90 dark:bg-stone-800/90 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => addToOutfit(item)}
                            className="p-2 bg-brand-secondary/90 text-white rounded-lg hover:bg-brand-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteWardrobeItem(item.id)}
                            className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Color Indicator */}
                      <div 
                        className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: item.hex }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shirt className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-brand-primary dark:text-white mb-2">No clothes yet</h3>
                  <p className="text-stone-500">Start by adding your first item to your wardrobe</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Outfits Tab */}
          {activeTab === 'outfits' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {savedOutfits.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOutfits.map((outfit) => (
                    <motion.div
                      key={outfit.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-brand-primary dark:text-white">
                          {outfit.name}
                        </h3>
                        <button
                          onClick={() => deleteOutfit(outfit.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {outfit.items.map((item) => (
                          <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {outfit.items.length} items • {new Date(outfit.dateCreated).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-brand-primary dark:text-white mb-2">No saved outfits</h3>
                  <p className="text-stone-500">Create your first outfit using your wardrobe items</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Add/Edit Item Modal */}
        <AnimatePresence>
          {showAddItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/95 backdrop-blur-xl p-6 z-60 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-brand-primary dark:text-white mb-6">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>

                {previewImage && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-6">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue={editingItem?.name}
                      placeholder="e.g., Blue Denim Jacket"
                      className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      id="item-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Category
                      </label>
                      <select
                        defaultValue={editingItem?.category || 'top'}
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-category"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="dress">Dress</option>
                        <option value="outerwear">Outerwear</option>
                        <option value="accessory">Accessory</option>
                        <option value="shoes">Shoes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Color
                      </label>
                      <select
                        defaultValue={editingItem?.color || 'Black'}
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-color"
                      >
                        {colorOptions.map((color) => (
                          <option key={color.name} value={color.name}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Brand (Optional)
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.brand}
                        placeholder="e.g., Zara"
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Size (Optional)
                      </label>
                      <input
                        type="text"
                        defaultValue={editingItem?.size}
                        placeholder="e.g., M, 32"
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-size"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Occasion (Optional)
                      </label>
                      <select
                        defaultValue={editingItem?.occasion || ''}
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-occasion"
                      >
                        <option value="">Select occasion</option>
                        <option value="casual">Casual</option>
                        <option value="work">Work</option>
                        <option value="formal">Formal</option>
                        <option value="party">Party</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Season (Optional)
                      </label>
                      <select
                        defaultValue={editingItem?.season || ''}
                        className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-brand-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        id="item-season"
                      >
                        <option value="">Select season</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                        <option value="all">All Season</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      const name = (document.getElementById('item-name') as HTMLInputElement)?.value || 'New Item';
                      const category = (document.getElementById('item-category') as HTMLSelectElement)?.value as WardrobeItem['category'];
                      const color = (document.getElementById('item-color') as HTMLSelectElement)?.value || 'Black';
                      const brand = (document.getElementById('item-brand') as HTMLInputElement)?.value;
                      const size = (document.getElementById('item-size') as HTMLInputElement)?.value;
                      const occasion = (document.getElementById('item-occasion') as HTMLSelectElement)?.value;
                      const season = (document.getElementById('item-season') as HTMLSelectElement)?.value;
                      const selectedColor = colorOptions.find(c => c.name === color) || colorOptions[0];
                      
                      saveWardrobeItem({
                        name,
                        category,
                        color,
                        hex: selectedColor.hex,
                        brand,
                        size,
                        occasion,
                        season,
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setEditingItem(null);
                      setPreviewImage(null);
                    }}
                    className="px-6 py-3 bg-stone-200 dark:bg-stone-700 text-brand-primary dark:text-white rounded-xl font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outfit Builder Modal */}
        <AnimatePresence>
          {showOutfitBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/95 backdrop-blur-xl p-6 z-60 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-brand-primary dark:text-white">
                    Create Outfit
                  </h3>
                  <button
                    onClick={() => {
                      setShowOutfitBuilder(false);
                      setCurrentOutfit([]);
                    }}
                    className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Available Items */}
                  <div>
                    <h4 className="text-lg font-semibold text-brand-primary dark:text-white mb-4">
                      Your Clothes
                    </h4>
                    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {wardrobeItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => addToOutfit(item)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            currentOutfit.find(i => i.id === item.id)
                              ? 'border-brand-secondary ring-2 ring-brand-secondary/50'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                          }`}
                        >
                          <div className="aspect-square">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Outfit */}
                  <div>
                    <h4 className="text-lg font-semibold text-brand-primary dark:text-white mb-4">
                      Current Outfit ({currentOutfit.length}/6)
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {currentOutfit.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-brand-primary dark:text-white">{item.name}</p>
                            <p className="text-sm text-stone-500">{item.brand} • {item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromOutfit(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {currentOutfit.length >= 2 && (
                      <button
                        onClick={saveOutfit}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        Save Outfit
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
