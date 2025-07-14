import { Router, Request, Response } from 'express';
import { ImageService } from '../services/imageService';
import { WebSocketService } from '../services/websocketService';
import { uploadImageWithMask, cleanupFieldFiles } from '../middleware/upload';
import { ImageEditRequest } from '../types';

export function createImageRoutes(imageService: ImageService, wsService: WebSocketService): Router {
  const router = Router();

  // Image edit endpoint
  router.post('/edit', uploadImageWithMask, async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { prompt, model, n, quality, response_format, size, sessionId } = req.body;

      // Validate required fields
      if (!files?.image || files.image.length === 0) {
        cleanupFieldFiles(files);
        return res.status(400).json({ error: 'Image file is required' });
      }

      if (!prompt) {
        cleanupFieldFiles(files);
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!model) {
        cleanupFieldFiles(files);
        return res.status(400).json({ error: 'Model is required' });
      }

      // Validate model
      const supportedModels = ['gpt-image-1', 'flux-kontext-pro', 'flux-kontext-max'];
      if (!supportedModels.includes(model)) {
        cleanupFieldFiles(files);
        return res.status(400).json({ 
          error: `Unsupported model. Supported models: ${supportedModels.join(', ')}` 
        });
      }

      // Prepare request
      const imageEditRequest: ImageEditRequest = {
        image: files.image,
        prompt,
        model,
        mask: files.mask?.[0],
        n: n ? parseInt(n) : undefined,
        quality,
        response_format,
        size
      };

      // Notify WebSocket clients about generation start
      if (sessionId) {
        wsService.broadcastToSession(sessionId, {
          type: 'generation_start',
          data: { prompt, model },
          timestamp: Date.now()
        });
      }

      // Call image service
      const result = await imageService.editImage(imageEditRequest);

      // Notify WebSocket clients about completion
      if (sessionId) {
        wsService.broadcastGenerationResult(sessionId, result);
      }

      // Clean up uploaded files
      cleanupFieldFiles(files);

      res.json(result);
    } catch (error) {
      // Clean up uploaded files on error
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      cleanupFieldFiles(files);

      console.error('Image edit error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Notify WebSocket clients about error
      if (req.body.sessionId) {
        wsService.broadcastGenerationResult(req.body.sessionId, null, errorMessage);
      }

      res.status(500).json({ error: errorMessage });
    }
  });

  // API configuration endpoints
  router.post('/config', (req: Request, res: Response) => {
    try {
      const { baseUrl, apiKey } = req.body;

      if (!baseUrl || !apiKey) {
        return res.status(400).json({ error: 'baseUrl and apiKey are required' });
      }

      imageService.updateApiConfig({ baseUrl, apiKey });
      res.json({ message: 'API configuration updated successfully' });
    } catch (error) {
      console.error('Config update error:', error);
      res.status(500).json({ error: 'Failed to update configuration' });
    }
  });

  router.get('/config', (req: Request, res: Response) => {
    try {
      const config = imageService.getApiConfig();
      // Don't expose the full API key, just indicate if it's set
      res.json({
        baseUrl: config.baseUrl,
        hasApiKey: !!config.apiKey
      });
    } catch (error) {
      console.error('Config get error:', error);
      res.status(500).json({ error: 'Failed to get configuration' });
    }
  });

  return router;
}
