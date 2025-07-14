'use client';

import { Wifi, WifiOff, User, UserX, Image, Square, Loader2 } from 'lucide-react';

interface StatusBarProps {
  sessionId: string;
  currentMode: 'idle' | 'image_generation';
  teacherConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  isGenerating: boolean;
}

export function StatusBar({ 
  sessionId, 
  currentMode, 
  teacherConnected, 
  connectionStatus,
  isGenerating 
}: StatusBarProps) {
  const getModeInfo = () => {
    switch (currentMode) {
      case 'image_generation':
        return {
          icon: Image,
          name: '图像生成模式',
          color: 'text-blue-400'
        };
      default:
        return {
          icon: Square,
          name: '待机模式',
          color: 'text-gray-400'
        };
    }
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Mode and Generation Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ModeIcon className={`w-5 h-5 ${modeInfo.color}`} />
            <span className={`font-medium ${modeInfo.color}`}>
              {modeInfo.name}
            </span>
          </div>

          {isGenerating && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">正在生成...</span>
            </div>
          )}
        </div>

        {/* Center: Session Info */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">课堂互动白板</h1>
          <p className="text-sm text-gray-400">会话 ID: {sessionId.slice(0, 8)}...</p>
        </div>

        {/* Right: Connection Status */}
        <div className="flex items-center space-x-4">
          {/* Teacher Connection */}
          <div className="flex items-center space-x-2">
            {teacherConnected ? (
              <>
                <User className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">教师已连接</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">等待教师连接</span>
              </>
            )}
          </div>

          {/* Network Connection */}
          <div className="flex items-center space-x-2">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">已连接</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-sm text-yellow-400">连接中</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">连接断开</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
