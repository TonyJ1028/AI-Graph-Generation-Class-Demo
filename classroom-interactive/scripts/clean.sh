#!/bin/bash

# 清理项目的脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}🧹 清理课堂互动系统...${NC}"
echo -e "${BLUE}项目路径: ${PROJECT_ROOT}${NC}"

# 停止所有服务
stop_services() {
    echo -e "${YELLOW}🛑 停止所有服务...${NC}"
    
    # 停止可能运行的服务
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3002 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}✅ 所有服务已停止${NC}"
}

# 清理node_modules
clean_node_modules() {
    echo -e "${YELLOW}📦 清理 node_modules...${NC}"
    
    # 后端
    if [ -d "${PROJECT_ROOT}/backend-api/node_modules" ]; then
        rm -rf "${PROJECT_ROOT}/backend-api/node_modules"
        echo -e "${GREEN}✅ 后端 node_modules 已清理${NC}"
    fi
    
    # 教师端
    if [ -d "${PROJECT_ROOT}/teacher-control/node_modules" ]; then
        rm -rf "${PROJECT_ROOT}/teacher-control/node_modules"
        echo -e "${GREEN}✅ 教师端 node_modules 已清理${NC}"
    fi
    
    # 白板端
    if [ -d "${PROJECT_ROOT}/whiteboard-display/node_modules" ]; then
        rm -rf "${PROJECT_ROOT}/whiteboard-display/node_modules"
        echo -e "${GREEN}✅ 白板端 node_modules 已清理${NC}"
    fi
}

# 清理构建文件
clean_build() {
    echo -e "${YELLOW}🏗️  清理构建文件...${NC}"
    
    # Next.js 构建文件
    rm -rf "${PROJECT_ROOT}/teacher-control/.next" 2>/dev/null || true
    rm -rf "${PROJECT_ROOT}/whiteboard-display/.next" 2>/dev/null || true
    
    # TypeScript 构建文件
    rm -rf "${PROJECT_ROOT}/backend-api/dist" 2>/dev/null || true
    
    echo -e "${GREEN}✅ 构建文件已清理${NC}"
}

# 清理日志文件
clean_logs() {
    echo -e "${YELLOW}📝 清理日志文件...${NC}"
    
    find "${PROJECT_ROOT}" -name "*.log" -type f -delete 2>/dev/null || true
    find "${PROJECT_ROOT}" -name "npm-debug.log*" -type f -delete 2>/dev/null || true
    find "${PROJECT_ROOT}" -name "yarn-debug.log*" -type f -delete 2>/dev/null || true
    find "${PROJECT_ROOT}" -name "yarn-error.log*" -type f -delete 2>/dev/null || true
    
    echo -e "${GREEN}✅ 日志文件已清理${NC}"
}

# 清理上传文件
clean_uploads() {
    echo -e "${YELLOW}📁 清理上传文件...${NC}"
    
    if [ -d "${PROJECT_ROOT}/backend-api/uploads" ]; then
        find "${PROJECT_ROOT}/backend-api/uploads" -type f ! -name ".gitkeep" -delete 2>/dev/null || true
        echo -e "${GREEN}✅ 上传文件已清理${NC}"
    fi
}

# 清理缓存
clean_cache() {
    echo -e "${YELLOW}🗂️  清理缓存...${NC}"
    
    # npm 缓存
    npm cache clean --force 2>/dev/null || true
    
    # pnpm 缓存
    pnpm store prune 2>/dev/null || true
    
    echo -e "${GREEN}✅ 缓存已清理${NC}"
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}使用方法:${NC}"
    echo -e "  $0 [选项]"
    echo -e ""
    echo -e "${BLUE}选项:${NC}"
    echo -e "  --all          清理所有内容 (默认)"
    echo -e "  --deps         只清理依赖 (node_modules)"
    echo -e "  --build        只清理构建文件"
    echo -e "  --logs         只清理日志文件"
    echo -e "  --uploads      只清理上传文件"
    echo -e "  --cache        只清理缓存"
    echo -e "  --help         显示此帮助信息"
}

# 主执行流程
main() {
    case "${1:-all}" in
        --deps)
            stop_services
            clean_node_modules
            ;;
        --build)
            stop_services
            clean_build
            ;;
        --logs)
            clean_logs
            ;;
        --uploads)
            clean_uploads
            ;;
        --cache)
            clean_cache
            ;;
        --help)
            show_help
            exit 0
            ;;
        --all|*)
            stop_services
            clean_node_modules
            clean_build
            clean_logs
            clean_uploads
            clean_cache
            ;;
    esac
    
    echo -e "\n${GREEN}🎉 清理完成！${NC}"
    echo -e "${YELLOW}💡 提示: 运行 ${GREEN}./scripts/install-deps.sh${NC} 重新安装依赖${NC}"
}

# 执行主函数
main "$@"
