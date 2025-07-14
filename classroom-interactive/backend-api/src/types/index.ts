export interface ImageEditRequest {
  image: Express.Multer.File | Express.Multer.File[];
  prompt: string;
  model: 'gpt-image-1' | 'flux-kontext-pro' | 'flux-kontext-max';
  mask?: Express.Multer.File;
  n?: number;
  quality?: 'high' | 'medium' | 'low' | 'auto';
  response_format?: 'url' | 'b64_json';
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '256x256' | '512x512' | 'auto';
}

export interface ImageEditResponse {
  created: number;
  data: Array<{
    b64_json?: string;
    url?: string;
  }>;
  usage: {
    total_tokens: number;
    input_tokens: number;
    output_tokens: number;
    input_tokens_details: {
      text_tokens: number;
      image_tokens: number;
    };
  };
}

export interface WebSocketMessage {
  type: 'mode_change' | 'image_upload' | 'text_input' | 'generation_start' | 'generation_complete' | 'generation_error';
  data: any;
  timestamp: number;
}

export interface ClassroomSession {
  id: string;
  teacherSocketId: string;
  whiteboardSocketId?: string;
  currentMode: 'image_generation' | 'idle';
  lastActivity: number;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

export interface GenerationRequest {
  sessionId: string;
  type: 'image_edit';
  prompt: string;
  image?: string; // base64 encoded
  model: string;
  parameters: {
    quality?: string;
    size?: string;
    n?: number;
  };
}
