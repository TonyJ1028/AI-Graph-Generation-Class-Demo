# 课堂互动系统

一个基于 AI 图像生成的课堂互动系统，支持教师端控制和白板端显示。

## 🏗️ 项目结构

```
classroom-interactive/
├── backend-api/          # 后端API服务
├── teacher-control/      # 教师控制端 (Next.js)
├── whiteboard-display/   # 白板显示端 (Next.js)
├── scripts/             # 项目脚本
│   ├── start-all.sh     # 启动所有服务
│   ├── install-deps.sh  # 安装依赖
│   ├── clean.sh         # 清理项目
│   ├── setup-env.sh     # 环境配置
│   └── fix-api.sh       # API修复
└── docs/               # 项目文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装所有项目依赖
./scripts/install-deps.sh
```

### 2. 配置环境

编辑 `backend-api/.env` 文件，配置 API 密钥：

```env
# API 配置
API_BASE_URL=https://api.creativone.cn
API_KEY=your-api-key-here

# 服务端口
PORT=3001

# WebSocket 配置
WS_PORT=3001
```

### 3. 启动服务

```bash
# 启动所有服务
./scripts/start-all.sh
```

服务将在以下端口启动：
- **教师控制端**: http://localhost:3000
- **白板显示端**: http://localhost:3002
- **后端API**: http://localhost:3001

## 📱 使用说明

### 教师端操作
1. 在手机或平板上打开教师控制端
2. 选择图像生成模式
3. 上传图片并输入提示词
4. 点击生成按钮

### 白板端显示
1. 在大屏幕上打开白板显示端
2. 输入教师端提供的会话ID
3. 实时查看生成结果

## 🛠️ 开发工具

### 脚本命令

```bash
# 安装依赖
./scripts/install-deps.sh

# 启动所有服务
./scripts/start-all.sh

# 清理项目
./scripts/clean.sh [选项]
  --all      清理所有内容 (默认)
  --deps     只清理依赖
  --build    只清理构建文件
  --logs     只清理日志文件
  --uploads  只清理上传文件
  --cache    只清理缓存

# 环境配置
./scripts/setup-env.sh

# API修复
./scripts/fix-api.sh
```

### 单独启动服务

```bash
# 后端API
cd backend-api && pnpm run dev

# 教师控制端
cd teacher-control && pnpm run dev

# 白板显示端
cd whiteboard-display && pnpm run dev
```

## 🔧 技术栈

- **后端**: Node.js + Express + TypeScript + Socket.IO
- **前端**: Next.js 15 + React + TypeScript + Tailwind CSS
- **包管理**: pnpm
- **实时通信**: WebSocket
- **AI服务**: 创意云API

## 📋 功能特性

- ✅ 移动端优化的教师控制界面
- ✅ 实时WebSocket通信
- ✅ 图像上传和预览
- ✅ AI图像生成和编辑
- ✅ 会话管理
- ✅ 响应式设计
- ✅ 错误处理和重试机制

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 清理端口
   ./scripts/clean.sh
   ```

2. **依赖安装失败**
   ```bash
   # 重新安装依赖
   ./scripts/clean.sh --deps
   ./scripts/install-deps.sh
   ```

3. **API连接失败**
   ```bash
   # 检查API配置
   ./scripts/fix-api.sh
   ```

### 日志查看

- 后端日志: 在 `backend-api` 目录查看控制台输出
- 前端日志: 在浏览器开发者工具中查看

## 📚 文档

详细文档请查看 `docs/` 目录：

- [部署指南](docs/DEPLOYMENT.md)
- [API文档](docs/API-TROUBLESHOOTING.md)
- [移动端优化](docs/MOBILE-OPTIMIZATION.md)
- [环境配置](docs/ENV-CONFIG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 后记
人生中第一个完完整整写好BUG修好的TS项目，成就感满满！