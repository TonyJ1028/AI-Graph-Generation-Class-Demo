import { Router, Request, Response } from 'express';
import { WebSocketService } from '../services/websocketService';
import { v4 as uuidv4 } from 'uuid';

export function createSessionRoutes(wsService: WebSocketService): Router {
  const router = Router();

  // Create new session
  router.post('/create', (req: Request, res: Response) => {
    try {
      const sessionId = uuidv4();
      res.json({ sessionId });
    } catch (error) {
      console.error('Session creation error:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Get active sessions
  router.get('/active', (req: Request, res: Response) => {
    try {
      const sessions = wsService.getActiveSessions();
      res.json({ sessions });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Failed to get active sessions' });
    }
  });

  // Get session info
  router.get('/:sessionId', (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const sessions = wsService.getActiveSessions();
      const session = sessions.find(s => s.id === sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({ session });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({ error: 'Failed to get session' });
    }
  });

  return router;
}
