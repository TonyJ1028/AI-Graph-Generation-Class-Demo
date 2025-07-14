# 环境变量配置指南

## 📁 配置文件位置

### 后端配置
**文件**: `backend-api/.env`
```env
# 服务器配置
PORT=3001
NODE_ENV=development
HOST=localhost

# 前端应用地址配置
TEACHER_CONTROL_URL=http://localhost:3000
WHITEBOARD_DISPLAY_URL=http://localhost:3002

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# API配置
API_BASE_URL=https://api.creativone.cn
API_KEY=sk-TaAl3AvVdLyoSMGxLk3knl35fuWOjHkPyHyTALyAuGT20bTH

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=26214400

# WebSocket配置
WEBSOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

### 教师端配置
**文件**: `teacher-control/.env.local`
```env
# 后端API地址配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# WebSocket连接地址
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001

# 白板显示端地址
NEXT_PUBLIC_WHITEBOARD_URL=http://localhost:3002

# 应用配置
NEXT_PUBLIC_APP_NAME=课堂互动控制台
NEXT_PUBLIC_APP_VERSION=1.0.0

# 开发模式配置
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 白板端配置
**文件**: `whiteboard-display/.env.local`
```env
# 后端API地址配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# WebSocket连接地址
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001

# 教师控制端地址
NEXT_PUBLIC_TEACHER_CONTROL_URL=http://localhost:3000

# 应用配置
NEXT_PUBLIC_APP_NAME=课堂互动白板
NEXT_PUBLIC_APP_VERSION=1.0.0

# 开发模式配置
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## 🔧 常见配置场景

### 场景1: 本地开发 (默认)
```env
# 后端
PORT=3001
TEACHER_CONTROL_URL=http://localhost:3000
WHITEBOARD_DISPLAY_URL=http://localhost:3002

# 前端
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
NEXT_PUBLIC_WHITEBOARD_URL=http://localhost:3002
```

### 场景2: 局域网部署
```env
# 后端 (假设服务器IP为192.168.1.100)
PORT=3001
TEACHER_CONTROL_URL=http://192.168.1.100:3000
WHITEBOARD_DISPLAY_URL=http://192.168.1.100:3002
CORS_ORIGIN=http://192.168.1.100:3000,http://192.168.1.100:3002

# 教师端
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.100:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://192.168.1.100:3001
NEXT_PUBLIC_WHITEBOARD_URL=http://192.168.1.100:3002

# 白板端
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.100:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://192.168.1.100:3001
NEXT_PUBLIC_TEACHER_CONTROL_URL=http://192.168.1.100:3000
```

### 场景3: 云服务器部署
```env
# 后端 (假设域名为classroom.example.com)
PORT=3001
TEACHER_CONTROL_URL=https://teacher.classroom.example.com
WHITEBOARD_DISPLAY_URL=https://whiteboard.classroom.example.com
CORS_ORIGIN=https://teacher.classroom.example.com,https://whiteboard.classroom.example.com

# 教师端
NEXT_PUBLIC_API_BASE_URL=https://api.classroom.example.com
NEXT_PUBLIC_WEBSOCKET_URL=https://api.classroom.example.com
NEXT_PUBLIC_WHITEBOARD_URL=https://whiteboard.classroom.example.com

# 白板端
NEXT_PUBLIC_API_BASE_URL=https://api.classroom.example.com
NEXT_PUBLIC_WEBSOCKET_URL=https://api.classroom.example.com
NEXT_PUBLIC_TEACHER_CONTROL_URL=https://teacher.classroom.example.com
```

### 场景4: 自定义端口
```env
# 后端
PORT=8001
TEACHER_CONTROL_URL=http://localhost:8000
WHITEBOARD_DISPLAY_URL=http://localhost:8002

# 教师端 (需要修改package.json中的dev脚本为: "next dev -p 8000")
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:8001
NEXT_PUBLIC_WHITEBOARD_URL=http://localhost:8002

# 白板端 (需要修改package.json中的dev脚本为: "next dev -p 8002")
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:8001
NEXT_PUBLIC_TEACHER_CONTROL_URL=http://localhost:8000
```

## 🚀 快速配置脚本

创建一个配置脚本来快速设置环境变量：

```bash
#!/bin/bash
# setup-env.sh

echo "🔧 课堂互动系统环境配置"
echo "======================="

read -p "请输入服务器IP地址 (默认: localhost): " SERVER_IP
SERVER_IP=${SERVER_IP:-localhost}

read -p "请输入后端端口 (默认: 3001): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-3001}

read -p "请输入教师端端口 (默认: 3000): " TEACHER_PORT
TEACHER_PORT=${TEACHER_PORT:-3000}

read -p "请输入白板端端口 (默认: 3002): " WHITEBOARD_PORT
WHITEBOARD_PORT=${WHITEBOARD_PORT:-3002}

# 更新后端配置
cat > backend-api/.env << EOF
PORT=${BACKEND_PORT}
NODE_ENV=development
HOST=${SERVER_IP}
TEACHER_CONTROL_URL=http://${SERVER_IP}:${TEACHER_PORT}
WHITEBOARD_DISPLAY_URL=http://${SERVER_IP}:${WHITEBOARD_PORT}
CORS_ORIGIN=http://${SERVER_IP}:${TEACHER_PORT},http://${SERVER_IP}:${WHITEBOARD_PORT}
API_BASE_URL=https://api.creativone.cn
API_KEY=sk-TaAl3AvVdLyoSMGxLk3knl35fuWOjHkPyHyTALyAuGT20bTH
UPLOAD_DIR=uploads
MAX_FILE_SIZE=26214400
WEBSOCKET_CORS_ORIGIN=http://${SERVER_IP}:${TEACHER_PORT},http://${SERVER_IP}:${WHITEBOARD_PORT}
EOF

# 更新教师端配置
cat > teacher-control/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}
NEXT_PUBLIC_WEBSOCKET_URL=http://${SERVER_IP}:${BACKEND_PORT}
NEXT_PUBLIC_WHITEBOARD_URL=http://${SERVER_IP}:${WHITEBOARD_PORT}
NEXT_PUBLIC_APP_NAME=课堂互动控制台
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
EOF

# 更新白板端配置
cat > whiteboard-display/.env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}
NEXT_PUBLIC_WEBSOCKET_URL=http://${SERVER_IP}:${BACKEND_PORT}
NEXT_PUBLIC_TEACHER_CONTROL_URL=http://${SERVER_IP}:${TEACHER_PORT}
NEXT_PUBLIC_APP_NAME=课堂互动白板
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
EOF

echo "✅ 环境配置完成！"
echo "📋 配置信息:"
echo "   服务器地址: ${SERVER_IP}"
echo "   后端API: http://${SERVER_IP}:${BACKEND_PORT}"
echo "   教师端: http://${SERVER_IP}:${TEACHER_PORT}"
echo "   白板端: http://${SERVER_IP}:${WHITEBOARD_PORT}"
echo ""
echo "🚀 启动服务: ./start-all.sh"
```

## 📝 配置说明

### 环境变量说明

#### 后端环境变量
- `PORT`: 后端服务端口
- `HOST`: 服务器主机地址
- `CORS_ORIGIN`: 允许的跨域来源
- `API_BASE_URL`: 外部API服务地址
- `API_KEY`: API密钥

#### 前端环境变量 (Next.js)
- `NEXT_PUBLIC_*`: 客户端可访问的环境变量
- `NEXT_PUBLIC_API_BASE_URL`: 后端API地址
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket连接地址
- `NEXT_PUBLIC_WHITEBOARD_URL`: 白板端地址

### 注意事项

1. **前端环境变量必须以 `NEXT_PUBLIC_` 开头**才能在客户端访问
2. **修改环境变量后需要重启服务**才能生效
3. **CORS配置必须包含所有前端地址**，否则会出现跨域错误
4. **生产环境建议使用HTTPS**协议

### 验证配置

修改配置后，可以通过以下方式验证：

```bash
# 检查环境变量是否正确加载
node -e "require('dotenv').config({path:'backend-api/.env'}); console.log(process.env.PORT)"

# 测试连接
curl http://localhost:3001/health
```

---

**配置完成后，记得重启所有服务以应用新的环境变量！**
