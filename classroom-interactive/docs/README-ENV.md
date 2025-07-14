# 🔧 环境变量配置指南

## ✅ 配置完成状态

环境变量配置已完成并可正常使用！

### 📊 当前配置状态
```
✅ 后端环境变量: backend-api/.env (11个变量)
✅ 教师端环境变量: teacher-control/.env.local  
✅ 白板端环境变量: whiteboard-display/.env.local
✅ 配置一致性: 所有地址配置匹配
✅ 服务集成: 代码已更新使用环境变量
```

## 📁 配置文件结构

```
classroom-interactive/
├── backend-api/.env                    # 后端配置
├── teacher-control/.env.local          # 教师端配置  
├── whiteboard-display/.env.local       # 白板端配置
├── .env.example                        # 配置示例
├── setup-env.sh                        # 快速配置脚本
└── ENV-CONFIG.md                       # 详细配置文档
```

## 🚀 快速使用

### 方式1: 使用默认配置（推荐）
当前配置已优化，可直接使用：
```bash
# 启动所有服务
./start-all.sh

# 访问地址
# 教师端: http://localhost:3000
# 白板端: http://localhost:3002  
# 后端API: http://localhost:3001
```

### 方式2: 自定义配置
```bash
# 运行配置脚本
./setup-env.sh

# 按提示输入:
# - 服务器IP (如: 192.168.1.100)
# - 端口号 (默认: 3000, 3001, 3002)
# - API配置

# 重启服务应用配置
./start-all.sh
```

### 方式3: 手动编辑
```bash
# 编辑后端配置
nano backend-api/.env

# 编辑前端配置
nano teacher-control/.env.local
nano whiteboard-display/.env.local

# 重启服务
./start-all.sh
```

## 🔍 配置验证

### 检查配置状态
```bash
node simple-env-test.js
```

### 验证服务连接
```bash
# 检查后端
curl http://localhost:3001/health

# 检查前端
curl http://localhost:3000
curl http://localhost:3002
```

## 📋 关键配置项

### 后端配置 (backend-api/.env)
```env
# 服务器配置
PORT=3001                                    # 后端端口
HOST=localhost                               # 服务器地址

# 前端地址配置  
TEACHER_CONTROL_URL=http://localhost:3000    # 教师端地址
WHITEBOARD_DISPLAY_URL=http://localhost:3002 # 白板端地址

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# API配置
API_BASE_URL=https://api.creativone.cn       # 外部API地址
API_KEY=your-api-key-here                    # API密钥
```

### 前端配置 (.env.local)
```env
# API连接配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001      # 后端API地址
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001     # WebSocket地址
NEXT_PUBLIC_WHITEBOARD_URL=http://localhost:3002    # 白板端地址 (仅教师端)
```

## 🌐 常见部署场景

### 本地开发 (默认)
```env
# 所有服务运行在localhost
PORT=3001
TEACHER_CONTROL_URL=http://localhost:3000
WHITEBOARD_DISPLAY_URL=http://localhost:3002
```

### 局域网部署
```env
# 替换为实际服务器IP
PORT=3001
TEACHER_CONTROL_URL=http://192.168.1.100:3000
WHITEBOARD_DISPLAY_URL=http://192.168.1.100:3002
CORS_ORIGIN=http://192.168.1.100:3000,http://192.168.1.100:3002
```

### 云服务器部署
```env
# 使用域名和HTTPS
TEACHER_CONTROL_URL=https://teacher.example.com
WHITEBOARD_DISPLAY_URL=https://whiteboard.example.com
CORS_ORIGIN=https://teacher.example.com,https://whiteboard.example.com
```

## 🔧 代码集成

环境变量已集成到以下代码中：

### 后端集成
- ✅ CORS配置自动读取 `CORS_ORIGIN`
- ✅ 端口配置使用 `PORT` 环境变量
- ✅ API配置使用 `API_BASE_URL` 和 `API_KEY`

### 前端集成
- ✅ API客户端自动使用 `NEXT_PUBLIC_API_BASE_URL`
- ✅ WebSocket客户端使用 `NEXT_PUBLIC_WEBSOCKET_URL`  
- ✅ 白板链接生成使用 `NEXT_PUBLIC_WHITEBOARD_URL`

## ⚠️ 重要注意事项

### 1. 环境变量前缀
- **后端**: 直接使用变量名 (如: `PORT`)
- **前端**: 必须以 `NEXT_PUBLIC_` 开头 (如: `NEXT_PUBLIC_API_BASE_URL`)

### 2. 修改后重启
修改环境变量后必须重启对应服务才能生效：
```bash
# 重启所有服务
./start-all.sh

# 或单独重启
cd backend-api && pnpm run dev
cd teacher-control && pnpm run dev  
cd whiteboard-display && pnpm run dev
```

### 3. CORS配置
确保 `CORS_ORIGIN` 包含所有前端地址，否则会出现跨域错误。

### 4. API密钥安全
- 生产环境不要将 `.env` 文件提交到版本控制
- 使用 `.env.example` 作为配置模板

## 🛠️ 故障排除

### 配置不生效
```bash
# 1. 检查文件是否存在
ls -la backend-api/.env
ls -la teacher-control/.env.local
ls -la whiteboard-display/.env.local

# 2. 验证配置内容
node simple-env-test.js

# 3. 重启所有服务
./start-all.sh
```

### 连接失败
```bash
# 检查端口是否被占用
lsof -i:3000,3001,3002

# 检查防火墙设置
# 确保端口3000,3001,3002可访问

# 检查CORS配置
# 确保前端地址在CORS_ORIGIN中
```

### 跨域错误
```bash
# 检查CORS配置
grep CORS_ORIGIN backend-api/.env

# 确保包含所有前端地址
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

## 📞 技术支持

### 配置工具
- `./setup-env.sh` - 交互式配置脚本
- `node simple-env-test.js` - 配置验证工具
- `ENV-CONFIG.md` - 详细配置文档

### 示例文件
- `.env.example` - 完整配置示例
- 各子目录的 `.env` 文件 - 当前配置

---

## 🎉 配置完成

**环境变量配置已完成并可正常使用！**

- ✅ **灵活配置**: 可轻松修改服务地址和端口
- ✅ **多场景支持**: 本地开发、局域网、云服务器
- ✅ **自动化工具**: 提供配置脚本和验证工具
- ✅ **代码集成**: 所有组件已使用环境变量

现在您可以根据需要修改 `.env` 文件来调整访问地址！
