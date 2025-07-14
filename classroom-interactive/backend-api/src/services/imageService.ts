import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ImageEditRequest, ImageEditResponse, ApiConfig } from '../types';

export class ImageService {
  private apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  async editImage(request: ImageEditRequest): Promise<ImageEditResponse> {
    try {
      // Validate API configuration
      if (!this.apiConfig.baseUrl || !this.apiConfig.apiKey) {
        throw new Error('API配置不完整：请设置API Base URL和API Key');
      }

      console.log('Starting image edit request:', {
        baseUrl: this.apiConfig.baseUrl,
        model: request.model,
        prompt: request.prompt.substring(0, 100) + '...',
        hasApiKey: !!this.apiConfig.apiKey
      });

      const formData = new FormData();

      // Handle single or multiple images
      if (Array.isArray(request.image)) {
        // For multiple images, use the first one
        const imageFile = request.image[0];
        console.log('Adding image file:', imageFile.originalname, imageFile.size, 'bytes');
        formData.append('image', fs.createReadStream(imageFile.path), {
          filename: imageFile.originalname,
          contentType: imageFile.mimetype,
        });
      } else {
        console.log('Adding image file:', request.image.originalname, request.image.size, 'bytes');
        formData.append('image', fs.createReadStream(request.image.path), {
          filename: request.image.originalname,
          contentType: request.image.mimetype,
        });
      }

      // Add required parameters
      formData.append('prompt', request.prompt);
      formData.append('model', request.model);

      // Add optional parameters
      if (request.mask) {
        console.log('Adding mask file:', request.mask.originalname);
        formData.append('mask', fs.createReadStream(request.mask.path), {
          filename: request.mask.originalname,
          contentType: request.mask.mimetype,
        });
      }

      if (request.n) {
        formData.append('n', request.n.toString());
      }

      if (request.quality) {
        formData.append('quality', request.quality);
      }

      // Note: response_format parameter is not supported by this API
      // if (request.response_format) {
      //   formData.append('response_format', request.response_format);
      // }

      if (request.size) {
        formData.append('size', request.size);
      }

      // Construct the full API URL
      let apiUrl = this.apiConfig.baseUrl;
      // Remove trailing slash if present
      if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
      }
      // Add the correct endpoint path
      apiUrl += '/v1/images/edits';

      console.log('Making API request to:', apiUrl);

      const response = await axios.post(
        apiUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiConfig.apiKey}`,
            ...formData.getHeaders(),
          },
          timeout: 300000, // 5 minutes timeout for image generation
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log('API response received:', {
        status: response.status,
        dataLength: JSON.stringify(response.data).length
      });

      return response.data as ImageEditResponse;
    } catch (error) {
      console.error('Image edit API error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        isAxiosError: axios.isAxiosError(error),
        status: axios.isAxiosError(error) ? error.response?.status : 'N/A',
        statusText: axios.isAxiosError(error) ? error.response?.statusText : 'N/A',
        responseData: axios.isAxiosError(error) ? error.response?.data : 'N/A',
        code: axios.isAxiosError(error) ? error.code : 'N/A'
      });

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('请求超时：API服务器响应时间过长，请稍后重试');
        }
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error('网络连接失败：无法连接到API服务器，请检查网络连接和API地址');
        }
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.error?.message || error.response.statusText || '未知错误';
          throw new Error(`API错误 (${status}): ${message}`);
        }
        throw new Error(`网络错误: ${error.message}`);
      }
      throw error;
    }
  }

  updateApiConfig(config: ApiConfig) {
    this.apiConfig = config;
  }

  getApiConfig(): ApiConfig {
    return { ...this.apiConfig };
  }
}
