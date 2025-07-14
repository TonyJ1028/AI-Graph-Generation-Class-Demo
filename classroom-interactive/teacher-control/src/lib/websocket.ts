import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: 'mode_change' | 'image_upload' | 'text_input' | 'generation_start' | 'generation_complete' | 'generation_error';
  data: any;
  timestamp: number;
}

export class WebSocketClient {
  private socket: Socket | null = null;
  private sessionId: string = '';
  private callbacks: Map<string, (data: any) => void> = new Map();

  constructor(serverUrl?: string) {
    this.serverUrl = serverUrl || process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
  }

  private serverUrl: string;

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sessionId = sessionId;
      this.socket = io(this.serverUrl);

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.socket?.emit('join_as_teacher', sessionId);
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      this.socket.on('message', (message: WebSocketMessage) => {
        console.log('Received message:', message);
        const callback = this.callbacks.get(message.type);
        if (callback) {
          callback(message.data);
        }
      });

      this.socket.on('whiteboard_connected', (data) => {
        console.log('Whiteboard connected:', data);
        const callback = this.callbacks.get('whiteboard_connected');
        if (callback) {
          callback(data);
        }
      });

      this.socket.on('whiteboard_disconnected', (data) => {
        console.log('Whiteboard disconnected:', data);
        const callback = this.callbacks.get('whiteboard_disconnected');
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

  sendModeChange(mode: string) {
    if (this.socket && this.sessionId) {
      this.socket.emit('mode_change', {
        sessionId: this.sessionId,
        mode
      });
    }
  }

  sendGenerationRequest(data: any) {
    if (this.socket && this.sessionId) {
      this.socket.emit('generation_request', {
        sessionId: this.sessionId,
        ...data
      });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
