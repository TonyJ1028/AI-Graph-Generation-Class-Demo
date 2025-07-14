export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ImageEditRequest {
  image: File | File[];
  prompt: string;
  model: 'gpt-image-1' | 'flux-kontext-pro' | 'flux-kontext-max';
  mask?: File;
  n?: number;
  quality?: 'high' | 'medium' | 'low' | 'auto';
  // response_format?: 'url' | 'b64_json'; // 不被此API支持，已移除
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '256x256' | '512x512' | 'auto';
  sessionId?: string;
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

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }

  async createSession(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/sessions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sessionId;
  }

  async updateApiConfig(config: ApiConfig): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/images/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update API config: ${response.statusText}`);
    }
  }

  async getApiConfig(): Promise<{ baseUrl: string; hasApiKey: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/images/config`);

    if (!response.ok) {
      throw new Error(`Failed to get API config: ${response.statusText}`);
    }

    return response.json();
  }

  async editImage(request: ImageEditRequest): Promise<ImageEditResponse> {
    console.log('🚀 开始图像编辑请求:', {
      model: request.model,
      prompt: request.prompt.substring(0, 50) + '...',
      imageCount: Array.isArray(request.image) ? request.image.length : 1,
      hasSessionId: !!request.sessionId
    });

    const formData = new FormData();

    // Handle single or multiple images
    if (Array.isArray(request.image)) {
      request.image.forEach((img, index) => {
        console.log(`📎 添加图片 ${index + 1}:`, img.name, `(${(img.size / 1024 / 1024).toFixed(2)}MB)`);
        formData.append('image', img);
      });
    } else {
      console.log('📎 添加图片:', request.image.name, `(${(request.image.size / 1024 / 1024).toFixed(2)}MB)`);
      formData.append('image', request.image);
    }

    formData.append('prompt', request.prompt);
    formData.append('model', request.model);

    if (request.mask) {
      console.log('🎭 添加遮罩:', request.mask.name);
      formData.append('mask', request.mask);
    }

    if (request.n) {
      formData.append('n', request.n.toString());
    }

    if (request.quality) {
      formData.append('quality', request.quality);
    }

    // response_format 参数不被此API支持，已移除
    // if (request.response_format) {
    //   formData.append('response_format', request.response_format);
    // }

    if (request.size) {
      formData.append('size', request.size);
    }

    if (request.sessionId) {
      formData.append('sessionId', request.sessionId);
    }

    console.log('📤 发送请求到:', `${this.baseUrl}/api/images/edit`);
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/images/edit`, {
        method: 'POST',
        body: formData,
      });

      const duration = Date.now() - startTime;
      console.log(`⏱️ 请求耗时: ${duration}ms`);

      if (!response.ok) {
        console.error('❌ API响应错误:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('📄 错误详情:', errorData);
        } catch (e) {
          console.error('📄 无法解析错误响应');
        }

        // 提供用户友好的错误信息
        if (response.status === 401) {
          throw new Error('API密钥无效，请检查您的API配置');
        } else if (response.status === 403) {
          throw new Error('API访问被拒绝，请检查API密钥权限');
        } else if (response.status === 404) {
          throw new Error('API端点不存在，请检查API Base URL配置');
        } else if (response.status === 429) {
          throw new Error('API请求频率过高，请稍后重试');
        } else if (response.status >= 500) {
          throw new Error('API服务器内部错误，请稍后重试');
        } else {
          throw new Error(errorMessage);
        }
      }

      console.log('✅ API响应成功:', {
        status: response.status,
        contentType: response.headers.get('content-type')
      });

      const result = await response.json();
      console.log('📊 响应数据:', {
        created: result.created,
        dataCount: result.data?.length || 0,
        hasUsage: !!result.usage
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ 请求失败:', {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接和后端服务状态');
      }

      throw error;
    }
  }

  async getHealth(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}
