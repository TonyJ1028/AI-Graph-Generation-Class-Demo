'use client';

import { useState, useRef } from 'react';
import { ApiClient, ImageEditRequest } from '@/lib/api';
import { WebSocketClient } from '@/lib/websocket';
import { ImageUpload } from './ImageUpload';
import { ModeSelector } from './ModeSelector';
import { PromptInput } from './PromptInput';
import { ApiConfigModal } from './ApiConfigModal';
import { GenerationResult } from './GenerationResult';
import { MobileTouchOptimizer } from './MobileTouchOptimizer';
import { Settings, Wifi, WifiOff, Monitor } from 'lucide-react';

interface TeacherControlPanelProps {
  sessionId: string;
  apiClient: ApiClient;
  wsClient: WebSocketClient;
}

function TeacherControlPanel({ sessionId, apiClient, wsClient }: TeacherControlPanelProps) {
  const [currentMode, setCurrentMode] = useState<'image_generation' | 'idle'>('idle');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<'gpt-image-1' | 'flux-kontext-pro' | 'flux-kontext-max'>('gpt-image-1');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low' | 'auto'>('auto');
  const [size, setSize] = useState<'1024x1024' | '1536x1024' | '1024x1536' | 'auto'>('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [isConnected] = useState(wsClient.isConnected());
  const [retryCount, setRetryCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeChange = (mode: 'image_generation' | 'idle') => {
    setCurrentMode(mode);
    wsClient.sendModeChange(mode);
    
    // Clear previous results when changing modes
    if (mode !== currentMode) {
      setGenerationResult(null);
      setError('');
    }
  };

  const handleImageUpload = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleGenerate = async (isRetry: boolean | React.MouseEvent = false) => {
    // 如果是鼠标事件，则设置 isRetry 为 false
    const retry = typeof isRetry === 'boolean' ? isRetry : false;
    if (!selectedImages.length || !prompt.trim()) {
      setError('请选择图片并输入提示词');
      return;
    }

    // Check image sizes
    const oversizedImages = selectedImages.filter(img => img.size > 10 * 1024 * 1024);
    if (oversizedImages.length > 0) {
      setError(`图片过大：${oversizedImages.map(img => `${img.name} (${(img.size / 1024 / 1024).toFixed(1)}MB)`).join(', ')}。建议使用小于10MB的图片。`);
      return;
    }

    if (!retry) {
      setRetryCount(0);
    }

    setIsGenerating(true);
    setError('');
    setGenerationResult(null);

    try {
      const request: ImageEditRequest = {
        image: selectedImages,
        prompt: prompt.trim(),
        model,
        quality,
        size,
        sessionId
        // Note: response_format removed as it's not supported by the API
      };

      // Notify WebSocket clients about generation start
      wsClient.sendGenerationRequest({
        type: 'image_edit',
        prompt: prompt.trim(),
        model,
        parameters: { quality, size }
      });

      const result = await apiClient.editImage(request);
      setGenerationResult(result);
      setRetryCount(0); // Reset retry count on success

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败';

      // Check if it's a timeout error and offer retry
      if (errorMessage.includes('超时') || errorMessage.includes('timeout')) {
        setError(`${errorMessage}\n\n这通常是因为图像处理需要较长时间。您可以：\n1. 尝试重新生成\n2. 使用更小的图片\n3. 简化提示词`);
        setRetryCount(prev => prev + 1);
      } else {
        setError(errorMessage);
      }

      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedImages([]);
    setPrompt('');
    setGenerationResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <MobileTouchOptimizer className="h-screen flex flex-col bg-gray-50 overflow-hidden mobile-interface no-bounce">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 no-zoom">
        <div className="flex items-center space-x-2">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
            课堂互动控制端
          </h1>
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="hidden sm:inline">已连接</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                <span className="hidden sm:inline">未连接</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs text-gray-500 hidden xs:inline max-w-20 sm:max-w-none truncate">
            {sessionId.slice(0, 6)}...
          </span>
          <button
            onClick={() => {
              const whiteboardBaseUrl = process.env.NEXT_PUBLIC_WHITEBOARD_URL || 'http://localhost:3002';
              const whiteboardUrl = `${whiteboardBaseUrl}?session=${sessionId}`;
              window.open(whiteboardUrl, '_blank');
            }}
            className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="打开白板"
          >
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setShowApiConfig(true)}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="API配置"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Session ID Display - Only show on small screens */}
      <div className="lg:hidden bg-blue-50 border-b border-blue-200 px-3 sm:px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-blue-600 font-medium mb-1">会话ID (Session ID)</p>
            <p className="text-sm font-mono text-blue-800 break-all">{sessionId}</p>
          </div>
          <div className="ml-3 flex space-x-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(sessionId).then(() => {
                  alert('会话ID已复制到剪贴板');
                }).catch(() => {
                  alert('复制失败，请手动复制会话ID');
                });
              }}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors touch-manipulation"
            >
              复制
            </button>
            <button
              onClick={() => {
                const whiteboardBaseUrl = process.env.NEXT_PUBLIC_WHITEBOARD_URL || 'http://localhost:3002';
                const whiteboardUrl = `${whiteboardBaseUrl}?session=${sessionId}`;
                navigator.clipboard.writeText(whiteboardUrl).then(() => {
                  alert('白板端链接已复制到剪贴板');
                }).catch(() => {
                  alert('复制失败，请手动复制链接');
                });
              }}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors touch-manipulation"
            >
              链接
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-600">
          💡 在电脑上打开白板端时需要此ID
        </div>
      </div>

      {/* Main Content - Mobile-First Design */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Mode Selector - Always Visible */}
        <div className="bg-white border-b px-3 sm:px-4 py-3 flex-shrink-0">
          <ModeSelector
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
        </div>

        {/* Content Area - Responsive Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Controls Panel - Collapsible on Mobile */}
          <div className="w-full lg:w-80 bg-white border-b lg:border-r lg:border-b-0 flex flex-col min-h-0">
            {currentMode === 'image_generation' && (
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {/* Controls Content - Enhanced Mobile Scrolling */}
                <div
                  className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 overflow-y-auto mobile-scroll momentum-scroll"
                >
                  <ImageUpload
                    ref={fileInputRef}
                    onImageUpload={handleImageUpload}
                    selectedImages={selectedImages}
                  />

                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    placeholder="描述你想要的图像编辑效果..."
                  />

                  {/* Mobile-Optimized Settings */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        模型选择
                      </label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value as any)}
                        className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="gpt-image-1">GPT Image 1</option>
                        <option value="flux-kontext-pro">Flux Kontext Pro</option>
                        <option value="flux-kontext-max">Flux Kontext Max</option>
                      </select>
                    </div>

                    {/* Compact Settings Row for Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          质量设置
                        </label>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value as any)}
                          className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                        >
                          <option value="auto">自动</option>
                          <option value="high">高质量</option>
                          <option value="medium">中等质量</option>
                          <option value="low">低质量</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          图像尺寸
                        </label>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value as any)}
                          className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                        >
                          <option value="auto">自动</option>
                          <option value="1024x1024">1024x1024</option>
                          <option value="1536x1024">1536x1024</option>
                          <option value="1024x1536">1024x1536</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Add some bottom padding for better mobile scrolling */}
                  <div className="h-4 lg:hidden"></div>
                </div>

                {/* Action Buttons - Sticky Bottom with Enhanced Mobile Support */}
                <div className="p-3 sm:p-4 border-t bg-gray-50 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !selectedImages.length || !prompt.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 text-base font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[48px] active:bg-blue-800"
                    >
                      {isGenerating ? '生成中...' : '开始生成'}
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-4 py-3 text-base font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[48px] active:bg-gray-100"
                    >
                      清空
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentMode === 'idle' && (
              <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
                <div className="text-center">
                  <p className="text-base sm:text-lg mb-2">选择互动模式开始</p>
                  <p className="text-sm text-gray-400">请从上方选择一个互动模式</p>
                </div>
              </div>
            )}
          </div>

          {/* Display Area - Enhanced Mobile Scrolling */}
          <div className="flex-1 flex flex-col min-h-0 lg:min-h-[400px]">
            <div className="p-3 sm:p-4 border-b bg-white flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">显示区域</h2>
            </div>

            <div
              className="flex-1 p-3 sm:p-4 overflow-y-auto mobile-scroll momentum-scroll"
            >
              {error && (
                <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm sm:text-base whitespace-pre-line">{error}</p>
                  {(error.includes('超时') || error.includes('timeout')) && (
                    <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleGenerate(true)}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors touch-manipulation active:bg-orange-800"
                      >
                        重新生成 {retryCount > 0 && `(第${retryCount + 1}次)`}
                      </button>
                      <button
                        onClick={() => setError('')}
                        className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors touch-manipulation active:bg-gray-800"
                      >
                        关闭
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isGenerating && (
                <div className="flex items-center justify-center h-48 sm:h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm sm:text-base">正在生成图像...</p>
                  </div>
                </div>
              )}

              {generationResult && (
                <div className="w-full">
                  <GenerationResult result={generationResult} />
                </div>
              )}

              {!generationResult && !isGenerating && !error && currentMode === 'image_generation' && (
                <div className="flex items-center justify-center h-48 sm:h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm sm:text-base text-center px-4">生成的图像将在这里显示</p>
                </div>
              )}

              {currentMode === 'idle' && (
                <div className="flex items-center justify-center h-48 sm:h-64">
                  <div className="text-center text-gray-400">
                    <p className="text-sm sm:text-base">请选择互动模式开始使用</p>
                  </div>
                </div>
              )}

              {/* Add bottom padding for better mobile scrolling */}
              <div className="h-4 lg:hidden"></div>
            </div>
          </div>
        </div>
      </div>

      {/* API Config Modal */}
      {showApiConfig && (
        <ApiConfigModal
          apiClient={apiClient}
          onClose={() => setShowApiConfig(false)}
        />
      )}
    </MobileTouchOptimizer>
  );
}

export { TeacherControlPanel };
