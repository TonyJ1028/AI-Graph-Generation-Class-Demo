'use client';

import { Image, Square } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: 'image_generation' | 'idle';
  onModeChange: (mode: 'image_generation' | 'idle') => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes = [
    {
      id: 'idle' as const,
      name: '待机模式',
      description: '等待选择互动模式',
      icon: Square,
      color: 'gray'
    },
    {
      id: 'image_generation' as const,
      name: '图像生成',
      description: 'AI图像编辑和生成',
      icon: Image,
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">互动模式</h3>

      {/* Mobile: Horizontal Layout, Desktop: Vertical Layout */}
      <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 overflow-x-auto sm:overflow-x-visible">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex-shrink-0 sm:w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left touch-manipulation min-w-[140px] sm:min-w-0 ${
                isActive
                  ? mode.color === 'blue'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-500 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 ${
                    isActive
                      ? mode.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm sm:text-base ${
                    isActive
                      ? mode.color === 'blue' ? 'text-blue-900' : 'text-gray-900'
                      : 'text-gray-900'
                  }`}>
                    {mode.name}
                  </h4>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block ${
                    isActive
                      ? mode.color === 'blue' ? 'text-blue-700' : 'text-gray-700'
                      : 'text-gray-500'
                  }`}>
                    {mode.description}
                  </p>
                </div>
                {isActive && (
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-2 flex-shrink-0 ${
                    mode.color === 'blue' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
