'use client';

import { DisplayContent } from './WhiteboardDisplay';
import { IdleScreen } from './IdleScreen';
import { GenerationResult } from './GenerationResult';

interface ContentDisplayProps {
  content: DisplayContent;
  currentMode: 'idle' | 'image_generation';
  teacherConnected: boolean;
}

export function ContentDisplay({ content, currentMode, teacherConnected }: ContentDisplayProps) {
  const renderContent = () => {
    switch (content.type) {
      case 'idle':
        return (
          <IdleScreen 
            teacherConnected={teacherConnected}
            currentMode={currentMode}
          />
        );

      case 'image_generation':
        if (content.data?.status === 'generating') {
          // This case is handled by LoadingScreen in parent component
          return null;
        }
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">图像生成模式</h2>
              <p className="text-xl text-gray-300">等待教师上传图片和输入提示词</p>
            </div>
          </div>
        );

      case 'generation_result':
        return (
          <GenerationResult 
            result={content.data}
            timestamp={content.timestamp}
          />
        );

      default:
        return (
          <IdleScreen 
            teacherConnected={teacherConnected}
            currentMode={currentMode}
          />
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderContent()}
    </div>
  );
}
