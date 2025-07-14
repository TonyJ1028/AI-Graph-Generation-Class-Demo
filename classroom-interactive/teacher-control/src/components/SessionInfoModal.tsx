'use client';

import { useState } from 'react';
import { X, Copy, Monitor, Smartphone, Wifi, ExternalLink, QrCode } from 'lucide-react';

interface SessionInfoModalProps {
  sessionId: string;
  isConnected: boolean;
  onClose: () => void;
}

function SessionInfoModal({ sessionId, isConnected, onClose }: SessionInfoModalProps) {
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const whiteboardBaseUrl = process.env.NEXT_PUBLIC_WHITEBOARD_URL || 'http://localhost:3002';
  const whiteboardUrl = `${whiteboardBaseUrl}?session=${sessionId}`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type}已复制到剪贴板`);
      setTimeout(() => setCopyFeedback(''), 3000);
    } catch {
      setCopyFeedback('复制失败，请手动复制');
      setTimeout(() => setCopyFeedback(''), 3000);
    }
  };

  const openWhiteboard = () => {
    window.open(whiteboardUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">会话信息</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Connection Status */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {isConnected ? '已连接到服务器' : '未连接到服务器'}
              </p>
              <p className="text-xs text-gray-600">
                {isConnected ? 'WebSocket连接正常' : '请检查网络连接'}
              </p>
            </div>
            <Wifi className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          </div>

          {/* Session ID */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">会话ID</h3>
              <button
                onClick={() => copyToClipboard(sessionId, '会话ID')}
                className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors touch-manipulation"
              >
                <Copy className="w-3 h-3" />
                <span>复制</span>
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm font-mono break-all text-gray-800">{sessionId}</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              此ID用于连接白板端，请妥善保存
            </p>
          </div>

          {/* Whiteboard URL */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">白板端链接</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(whiteboardUrl, '白板端链接')}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors touch-manipulation"
                >
                  <Copy className="w-3 h-3" />
                  <span>复制</span>
                </button>
                <button
                  onClick={openWhiteboard}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors touch-manipulation"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>打开</span>
                </button>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs break-all text-gray-800">{whiteboardUrl}</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              在电脑浏览器中打开此链接即可显示白板
            </p>
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">二维码</p>
            <p className="text-xs text-gray-500">
              扫描二维码快速在其他设备打开白板端<br />
              (功能开发中)
            </p>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              使用说明
            </h4>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-start space-x-2">
                <span className="font-semibold">1.</span>
                <span>复制上方的会话ID或白板端链接</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">2.</span>
                <span>在电脑浏览器中访问白板端地址</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">3.</span>
                <span>输入会话ID或直接使用完整链接</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold">4.</span>
                <span>手机端和电脑端将自动同步显示</span>
              </div>
            </div>
          </div>

          {/* Device Requirements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              网络要求
            </h4>
            <div className="space-y-1 text-xs text-yellow-700">
              <p>• 确保手机和电脑在同一WiFi网络</p>
              <p>• 或使用公网IP地址进行远程访问</p>
              <p>• 建议使用Chrome、Safari等现代浏览器</p>
              <p>• 确保网络连接稳定以获得最佳体验</p>
            </div>
          </div>

          {/* Copy Feedback */}
          {copyFeedback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 text-center">✓ {copyFeedback}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors touch-manipulation font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export { SessionInfoModal };
