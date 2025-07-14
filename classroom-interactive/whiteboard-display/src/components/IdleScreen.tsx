'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Monitor, Wifi } from 'lucide-react';

interface IdleScreenProps {
  teacherConnected: boolean;
  currentMode: 'idle' | 'image_generation';
}

export function IdleScreen({ teacherConnected, currentMode }: IdleScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Logo/Title */}
        <div className="mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Monitor className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">课堂互动系统</h1>
          <p className="text-2xl text-gray-300">白板显示端</p>
        </div>

        {/* Time Display */}
        <div className="mb-12">
          <div className="text-8xl font-mono font-bold text-white mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-2xl text-gray-400">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Status Information */}
        <div className="space-y-6">
          {teacherConnected ? (
            <div className="flex items-center justify-center space-x-4 text-green-400">
              <Smartphone className="w-8 h-8" />
              <span className="text-2xl font-medium">教师端已连接</span>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 text-yellow-400">
              <Smartphone className="w-8 h-8" />
              <span className="text-2xl font-medium">等待教师端连接...</span>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 text-blue-400">
            <Wifi className="w-6 h-6" />
            <span className="text-xl">系统就绪，等待互动指令</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white mb-4">使用说明</h3>
            <div className="text-left space-y-3 text-gray-300">
              <p className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span>教师在手机端选择互动模式</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span>上传图片或输入文字描述</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>AI生成结果将实时显示在此屏幕</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">4.</span>
                <span>支持全屏展示和多种互动模式</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-8 text-gray-500 text-sm">
        <p>版本 1.0.0 | 基于 Next.js + WebSocket</p>
      </div>

      <div className="absolute bottom-8 right-8 text-gray-500 text-sm text-right">
        <p>当前模式: {currentMode === 'idle' ? '待机' : '图像生成'}</p>
        <p>连接状态: {teacherConnected ? '已连接' : '未连接'}</p>
      </div>
    </div>
  );
}
