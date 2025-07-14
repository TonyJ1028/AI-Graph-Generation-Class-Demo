'use client';

import { useState, useEffect } from 'react';
import { WhiteboardWebSocketClient } from '@/lib/websocket';
import { StatusBar } from './StatusBar';
import { ContentDisplay } from './ContentDisplay';
import { LoadingScreen } from './LoadingScreen';

interface WhiteboardDisplayProps {
  sessionId: string;
  wsClient: WhiteboardWebSocketClient;
}

export interface DisplayContent {
  type: 'idle' | 'image_generation' | 'generation_result';
  data?: any;
  timestamp: number;
}

export function WhiteboardDisplay({ sessionId, wsClient }: WhiteboardDisplayProps) {
  const [currentMode, setCurrentMode] = useState<'idle' | 'image_generation'>('idle');
  const [content, setContent] = useState<DisplayContent>({
    type: 'idle',
    timestamp: Date.now()
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [teacherConnected, setTeacherConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  useEffect(() => {
    // Set up WebSocket event handlers
    wsClient.on('mode_change', (data) => {
      console.log('Mode changed to:', data.mode);
      setCurrentMode(data.mode);
      setContent({
        type: data.mode === 'idle' ? 'idle' : 'image_generation',
        timestamp: Date.now()
      });
      
      // Reset generation state when mode changes
      if (data.mode !== 'image_generation') {
        setIsGenerating(false);
      }
    });

    wsClient.on('generation_start', (data) => {
      console.log('Generation started:', data);
      setIsGenerating(true);
      setContent({
        type: 'image_generation',
        data: {
          status: 'generating',
          prompt: data.prompt,
          model: data.model
        },
        timestamp: Date.now()
      });
    });

    wsClient.on('generation_complete', (data) => {
      console.log('Generation completed:', data);
      setIsGenerating(false);
      setContent({
        type: 'generation_result',
        data: data,
        timestamp: Date.now()
      });
    });

    wsClient.on('generation_error', (data) => {
      console.log('Generation error:', data);
      setIsGenerating(false);
      setContent({
        type: 'generation_result',
        data: {
          error: data.error
        },
        timestamp: Date.now()
      });
    });

    wsClient.on('teacher_connected', () => {
      setTeacherConnected(true);
      setConnectionStatus('connected');
    });

    wsClient.on('teacher_disconnected', () => {
      setTeacherConnected(false);
      setConnectionStatus('disconnected');
    });

    // Check initial connection status
    setConnectionStatus(wsClient.isConnected() ? 'connected' : 'disconnected');

    return () => {
      wsClient.off('mode_change');
      wsClient.off('generation_start');
      wsClient.off('generation_complete');
      wsClient.off('generation_error');
      wsClient.off('teacher_connected');
      wsClient.off('teacher_disconnected');
    };
  }, [wsClient]);

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Status Bar */}
      <StatusBar 
        sessionId={sessionId}
        currentMode={currentMode}
        teacherConnected={teacherConnected}
        connectionStatus={connectionStatus}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {isGenerating && (
          <LoadingScreen 
            prompt={content.data?.prompt}
            model={content.data?.model}
          />
        )}
        
        {!isGenerating && (
          <ContentDisplay 
            content={content}
            currentMode={currentMode}
            teacherConnected={teacherConnected}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 px-6 py-2 text-center">
        <p className="text-gray-400 text-sm">
          课堂互动系统 - 白板显示端 | 会话: {sessionId.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
}
