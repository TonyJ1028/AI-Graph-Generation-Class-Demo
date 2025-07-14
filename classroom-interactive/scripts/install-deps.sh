#!/bin/bash

# 安装所有项目依赖的脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}📦 安装课堂互动系统依赖...${NC}"
echo -e "${BLUE}项目路径: ${PROJECT_ROOT}${NC}"

# 检查依赖
check_dependencies() {
    echo -e "${YELLOW}📋 检查系统依赖...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        echo -e "${YELLOW}请访问 https://nodejs.org 安装 Node.js${NC}"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}⚠️  pnpm 未安装，正在安装...${NC}"
        npm install -g pnpm
    fi
    
    echo -e "${GREEN}✅ 系统依赖检查通过${NC}"
}

# 安装后端依赖
install_backend() {
    echo -e "${YELLOW}🔧 安装后端API依赖...${NC}"
    cd "${PROJECT_ROOT}/backend-api"
    
    if [ -f "package.json" ]; then
        pnpm install
        echo -e "${GREEN}✅ 后端依赖安装完成${NC}"
    else
        echo -e "${RED}❌ 后端package.json不存在${NC}"
        exit 1
    fi
}

# 安装教师端依赖
install_teacher() {
    echo -e "${YELLOW}👨‍🏫 安装教师端依赖...${NC}"
    cd "${PROJECT_ROOT}/teacher-control"
    
    if [ -f "package.json" ]; then
        pnpm install
        echo -e "${GREEN}✅ 教师端依赖安装完成${NC}"
    else
        echo -e "${RED}❌ 教师端package.json不存在${NC}"
        exit 1
    fi
}

# 安装白板端依赖
install_whiteboard() {
    echo -e "${YELLOW}🖼️  安装白板端依赖...${NC}"
    cd "${PROJECT_ROOT}/whiteboard-display"
    
    if [ -f "package.json" ]; then
        pnpm install
        echo -e "${GREEN}✅ 白板端依赖安装完成${NC}"
    else
        echo -e "${RED}❌ 白板端package.json不存在${NC}"
        exit 1
    fi
}

# 创建环境配置文件
setup_env() {
    echo -e "${YELLOW}⚙️  设置环境配置...${NC}"
    
    # 后端环境配置
    if [ ! -f "${PROJECT_ROOT}/backend-api/.env" ]; then
        if [ -f "${PROJECT_ROOT}/backend-api/.env.example" ]; then
            cp "${PROJECT_ROOT}/backend-api/.env.example" "${PROJECT_ROOT}/backend-api/.env"
            echo -e "${GREEN}✅ 后端环境配置文件已创建${NC}"
        else
            echo -e "${YELLOW}⚠️  请手动创建后端 .env 文件${NC}"
        fi
    fi
    
    # 教师端环境配置
    if [ ! -f "${PROJECT_ROOT}/teacher-control/.env.local" ]; then
        if [ -f "${PROJECT_ROOT}/teacher-control/.env.example" ]; then
            cp "${PROJECT_ROOT}/teacher-control/.env.example" "${PROJECT_ROOT}/teacher-control/.env.local"
            echo -e "${GREEN}✅ 教师端环境配置文件已创建${NC}"
        fi
    fi
    
    # 白板端环境配置
    if [ ! -f "${PROJECT_ROOT}/whiteboard-display/.env.local" ]; then
        if [ -f "${PROJECT_ROOT}/whiteboard-display/.env.example" ]; then
            cp "${PROJECT_ROOT}/whiteboard-display/.env.example" "${PROJECT_ROOT}/whiteboard-display/.env.local"
            echo -e "${GREEN}✅ 白板端环境配置文件已创建${NC}"
        fi
    fi
}

# 主执行流程
main() {
    check_dependencies
    install_backend
    install_teacher
    install_whiteboard
    setup_env
    
    echo -e "\n${GREEN}🎉 所有依赖安装完成！${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 下一步:${NC}"
    echo -e "   1. 配置 API 密钥 (在 backend-api/.env 中)"
    echo -e "   2. 运行 ${GREEN}./scripts/start-all.sh${NC} 启动所有服务"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 执行主函数
main
