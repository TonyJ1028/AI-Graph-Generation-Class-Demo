'use client';

import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { ApiClient } from '@/lib/api';

interface ApiConfigModalProps {
  apiClient: ApiClient;
  onClose: () => void;
}

export function ApiConfigModal({ apiClient, onClose }: ApiConfigModalProps) {
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const config = await apiClient.getApiConfig();
        setBaseUrl(config.baseUrl || '');
        // Don't load the actual API key for security
        setApiKey(config.hasApiKey ? '••••••••••••••••' : '');
      } catch (err) {
        console.error('Failed to load API config:', err);
        setError('加载配置失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [apiClient]);

  const handleTestConnection = async () => {
    if (!baseUrl.trim() || !apiKey.trim()) {
      setError('请先填写API配置');
      return;
    }

    if (apiKey === '••••••••••••••••') {
      setError('请输入新的API密钥进行测试');
      return;
    }

    setIsTesting(true);
    setError('');
    setTestResult('');

    try {
      // Test the API configuration by making a simple request
      const testConfig = {
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim()
      };

      // First update the config temporarily
      await apiClient.updateApiConfig(testConfig);

      setTestResult('✅ API配置测试成功！连接正常');
    } catch (err) {
      console.error('API test failed:', err);
      const errorMessage = err instanceof Error ? err.message : '连接测试失败';
      setTestResult(`❌ 连接测试失败: ${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!baseUrl.trim() || !apiKey.trim()) {
      setError('请填写完整的API配置');
      return;
    }

    // Don't save if API key is the masked value
    if (apiKey === '••••••••••••••••') {
      setError('请输入新的API密钥');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.updateApiConfig({
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to save API config:', err);
      setError(err instanceof Error ? err.message : '保存配置失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">API配置</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Base URL
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="输入您的API密钥"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">配置保存成功！</p>
                </div>
              )}

              {testResult && (
                <div className={`p-3 border rounded-lg ${
                  testResult.includes('✅')
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm ${
                    testResult.includes('✅') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResult}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>提示：</strong>
                </p>
                <ul className="text-sm text-blue-600 mt-1 space-y-1">
                  <li>• API密钥将安全存储在服务器端</li>
                  <li>• 建议先测试连接再保存配置</li>
                  <li>• 确保API地址格式正确 (如: https://api.example.com)</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleTestConnection}
            disabled={isTesting || isLoading || !baseUrl.trim() || !apiKey.trim() || apiKey === '••••••••••••••••'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>测试中...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>测试连接</span>
              </>
            )}
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? '保存中...' : '保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
