#!/bin/bash

# 课堂互动系统启动脚本
# 启动所有服务：后端API、教师端、白板端

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}🚀 启动课堂互动系统...${NC}"
echo -e "${BLUE}项目路径: ${PROJECT_ROOT}${NC}"

# 检查依赖
check_dependencies() {
    echo -e "${YELLOW}📋 检查依赖...${NC}"

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi

    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm 未安装${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ 依赖检查通过${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  端口 $port 已被占用，尝试终止进程...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# 执行依赖检查
check_dependencies

echo -e "${YELLOW}📋 检查端口状态...${NC}"
check_port 3001
check_port 3000
check_port 3002
echo ""

# 启动后端API
start_backend() {
    echo -e "${YELLOW}🔧 启动后端API (端口 3001)...${NC}"

    cd "${PROJECT_ROOT}/backend-api"

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装后端依赖...${NC}"
        pnpm install
    fi

    # 检查环境文件
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚙️  创建环境配置文件...${NC}"
        cp .env.example .env 2>/dev/null || echo "请手动创建 .env 文件"
    fi

    echo -e "${GREEN}✅ 后端API启动中...${NC}"
    pnpm run dev &
    BACKEND_PID=$!

    # 等待后端启动
    sleep 3
}

# 启动白板端
start_whiteboard() {
    echo -e "${YELLOW}🖼️  启动白板端 (端口 3002)...${NC}"

    cd "${PROJECT_ROOT}/whiteboard-display"

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装白板端依赖...${NC}"
        pnpm install
    fi

    echo -e "${GREEN}✅ 白板端启动中...${NC}"
    pnpm run dev &
    WHITEBOARD_PID=$!

    # 等待白板端启动
    sleep 3
}

# 启动教师端
start_teacher() {
    echo -e "${YELLOW}👨‍🏫 启动教师端 (端口 3000)...${NC}"

    cd "${PROJECT_ROOT}/teacher-control"

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装教师端依赖...${NC}"
        pnpm install
    fi

    echo -e "${GREEN}✅ 教师端启动中...${NC}"
    pnpm run dev &
    TEACHER_PID=$!

    # 等待教师端启动
    sleep 3
}

# 启动所有服务
start_backend
start_whiteboard
start_teacher

# 显示启动信息
show_info() {
    echo -e "\n${GREEN}🎉 所有服务启动完成！${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📱 教师控制端:${NC} http://localhost:3000"
    echo -e "${GREEN}🖼️  白板显示端:${NC} http://localhost:3002"
    echo -e "${GREEN}🔧 后端API:${NC}     http://localhost:3001"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}💡 使用说明:${NC}"
    echo -e "   1. 在手机或平板上打开教师控制端"
    echo -e "   2. 在大屏幕上打开白板显示端"
    echo -e "   3. 使用会话ID连接两端"
    echo -e "\n${YELLOW}⏹️  按 Ctrl+C 停止所有服务${NC}"
}

# 清理函数
cleanup() {
    echo -e "\n${YELLOW}🛑 正在停止所有服务...${NC}"

    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$WHITEBOARD_PID" ]; then
        kill $WHITEBOARD_PID 2>/dev/null || true
    fi

    if [ ! -z "$TEACHER_PID" ]; then
        kill $TEACHER_PID 2>/dev/null || true
    fi

    # 强制终止端口占用进程
    check_port 3000
    check_port 3001
    check_port 3002

    echo -e "${GREEN}✅ 所有服务已停止${NC}"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 显示信息并等待
show_info
wait
