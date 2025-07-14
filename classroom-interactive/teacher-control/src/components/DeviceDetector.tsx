'use client';

import { useState, useEffect } from 'react';
import { TeacherControlPanel } from './TeacherControlPanel';
// import { MobileTeacherInterface } from './MobileTeacherInterface';
import { ApiClient } from '@/lib/api';
import { WebSocketClient } from '@/lib/websocket';
import { Monitor, Smartphone, RotateCcw } from 'lucide-react';

interface DeviceDetectorProps {
  sessionId: string;
  apiClient: ApiClient;
  wsClient: WebSocketClient;
}

function DeviceDetector({ sessionId, apiClient, wsClient }: DeviceDetectorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceInterface, setForceInterface] = useState<'auto' | 'mobile' | 'desktop'>('auto');
  const [deviceInfo, setDeviceInfo] = useState({
    width: 0,
    height: 0,
    userAgent: '',
    touchSupport: false,
    orientation: 'portrait'
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 检测移动设备
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = width <= 768;
      const isTouchDevice = touchSupport;
      
      // 综合判断是否为移动设备
      const shouldUseMobile = isMobileDevice || (isSmallScreen && isTouchDevice);
      
      setDeviceInfo({
        width,
        height,
        userAgent,
        touchSupport,
        orientation: width > height ? 'landscape' : 'portrait'
      });
      
      setIsMobile(shouldUseMobile);
      setIsLoading(false);
    };

    // 初始检测
    detectDevice();

    // 监听窗口大小变化
    const handleResize = () => {
      detectDevice();
    };

    // 监听方向变化
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100); // 延迟检测，等待方向变化完成
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const getInterfaceType = () => {
    if (forceInterface === 'mobile') return 'mobile';
    if (forceInterface === 'desktop') return 'desktop';
    return isMobile ? 'mobile' : 'desktop';
  };

  const interfaceType = getInterfaceType();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在检测设备...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Interface Switcher - Only show on borderline devices */}
      {(deviceInfo.width > 480 && deviceInfo.width < 1024) && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-2 flex space-x-1">
          <button
            onClick={() => setForceInterface('auto')}
            className={`p-2 rounded transition-colors ${
              forceInterface === 'auto' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="自动检测"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setForceInterface('mobile')}
            className={`p-2 rounded transition-colors ${
              forceInterface === 'mobile' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="手机界面"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setForceInterface('desktop')}
            className={`p-2 rounded transition-colors ${
              forceInterface === 'desktop' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="桌面界面"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Device Info Debug Panel - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs">
          <div>界面: {interfaceType}</div>
          <div>尺寸: {deviceInfo.width}×{deviceInfo.height}</div>
          <div>触摸: {deviceInfo.touchSupport ? '是' : '否'}</div>
          <div>方向: {deviceInfo.orientation}</div>
          <div>强制: {forceInterface}</div>
        </div>
      )}

      {/* Render appropriate interface */}
      {/* Temporarily use TeacherControlPanel for all devices */}
      <TeacherControlPanel
        sessionId={sessionId}
        apiClient={apiClient}
        wsClient={wsClient}
      />

      {/* Interface Switch Notification */}
      {forceInterface !== 'auto' && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            {interfaceType === 'mobile' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            <span className="text-sm">
              {interfaceType === 'mobile' ? '手机界面' : '桌面界面'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export { DeviceDetector };
