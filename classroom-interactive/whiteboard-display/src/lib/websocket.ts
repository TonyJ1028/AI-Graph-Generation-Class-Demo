import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: 'mode_change' | 'image_upload' | 'text_input' | 'generation_start' | 'generation_complete' | 'generation_error';
  data: any;
  timestamp: number;
}

export class WhiteboardWebSocketClient {
  private socket: Socket | null = null;
  private sessionId: string = '';
  private callbacks: Map<string, (data: any) => void> = new Map();
  private serverUrl: string;

  constructor(serverUrl?: string) {
    this.serverUrl = serverUrl || process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
  }

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sessionId = sessionId;
      this.socket = io(this.serverUrl);

      this.socket.on('connect', () => {
        console.log('Whiteboard connected to WebSocket server');
        this.socket?.emit('join_as_whiteboard', sessionId);
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Whiteboard WebSocket connection error:', error);
        reject(error);
      });

      this.socket.on('message', (message: WebSocketMessage) => {
        console.log('Whiteboard received message:', message);
        const callback = this.callbacks.get(message.type);
        if (callback) {
          callback(message.data);
        }
      });

      this.socket.on('teacher_connected', (data) => {
        console.log('Teacher connected:', data);
        const callback = this.callbacks.get('teacher_connected');
        if (callback) {
          callback(data);
        }
      });

      this.socket.on('teacher_disconnected', (data) => {
        console.log('Teacher disconnected:', data);
        const callback = this.callbacks.get('teacher_disconnected');
        if (callback) {
          callback(data);
        }
      });

      // Handle general messages from backend
      this.socket.on('message', (message) => {
        console.log('Received message:', message);
        const callback = this.callbacks.get(message.type);
        if (callback) {
          callback(message.data);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.callbacks.set(event, callback);
  }

  off(event: string) {
    this.callbacks.delete(event);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
