'use client';

import { useEffect, useState } from 'react';
import { Loader2, Sparkles, Brain, Zap } from 'lucide-react';

interface LoadingScreenProps {
  prompt?: string;
  model?: string;
}

export function LoadingScreen({ prompt, model }: LoadingScreenProps) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const getModelDisplayName = (modelName?: string) => {
    switch (modelName) {
      case 'gpt-image-1':
        return 'GPT Image 1';
      case 'flux-kontext-pro':
        return 'Flux Kontext Pro';
      case 'flux-kontext-max':
        return 'Flux Kontext Max';
      default:
        return modelName || 'AI模型';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl mx-auto px-8">
        {/* Loading Icon */}
        <div className="relative mb-12">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-4 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-6">
          AI正在生成{dots}
        </h1>

        {/* Model Info */}
        {model && (
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl text-yellow-400 font-medium">
              使用模型: {getModelDisplayName(model)}
            </span>
          </div>
        )}

        {/* Prompt Display */}
        {prompt && (
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-semibold text-purple-400">提示词</h3>
            </div>
            <p className="text-xl text-gray-200 leading-relaxed">
              "{prompt}"
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            处理中... {Math.round(progress)}%
          </p>
        </div>

        {/* Status Messages */}
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-lg">正在分析图像内容...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-lg">AI模型正在处理...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
            <span className="text-lg">生成高质量图像...</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 text-gray-400 text-lg">
          <p>请稍候，AI正在为您创造精彩内容</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-8 h-8 text-blue-400 opacity-60" />
      </div>
      <div className="absolute top-32 right-32 animate-bounce" style={{ animationDelay: '1s' }}>
        <Zap className="w-6 h-6 text-yellow-400 opacity-60" />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <Brain className="w-7 h-7 text-purple-400 opacity-60" />
      </div>
    </div>
  );
}
