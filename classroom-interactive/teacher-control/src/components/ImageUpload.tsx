'use client';

import { forwardRef, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void;
  selectedImages: File[];
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ onImageUpload, selectedImages }, ref) => {
    const [dragOver, setDragOver] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileSelect = (files: FileList | null) => {
      if (!files) return;

      const validFiles: File[] = [];
      const newPreviews: string[] = [];

      const maxSize = 10 * 1024 * 1024; // 10MB limit for better performance

      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          if (file.size > maxSize) {
            alert(`图片 "${file.name}" 太大 (${(file.size / 1024 / 1024).toFixed(1)}MB)。\n建议使用小于10MB的图片以获得更好的处理速度。\n大图片可能导致处理超时。`);
            return;
          }

          validFiles.push(file);

          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newPreviews.push(e.target.result as string);
              if (newPreviews.length === validFiles.length) {
                setPreviews(newPreviews);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });

      if (validFiles.length > 0) {
        onImageUpload(validFiles);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
    };

    const removeImage = (index: number) => {
      const newImages = selectedImages.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      
      onImageUpload(newImages);
      setPreviews(newPreviews);
    };

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          上传图片
        </label>

        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors touch-manipulation ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={ref}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            <span className="hidden sm:inline">拖拽图片到这里或</span>
            <button
              type="button"
              onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium touch-manipulation"
            >
              <span className="sm:hidden">点击选择图片</span>
              <span className="hidden sm:inline ml-1">点击选择</span>
            </button>
          </p>
          <p className="text-xs text-gray-500 px-2">
            支持 PNG, WEBP, JPG 格式<span className="hidden sm:inline">，建议小于10MB以获得更好的处理速度</span>
          </p>
        </div>

        {/* Image Previews - Enhanced Mobile Scrolling */}
        {selectedImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              已选择 {selectedImages.length} 个文件
            </p>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="sm:hidden">
              <div
                className="flex space-x-3 overflow-x-auto pb-2 mobile-scroll"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {selectedImages.map((file, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-24"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 touch-manipulation"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <p className="text-xs text-gray-500 mt-1 truncate" title={file.name}>
                      {file.name.length > 8 ? file.name.substring(0, 8) + '...' : file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-3">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 touch-manipulation"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <p className="text-xs text-gray-500 mt-1 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
