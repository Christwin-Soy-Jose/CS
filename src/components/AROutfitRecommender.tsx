import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Shirt, 
  User, 
  Palette, 
  CheckCircle2,
  X,
  Sparkles,
  Eye,
  ShoppingBag
} from 'lucide-react';

interface ColorAnalysis {
  dominantColors: string[];
  skinTone: string;
  clothingType: 'top' | 'bottom' | 'dress' | 'unknown';
  colorPalette: Array<{ color: string; hex: string; percentage: number }>;
}

interface OutfitRecommendation {
  type: 'top' | 'bottom' | 'accessory';
  color: string;
  hex: string;
  reason: string;
  products: Array<{
    id: number;
    name: string;
    image: string;
    price?: string;
  }>;
}

export const AROutfitRecommender = ({ onClose, onAddToBag }: { 
  onClose: () => void;
  onAddToBag: (productId: number) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [cvReady, setCvReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sample product data for recommendations
  const sampleProducts = {
    tops: [
      { id: 21, name: 'Urban Cargo Pants', image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹2999' },
      { id: 22, name: 'Neon Sport Tank', image: 'https://images.pexels.com/photos/5386754/pexels-photo-5386754.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹1999' },
      { id: 23, name: 'Classic Oxford Shirt', image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹3499' },
      { id: 25, name: 'Striped Polo Shirt', image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹2499' },
    ],
    bottoms: [
      { id: 10, name: 'Contrast Panel Joggers', image: 'https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹2799' },
      { id: 19, name: 'Metro Chinos', image: 'https://images.pexels.com/photos/6311581/pexels-photo-6311581.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹3299' },
    ],
    accessories: [
      { id: 12, name: 'Signal Beanie', image: 'https://images.pexels.com/photos/7671241/pexels-photo-7671241.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹999' },
      { id: 24, name: 'Alpine Fleece Jacket', image: 'https://images.pexels.com/photos/1472940/pexels-photo-1472940.jpeg?auto=compress&cs=tinysrgb&w=800', price: '₹4999' },
    ]
  };

  // Load OpenCV
  useEffect(() => {
    const loadOpenCV = async () => {
      try {
        // @ts-ignore
        const cv = window.cv;
        if (cv) {
          setCvReady(true);
        } else {
          // Load OpenCV.js from CDN
          const script = document.createElement('script');
          script.src = 'https://docs.opencv.org/4.5.0/opencv.js';
          script.async = true;
          script.onload = () => {
            // @ts-ignore
            if (window.cv) {
              setCvReady(true);
            }
          };
          document.body.appendChild(script);
        }
      } catch (err) {
        console.error('Failed to load OpenCV:', err);
        setError('Failed to load computer vision library');
      }
    };

    loadOpenCV();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        analyzeImage(imageData);
      }
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate image analysis with OpenCV
      // In a real implementation, this would use actual OpenCV functions
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulated color analysis results
      const mockAnalysis: ColorAnalysis = {
        dominantColors: ['#4A5568', '#718096', '#2D3748'],
        skinTone: '#F4C2A1', // Light medium skin tone
        clothingType: Math.random() > 0.5 ? 'top' : 'bottom',
        colorPalette: [
          { color: 'Charcoal Gray', hex: '#4A5568', percentage: 45 },
          { color: 'Steel Blue', hex: '#718096', percentage: 35 },
          { color: 'Dark Slate', hex: '#2D3748', percentage: 20 }
        ]
      };

      setColorAnalysis(mockAnalysis);
      generateRecommendations(mockAnalysis);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (analysis: ColorAnalysis) => {
    const recommendations: OutfitRecommendation[] = [];

    // Generate recommendations based on analysis
    if (analysis.clothingType === 'bottom') {
      // Recommend tops that complement the detected bottom colors
      recommendations.push({
        type: 'top',
        color: 'Crisp White',
        hex: '#FFFFFF',
        reason: 'White provides excellent contrast with dark bottoms and complements your skin tone',
        products: sampleProducts.tops.filter(p => [23, 25].includes(p.id))
      });

      recommendations.push({
        type: 'top',
        color: 'Navy Blue',
        hex: '#1E3A8A',
        reason: 'Navy creates a sophisticated monochromatic look with your detected colors',
        products: sampleProducts.tops.filter(p => [23].includes(p.id))
      });
    } else {
      // Recommend bottoms that complement the detected top colors
      recommendations.push({
        type: 'bottom',
        color: 'Khaki Beige',
        hex: '#D4A574',
        reason: 'Khaki provides warm contrast that balances your cool-toned top',
        products: sampleProducts.bottoms.filter(p => [19].includes(p.id))
      });

      recommendations.push({
        type: 'bottom',
        color: 'Dark Denim',
        hex: '#1E3A8A',
        reason: 'Dark denim creates a classic, versatile foundation for your outfit',
        products: sampleProducts.bottoms.filter(p => [10].includes(p.id))
      });
    }

    // Always add an accessory recommendation
    recommendations.push({
      type: 'accessory',
      color: 'Burgundy',
      hex: '#7C2D12',
      reason: 'A burgundy accessory adds depth and sophistication to your color palette',
      products: sampleProducts.accessories.filter(p => [12, 24].includes(p.id))
    });

    setRecommendations(recommendations);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setColorAnalysis(null);
    setRecommendations([]);
    setError(null);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center">
                <Camera className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-primary dark:text-white">AR Outfit Recommender</h2>
                <p className="text-sm text-stone-500">AI-powered color analysis and styling suggestions</p>
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

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Camera View */}
            {!capturedImage && !colorAnalysis && (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-lg font-medium text-brand-primary dark:text-white mb-2">
                    {isCameraActive ? 'Position your outfit in the frame' : 'Capture your outfit for AI analysis'}
                  </p>
                  <p className="text-sm text-stone-500">
                    Our AI will detect colors, identify clothing type, and suggest complementary pieces
                  </p>
                </div>

                {/* Camera/Video Feed */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {isCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                        <p className="text-stone-500">Camera not active</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex justify-center gap-4">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={captureImage}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                        Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="flex items-center gap-2 px-6 py-3 bg-stone-200 dark:bg-stone-700 text-brand-primary dark:text-white rounded-xl font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                      >
                        <CameraOff className="w-5 h-5" />
                        Stop Camera
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="flex items-center justify-center gap-3 text-brand-secondary font-bold mb-4">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Analyzing your outfit...
                </div>
                <p className="text-stone-500">Detecting colors, identifying style, and generating recommendations</p>
              </motion.div>
            )}

            {/* Results */}
            {colorAnalysis && !isLoading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Analysis Results */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Captured Image */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary dark:text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-brand-secondary" />
                      Captured Outfit
                    </h3>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                      <img
                        src={capturedImage!}
                        alt="Captured outfit"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Color Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-primary dark:text-white mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-brand-secondary" />
                      Color Analysis
                    </h3>
                    <div className="space-y-4">
                      {/* Clothing Type */}
                      <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Detected Type</p>
                        <p className="text-lg font-bold text-brand-primary dark:text-white capitalize">
                          {colorAnalysis.clothingType === 'top' ? 'Top/Upper Body' : 
                           colorAnalysis.clothingType === 'bottom' ? 'Bottom/Lower Body' :
                           colorAnalysis.clothingType === 'dress' ? 'Dress/One-piece' : 'Unknown'}
                        </p>
                      </div>

                      {/* Color Palette */}
                      <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-3">Dominant Colors</p>
                        <div className="space-y-2">
                          {colorAnalysis.colorPalette.map((color, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg border border-stone-200 dark:border-stone-700"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-brand-primary dark:text-white">{color.color}</p>
                                <p className="text-xs text-stone-500">{color.hex} • {color.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skin Tone */}
                      <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">Detected Skin Tone</p>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg border border-stone-200 dark:border-stone-700"
                            style={{ backgroundColor: colorAnalysis.skinTone }}
                          />
                          <p className="text-sm font-medium text-brand-primary dark:text-white">Light Medium</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-xl font-semibold text-brand-primary dark:text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-brand-secondary" />
                    AI Recommendations
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            {rec.type === 'top' ? 'Recommended Top' :
                             rec.type === 'bottom' ? 'Recommended Bottom' : 'Accessory'}
                          </span>
                          <div 
                            className="w-6 h-6 rounded-lg border border-stone-200 dark:border-stone-700"
                            style={{ backgroundColor: rec.hex }}
                          />
                        </div>
                        
                        <h4 className="text-lg font-bold text-brand-primary dark:text-white mb-2">
                          {rec.color}
                        </h4>
                        
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                          {rec.reason}
                        </p>

                        {/* Product Suggestions */}
                        <div className="space-y-3">
                          {rec.products.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-primary dark:text-white truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-stone-500">{product.price}</p>
                              </div>
                              <button
                                onClick={() => onAddToBag(product.id)}
                                className="p-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition-colors"
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6">
                  <button
                    onClick={resetCapture}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-200 dark:bg-stone-700 text-brand-primary dark:text-white rounded-xl font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Analyze Another Outfit
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-brand-primary dark:text-white mb-2">Analysis Failed</h3>
                <p className="text-stone-500 mb-6">{error}</p>
                <button
                  onClick={resetCapture}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors mx-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
};
