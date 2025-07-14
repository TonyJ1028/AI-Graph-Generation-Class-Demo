# 课堂互动程序

基于Next.js开发的课堂互动系统，包含教师控制端、白板显示端和后端API服务。

## 🎯 项目概述

这是一个专为课堂教学设计的AI互动系统，教师可以通过手机或平板控制端上传图片、输入提示词，AI生成的结果会实时显示在课堂大屏上，实现师生互动的数字化体验。

## 📁 项目结构

```
classroom-interactive/
├── teacher-control/     # 教师控制端 (Next.js)
├── whiteboard-display/  # 白板显示端 (Next.js)
├── backend-api/         # 后端API服务 (Node.js + Express)
├── start-all.sh         # 一键启动脚本
├── test-system.sh       # 系统测试脚本
├── DEPLOYMENT.md        # 部署指南
└── README.md
```

## ✨ 功能特性

### 教师控制端 (teacher-control)
- 📱 **移动端优化**: 支持手机触屏和桌面操作
- 🎨 **模式选择**: 图像生成等多种互动模式
- 📸 **媒体上传**: 支持图片拖拽上传，最大25MB
- ✍️ **智能输入**: 提示词输入，支持快速模板
- ⚙️ **API管理**: 安全的API密钥配置
- 👀 **实时预览**: 生成结果即时显示
- 📡 **无缝同步**: 与白板端实时数据同步

### 白板显示端 (whiteboard-display)
- 🖥️ **大屏适配**: 专为课堂投影仪/大屏设计
- 📡 **实时接收**: 自动接收控制端指令
- 🎨 **结果展示**: 高质量AI生成内容显示
- 🔄 **自动更新**: 内容实时刷新，无需手动操作
- 📺 **全屏模式**: 支持全屏展示和图片轮播
- 🎭 **美观界面**: 现代化UI设计，提升课堂体验

### 后端API服务 (backend-api)
- 🔌 **API集成**: 支持多种AI图像编辑模型
- 🌐 **实时通信**: WebSocket双向通信
- 📁 **文件处理**: 安全的文件上传和管理
- 🔐 **安全管理**: API密钥加密存储
- 🚀 **高性能**: 异步处理，支持并发请求
- 📊 **监控日志**: 完整的请求日志和错误追踪

## 🚀 快速开始

### 方式一：一键启动（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd classroom-interactive

# 2. 安装所有依赖
pnpm install --recursive

# 3. 一键启动所有服务
./start-all.sh
```

### 方式二：手动启动

```bash
# 1. 安装依赖
cd teacher-control && pnpm install
cd ../whiteboard-display && pnpm install  
cd ../backend-api && pnpm install

# 2. 启动服务（需要3个终端）
# 终端1: 后端API
cd backend-api && pnpm run dev

# 终端2: 教师控制端  
cd teacher-control && pnpm run dev

# 终端3: 白板显示端
cd whiteboard-display && pnpm run dev
```

### 3. 配置API密钥

在 `backend-api` 目录下创建 `.env` 文件：

```env
# 服务器配置
PORT=3001
NODE_ENV=development

# API配置（在控制端界面中也可配置）
API_BASE_URL=https://your-api-endpoint.com
API_KEY=your-api-key-here

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

### 4. 访问应用

- 🎮 **教师控制端**: http://localhost:3000
- 📺 **白板显示端**: http://localhost:3002  
- 🔧 **后端API**: http://localhost:3001

## 📖 使用指南

### 基本操作流程

1. **启动系统**
   ```bash
   ./start-all.sh
   ```

2. **配置API**
   - 在控制端点击设置按钮⚙️
   - 输入API Base URL和API Key
   - 保存配置

3. **开始互动**
   - 选择"图像生成"模式
   - 上传图片（支持PNG、WEBP、JPG格式）
   - 输入提示词描述想要的效果
   - 点击"开始生成"

4. **查看结果**
   - 控制端显示生成进度和结果
   - 白板端同步显示，适合课堂展示
   - 支持下载生成的图片

## 🧪 系统测试

运行完整的系统测试：

```bash
./test-system.sh
```

## 🛠️ 技术栈

### 前端技术
- **框架**: Next.js 15 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **实时通信**: Socket.IO Client

### 后端技术
- **运行时**: Node.js 18+
- **框架**: Express.js
- **实时通信**: Socket.IO
- **文件处理**: Multer
- **HTTP客户端**: Axios
- **类型支持**: TypeScript

## 🔧 API集成

### 支持的AI模型
- `gpt-image-1`: GPT图像编辑模型
- `flux-kontext-pro`: Flux Kontext Pro模型  
- `flux-kontext-max`: Flux Kontext Max模型

### API参数配置
- **质量设置**: 自动/高/中/低
- **图像尺寸**: 1024x1024, 1536x1024, 1024x1536
- **生成数量**: 1-10张图片
- **响应格式**: Base64或URL

## 📱 移动端适配

### 响应式设计
- 📱 手机端：优化触摸操作，大按钮设计
- 📟 平板端：充分利用屏幕空间
- 💻 桌面端：完整功能体验

### 触摸优化
- `touch-manipulation` CSS属性
- 增大点击区域
- 优化滑动和拖拽体验

## 🚀 部署指南

详细的生产环境部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署
```bash
# 构建所有应用
npm run build:all

# 使用PM2启动
pm2 start ecosystem.config.js
```

## 📄 许可证

本项目采用 MIT 许可证

## 🆘 支持与反馈

如果您遇到问题或有建议，请：

1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细部署指南
2. 运行 `./test-system.sh` 进行系统诊断
3. 提交 Issue 描述问题

---

**🎉 感谢使用课堂互动系统！让AI技术为教育赋能。**
