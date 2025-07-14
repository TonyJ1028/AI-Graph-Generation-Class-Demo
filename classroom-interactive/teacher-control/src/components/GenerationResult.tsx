'use client';

import { useState } from 'react';
import { Download, Maximize2, Clock, Zap } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

interface GenerationResultProps {
  result: {
    created: number;
    data?: Array<{
      b64_json?: string;
      url?: string;
    }>;
    usage?: {
      total_tokens?: number;
      input_tokens?: number;
      output_tokens?: number;
      input_tokens_details?: {
        text_tokens?: number;
        image_tokens?: number;
      };
    };
  };
}

export function GenerationResult({ result }: GenerationResultProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);



  const downloadImage = (imageData: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentImage = result.data?.[selectedImageIndex];
  const imageData = currentImage?.b64_json || currentImage?.url;

  // 安全检查
  if (!result || !result.data || result.data.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <p className="text-gray-500 text-center">暂无生成结果</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Generation Info - Mobile Optimized */}
      <div className="bg-white rounded-lg border p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">生成结果</h3>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">{formatTimestamp(result.created)}</span>
            <span className="sm:hidden">{new Date(result.created * 1000).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Mobile: Single Column, Desktop: Two Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">总Token数：</span>
              <span className="font-medium">{result.usage?.total_tokens || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">输入Token：</span>
              <span className="font-medium">{result.usage?.input_tokens || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">输出Token：</span>
              <span className="font-medium">{result.usage?.output_tokens || 0}</span>
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">文本Token：</span>
              <span className="font-medium">{result.usage?.input_tokens_details?.text_tokens || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">图像Token：</span>
              <span className="font-medium">{result.usage?.input_tokens_details?.image_tokens || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">生成数量：</span>
              <span className="font-medium">{result.data?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Display - Mobile Optimized */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Image Tabs - Mobile Scrollable */}
        {result.data && result.data.length > 1 && (
          <div className="border-b bg-gray-50 px-3 sm:px-4 py-2">
            <div className="flex space-x-2 overflow-x-auto">
              {result.data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded transition-colors touch-manipulation ${
                    selectedImageIndex === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  图像 {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Image - Mobile Optimized */}
        <div className="p-3 sm:p-4">
          {imageData && (
            <div className="relative group">
              <img
                src={currentImage.b64_json ? `data:image/png;base64,${currentImage.b64_json}` : currentImage.url}
                alt={`Generated image ${selectedImageIndex + 1}`}
                className="w-full h-auto rounded-lg shadow-sm"
              />

              {/* Image Controls - Always Visible on Mobile */}
              <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors touch-manipulation"
                    title="全屏查看"
                  >
                    <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  {currentImage.b64_json && (
                    <button
                      onClick={() => downloadImage(currentImage.b64_json!, selectedImageIndex)}
                      className="p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors touch-manipulation"
                      title="下载图片"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="border-t bg-gray-50 px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              生成完成
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {result.data.map((image, index) => (
                image.b64_json && (
                  <button
                    key={index}
                    onClick={() => downloadImage(image.b64_json!, index)}
                    className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    下载图像 {index + 1}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && imageData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={currentImage.b64_json ? `data:image/png;base64,${currentImage.b64_json}` : currentImage.url}
              alt={`Generated image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
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
