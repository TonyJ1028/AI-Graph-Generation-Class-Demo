#!/bin/bash

# 课堂互动系统环境配置脚本

echo "🔧 课堂互动系统环境配置"
echo "======================="
echo ""

# 获取用户输入
read -p "请输入服务器IP地址 (默认: localhost): " SERVER_IP
SERVER_IP=${SERVER_IP:-localhost}

read -p "请输入后端端口 (默认: 3001): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-3001}

read -p "请输入教师端端口 (默认: 3000): " TEACHER_PORT
TEACHER_PORT=${TEACHER_PORT:-3000}

read -p "请输入白板端端口 (默认: 3002): " WHITEBOARD_PORT
WHITEBOARD_PORT=${WHITEBOARD_PORT:-3002}

read -p "请输入API Base URL (默认: https://api.creativone.cn): " API_BASE_URL
API_BASE_URL=${API_BASE_URL:-https://api.creativone.cn}

read -p "请输入API Key (默认: 使用现有密钥): " API_KEY
API_KEY=${API_KEY:-sk-TaAl3AvVdLyoSMGxLk3knl35fuWOjHkPyHyTALyAuGT20bTH}

echo ""
echo "📋 配置信息确认:"
echo "   服务器地址: ${SERVER_IP}"
echo "   后端API: http://${SERVER_IP}:${BACKEND_PORT}"
echo "   教师端: http://${SERVER_IP}:${TEACHER_PORT}"
echo "   白板端: http://${SERVER_IP}:${WHITEBOARD_PORT}"
echo "   API服务: ${API_BASE_URL}"
echo ""

read -p "确认配置? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ 配置已取消"
    exit 1
fi

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
echo "✅ 环境配置完成！"
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
echo ""
echo "🔍 验证配置:"
echo "   curl http://${SERVER_IP}:${BACKEND_PORT}/health"
echo ""
echo "📚 更多配置选项请查看: ENV-CONFIG.md"
