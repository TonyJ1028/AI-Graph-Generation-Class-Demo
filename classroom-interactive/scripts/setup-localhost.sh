#!/bin/bash

# 快速设置 localhost 配置脚本

echo "🔧 设置所有服务为 localhost 访问"
echo "================================"

# 固定配置
SERVER_IP="localhost"
BACKEND_PORT="3001"
TEACHER_PORT="3000"
WHITEBOARD_PORT="3002"
API_BASE_URL="https://api.creativone.cn"
API_KEY="sk-TaAl3AvVdLyoSMGxLk3knl35fuWOjHkPyHyTALyAuGT20bTH"

echo "📋 配置信息:"
echo "   服务器地址: ${SERVER_IP}"
echo "   后端API: http://${SERVER_IP}:${BACKEND_PORT}"
echo "   教师端: http://${SERVER_IP}:${TEACHER_PORT}"
echo "   白板端: http://${SERVER_IP}:${WHITEBOARD_PORT}"
echo ""

echo "🔄 正在更新配置文件..."

# 更新后端配置
echo "📝 更新后端配置..."
cat > backend-api/.env << EOF
# 服务器配置
PORT=${BACKEND_PORT}
NODE_ENV=development
HOST=${SERVER_IP}

# 前端应用地址配置
TEACHER_CONTROL_URL=http://${SERVER_IP}:${TEACHER_PORT}
WHITEBOARD_DISPLAY_URL=http://${SERVER_IP}:${WHITEBOARD_PORT}

# CORS配置
CORS_ORIGIN=http://${SERVER_IP}:${TEACHER_PORT},http://${SERVER_IP}:${WHITEBOARD_PORT}

# API配置
API_BASE_URL=${API_BASE_URL}
API_KEY=${API_KEY}

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=26214400

# WebSocket配置
WEBSOCKET_CORS_ORIGIN=http://${SERVER_IP}:${TEACHER_PORT},http://${SERVER_IP}:${WHITEBOARD_PORT}
EOF

# 更新教师端配置
echo "📝 更新教师端配置..."
cat > teacher-control/.env.local << EOF
# 后端API地址配置
NEXT_PUBLIC_API_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}

# WebSocket连接地址
NEXT_PUBLIC_WEBSOCKET_URL=http://${SERVER_IP}:${BACKEND_PORT}

# 白板显示端地址
NEXT_PUBLIC_WHITEBOARD_URL=http://${SERVER_IP}:${WHITEBOARD_PORT}

# 应用配置
NEXT_PUBLIC_APP_NAME=课堂互动控制台
NEXT_PUBLIC_APP_VERSION=1.0.0

# 开发模式配置
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
EOF

# 更新白板端配置
echo "📝 更新白板端配置..."
cat > whiteboard-display/.env.local << EOF
# 后端API地址配置
NEXT_PUBLIC_API_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}

# WebSocket连接地址
NEXT_PUBLIC_WEBSOCKET_URL=http://${SERVER_IP}:${BACKEND_PORT}

# 教师控制端地址
NEXT_PUBLIC_TEACHER_CONTROL_URL=http://${SERVER_IP}:${TEACHER_PORT}

# 应用配置
NEXT_PUBLIC_APP_NAME=课堂互动白板
NEXT_PUBLIC_APP_VERSION=1.0.0

# 开发模式配置
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
EOF

echo ""
echo "✅ localhost 配置完成！"
echo ""
echo "📋 配置总结:"
echo "   后端API: http://${SERVER_IP}:${BACKEND_PORT}"
echo "   教师端: http://${SERVER_IP}:${TEACHER_PORT}"
echo "   白板端: http://${SERVER_IP}:${WHITEBOARD_PORT}"
echo ""
echo "🚀 下一步操作:"
echo "   1. 启动服务: ./start-all.sh"
echo "   2. 或手动启动:"
echo "      cd backend-api && pnpm run dev"
echo "      cd teacher-control && pnpm run dev"
echo "      cd whiteboard-display && pnpm run dev"
