# API调用问题诊断和修复指南

## 🚨 常见问题：超时错误 (timeout of 60000ms exceeded)

### 问题描述
用户在使用图像生成功能时遇到 "API Error: undefined - timeout of 60000ms exceeded" 错误。

### 🔍 问题分析

#### 1. 可能的原因
- **API配置错误**：Base URL或API Key不正确
- **网络连接问题**：无法连接到API服务器
- **API服务器响应慢**：图像生成需要较长时间
- **API限制**：达到请求频率限制或配额限制
- **防火墙/代理问题**：网络环境阻止API访问

#### 2. 错误类型分析
```
API Error: undefined - timeout of 60000ms exceeded
```
- `undefined` 表示没有收到HTTP状态码，通常是网络连接问题
- `timeout` 表示请求在60秒内没有收到响应

### 🛠️ 解决方案

#### 步骤1：验证API配置
1. **检查API Base URL格式**
   ```
   ✅ 正确格式: https://api.example.com
   ❌ 错误格式: api.example.com (缺少协议)
   ❌ 错误格式: https://api.example.com/ (多余的斜杠)
   ```

2. **验证API Key**
   - 确保API Key有效且未过期
   - 检查API Key权限是否包含图像编辑功能
   - 确认API Key格式正确（通常以 `sk-` 开头）

#### 步骤2：使用内置测试功能
1. 打开教师控制端 (http://localhost:3004)
2. 点击右上角设置按钮 ⚙️
3. 输入API配置信息
4. 点击 "测试连接" 按钮
5. 查看测试结果

#### 步骤3：检查网络连接
```bash
# 测试API服务器连通性
curl -I https://your-api-endpoint.com

# 检查DNS解析
nslookup your-api-endpoint.com

# 测试HTTPS连接
openssl s_client -connect your-api-endpoint.com:443
```

#### 步骤4：查看详细日志
1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 尝试图像生成操作
4. 查看详细的错误日志和网络请求信息

### 🔧 代码层面的修复

#### 1. 已实现的改进
- ✅ 增加超时时间到120秒
- ✅ 添加详细的错误日志
- ✅ 改进错误信息显示
- ✅ 添加API配置验证
- ✅ 增加连接测试功能

#### 2. 错误处理改进
```typescript
// 新的错误处理逻辑
if (error.code === 'ECONNABORTED') {
  throw new Error('请求超时：API服务器响应时间过长，请稍后重试');
}
if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
  throw new Error('网络连接失败：无法连接到API服务器，请检查网络连接和API地址');
}
```

### 📊 调试信息

#### 浏览器控制台日志
查看以下日志信息：
```
🚀 开始图像编辑请求: { model, prompt, imageCount, hasSessionId }
📎 添加图片: filename (size MB)
📤 发送请求到: API_URL
⏱️ 请求耗时: duration ms
✅ API响应成功 / ❌ 请求失败
```

#### 后端服务器日志
查看后端控制台输出：
```
Starting image edit request: { baseUrl, model, prompt, hasApiKey }
Adding image file: filename size bytes
Making API request to: full_api_url
API response received: { status, dataLength }
```

### 🎯 针对性解决方案

#### 情况1：网络连接问题
**症状**：`ENOTFOUND` 或 `ECONNREFUSED` 错误
**解决**：
1. 检查网络连接
2. 验证API Base URL
3. 检查防火墙设置
4. 尝试使用VPN

#### 情况2：API认证问题
**症状**：HTTP 401/403 错误
**解决**：
1. 重新生成API Key
2. 检查API Key权限
3. 确认API服务商账户状态

#### 情况3：API服务器响应慢
**症状**：超时错误但网络连接正常
**解决**：
1. 等待更长时间（已增加到120秒）
2. 减少图片大小
3. 简化提示词
4. 选择更快的模型

#### 情况4：API限制
**症状**：HTTP 429 错误
**解决**：
1. 等待一段时间后重试
2. 检查API配额使用情况
3. 升级API服务计划

### 🧪 测试步骤

#### 1. 基础连接测试
```bash
# 运行简单测试
cd classroom-interactive
node simple-test.js
```

#### 2. 完整功能测试
1. 启动所有服务
2. 配置真实API信息
3. 上传小尺寸图片（<1MB）
4. 使用简单提示词测试
5. 逐步增加复杂度

### 📞 获取支持

如果问题仍然存在：

1. **收集信息**：
   - 浏览器控制台完整日志
   - 后端服务器日志
   - API配置信息（隐藏密钥）
   - 网络环境描述

2. **联系支持**：
   - 提供详细的错误信息
   - 说明重现步骤
   - 附上相关日志

### 💡 预防措施

1. **定期检查**：
   - API Key有效性
   - 服务商公告
   - 网络连接状态

2. **最佳实践**：
   - 使用适当大小的图片
   - 避免过于复杂的提示词
   - 合理控制请求频率

3. **备用方案**：
   - 准备多个API服务商
   - 实现重试机制
   - 提供离线模式

---

**更新时间**: 2024年1月
**版本**: 1.0.0
