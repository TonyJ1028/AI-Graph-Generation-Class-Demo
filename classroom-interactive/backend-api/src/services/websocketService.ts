import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { WebSocketMessage, ClassroomSession } from '../types';

export class WebSocketService {
  private io: SocketIOServer;
  private sessions: Map<string, ClassroomSession> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle teacher connection
      socket.on('join_as_teacher', (sessionId: string) => {
        console.log(`Teacher joined session: ${sessionId}`);
        socket.join(`session_${sessionId}`);
        
        let session = this.sessions.get(sessionId);
        if (!session) {
          session = {
            id: sessionId,
            teacherSocketId: socket.id,
            currentMode: 'idle',
            lastActivity: Date.now()
          };
        } else {
          session.teacherSocketId = socket.id;
          session.lastActivity = Date.now();
        }
        
        this.sessions.set(sessionId, session);
        
        // Notify whiteboard if connected
        socket.to(`session_${sessionId}`).emit('teacher_connected', { sessionId });
      });

      // Handle whiteboard connection
      socket.on('join_as_whiteboard', (sessionId: string) => {
        console.log(`Whiteboard joined session: ${sessionId}`);
        socket.join(`session_${sessionId}`);
        
        let session = this.sessions.get(sessionId);
        if (!session) {
          session = {
            id: sessionId,
            teacherSocketId: '',
            whiteboardSocketId: socket.id,
            currentMode: 'idle',
            lastActivity: Date.now()
          };
        } else {
          session.whiteboardSocketId = socket.id;
          session.lastActivity = Date.now();
        }
        
        this.sessions.set(sessionId, session);
        
        // Notify teacher if connected
        socket.to(`session_${sessionId}`).emit('whiteboard_connected', { sessionId });
      });

      // Handle mode changes
      socket.on('mode_change', (data: { sessionId: string; mode: string }) => {
        console.log(`Mode change in session ${data.sessionId}: ${data.mode}`);
        
        const session = this.sessions.get(data.sessionId);
        if (session) {
          session.currentMode = data.mode as any;
          session.lastActivity = Date.now();
          this.sessions.set(data.sessionId, session);
        }

        const message: WebSocketMessage = {
          type: 'mode_change',
          data: { mode: data.mode },
          timestamp: Date.now()
        };

        socket.to(`session_${data.sessionId}`).emit('message', message);
      });

      // Handle image generation requests
      socket.on('generation_request', (data: any) => {
        console.log(`Generation request in session ${data.sessionId}`);
        
        const message: WebSocketMessage = {
          type: 'generation_start',
          data,
          timestamp: Date.now()
        };

        socket.to(`session_${data.sessionId}`).emit('message', message);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Remove from sessions
        for (const [sessionId, session] of this.sessions.entries()) {
          if (session.teacherSocketId === socket.id) {
            session.teacherSocketId = '';
            socket.to(`session_${sessionId}`).emit('teacher_disconnected', { sessionId });
          }
          if (session.whiteboardSocketId === socket.id) {
            session.whiteboardSocketId = '';
            socket.to(`session_${sessionId}`).emit('whiteboard_disconnected', { sessionId });
          }
        }
      });
    });
  }

  // Broadcast message to specific session
  broadcastToSession(sessionId: string, message: WebSocketMessage) {
    this.io.to(`session_${sessionId}`).emit('message', message);
  }

  // Broadcast generation result
  broadcastGenerationResult(sessionId: string, result: any, error?: string) {
    const message: WebSocketMessage = {
      type: error ? 'generation_error' : 'generation_complete',
      data: error ? { error } : result,
      timestamp: Date.now()
    };

    this.broadcastToSession(sessionId, message);
  }

  // Get active sessions
  getActiveSessions(): ClassroomSession[] {
    return Array.from(this.sessions.values());
  }

  // Clean up inactive sessions
  cleanupInactiveSessions(maxInactiveTime: number = 30 * 60 * 1000) { // 30 minutes
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxInactiveTime) {
        this.sessions.delete(sessionId);
        console.log(`Cleaned up inactive session: ${sessionId}`);
      }
    }
  }
}
