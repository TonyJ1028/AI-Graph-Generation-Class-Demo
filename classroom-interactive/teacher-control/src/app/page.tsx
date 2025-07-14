'use client';

import { useState, useEffect } from 'react';
import { TeacherControlPanel } from '@/components/TeacherControlPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ApiClient } from '@/lib/api';
import { WebSocketClient } from '@/lib/websocket';
import { safeReload } from '@/lib/utils';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [apiClient] = useState(() => new ApiClient());
  const [wsClient] = useState(() => new WebSocketClient());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Create session
        const newSessionId = await apiClient.createSession();
        setSessionId(newSessionId);

        // Connect WebSocket
        await wsClient.connect(newSessionId);
        setIsConnected(true);

        // Set up WebSocket event handlers
        wsClient.on('whiteboard_connected', () => {
          console.log('Whiteboard connected');
        });

        wsClient.on('whiteboard_disconnected', () => {
          console.log('Whiteboard disconnected');
        });

      } catch (err) {
        console.error('Failed to initialize session:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      }
    };

    initializeSession();

    return () => {
      wsClient.disconnect();
    };
  }, [apiClient, wsClient]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">连接错误</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={safeReload}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-blue-600">正在连接...</h1>
          <p className="text-blue-500 mt-2">正在建立与服务器的连接</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <TeacherControlPanel
        sessionId={sessionId}
        apiClient={apiClient}
        wsClient={wsClient}
      />
    </ErrorBoundary>
  );
}
