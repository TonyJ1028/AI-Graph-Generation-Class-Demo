'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

interface GenerationResultProps {
  result: any;
  timestamp: number;
}

export function GenerationResult({ result, timestamp }: GenerationResultProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Auto-advance images if multiple
  useEffect(() => {
    if (result?.data?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % result.data.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [result?.data?.length]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  // Handle error case
  if (result?.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-red-400 mb-6">生成失败</h2>
          <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-6 mb-8">
            <p className="text-xl text-red-200">{result.error}</p>
          </div>
          <p className="text-gray-400">
            请检查网络连接或联系技术支持
          </p>
        </div>
      </div>
    );
  }

  // Handle successful generation
  if (result?.data && result.data.length > 0) {
    const currentImage = result.data[currentImageIndex];
    const imageData = currentImage?.b64_json || currentImage?.url;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm px-8 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">生成完成</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimestamp(timestamp)}</span>
                  </div>
                  {result.usage && (
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{result.usage.total_tokens} tokens</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Counter */}
            {result.data.length > 1 && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">
                  {currentImageIndex + 1} / {result.data.length}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? result.data.length - 1 : prev - 1
                    )}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      (prev + 1) % result.data.length
                    )}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Image Display */}
        <div className="flex-1 flex items-center justify-center p-8">
          {imageData && (
            <div 
              className="relative max-w-full max-h-full cursor-pointer group"
              onClick={() => setShowFullscreen(true)}
            >
              <img
                src={currentImage.b64_json ? `data:image/png;base64,${currentImage.b64_json}` : currentImage.url}
                alt={`Generated image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-lg font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    点击全屏查看
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {result.data.length > 1 && (
          <div className="bg-gray-900/50 backdrop-blur-sm px-8 py-4 border-t border-gray-700">
            <div className="flex justify-center space-x-4 overflow-x-auto">
              {result.data.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-blue-500 scale-110' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image.b64_json ? `data:image/png;base64,${image.b64_json}` : image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Modal */}
        {showFullscreen && imageData && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={currentImage.b64_json ? `data:image/png;base64,${currentImage.b64_json}` : currentImage.url}
                alt={`Generated image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for unexpected result format
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-4xl font-bold text-gray-400 mb-4">无结果</h2>
        <p className="text-xl text-gray-500">未收到有效的生成结果</p>
      </div>
    </div>
  );
}
