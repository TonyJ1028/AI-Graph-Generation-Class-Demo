'use client';

import { useState, useEffect } from 'react';
import { WhiteboardDisplay } from '@/components/WhiteboardDisplay';
import { WhiteboardWebSocketClient } from '@/lib/websocket';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [wsClient] = useState(() => new WhiteboardWebSocketClient());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get session ID from URL parameters or use a default one
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');

    if (urlSessionId) {
      setSessionId(urlSessionId);
    } else {
      // For demo purposes, use a default session ID
      // In production, this should be provided by the teacher
      setSessionId('demo-session-' + Date.now());
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const connectWebSocket = async () => {
      try {
        await wsClient.connect(sessionId);
        setIsConnected(true);

        // Set up WebSocket event handlers
        wsClient.on('teacher_connected', () => {
          console.log('Teacher connected to session');
        });

        wsClient.on('teacher_disconnected', () => {
          console.log('Teacher disconnected from session');
        });

      } catch (err) {
        console.error('Failed to connect to WebSocket:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to server');
      }
    };

    connectWebSocket();

    return () => {
      wsClient.disconnect();
    };
  }, [sessionId, wsClient]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">连接错误</h1>
          <p className="text-red-500 mb-6 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg"
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-blue-600 mb-2">正在连接服务器...</h1>
          <p className="text-blue-500 text-lg">等待教师端连接</p>
          {sessionId && (
            <p className="text-blue-400 mt-4 text-sm">会话ID: {sessionId}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <WhiteboardDisplay
        sessionId={sessionId}
        wsClient={wsClient}
      />
    </div>
  );
}
