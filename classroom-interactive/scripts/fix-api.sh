#!/bin/bash

# API问题快速修复脚本

echo "🔧 课堂互动系统 - API问题诊断和修复"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_service() {
    local service_name="$1"
    local port="$2"
    local url="http://localhost:$port"
    
    echo -n "检查 $service_name (端口 $port)... "
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 运行中${NC}"
        return 0
    else
        echo -e "${RED}❌ 未运行${NC}"
        return 1
    fi
}

# 测试API连接
test_api_connection() {
    local base_url="$1"
    local api_key="$2"
    
    echo "测试API连接: $base_url"
    
    # 简单的连通性测试
    if curl -s --connect-timeout 10 "$base_url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API服务器可达${NC}"
        return 0
    else
        echo -e "${RED}❌ API服务器不可达${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 步骤1: 检查服务状态${NC}"
echo "------------------------"

# 检查后端服务
if check_service "后端API" "3001"; then
    BACKEND_OK=true
else
    BACKEND_OK=false
    echo -e "${YELLOW}💡 启动后端服务: cd backend-api && pnpm run dev${NC}"
fi

# 检查前端服务
if check_service "教师控制端" "3000"; then
    FRONTEND_OK=true
elif check_service "教师控制端" "3004"; then
    FRONTEND_OK=true
    echo -e "${YELLOW}ℹ️  前端运行在端口3004${NC}"
else
    FRONTEND_OK=false
    echo -e "${YELLOW}💡 启动前端服务: cd teacher-control && pnpm run dev${NC}"
fi

echo ""

if [ "$BACKEND_OK" = true ]; then
    echo -e "${BLUE}📋 步骤2: 测试后端API${NC}"
    echo "------------------------"
    
    # 测试健康检查
    echo -n "健康检查... "
    if curl -s http://localhost:3001/health | grep -q "ok"; then
        echo -e "${GREEN}✅ 正常${NC}"
    else
        echo -e "${RED}❌ 异常${NC}"
    fi
    
    # 测试会话创建
    echo -n "会话创建... "
    if curl -s -X POST http://localhost:3001/api/sessions/create | grep -q "sessionId"; then
        echo -e "${GREEN}✅ 正常${NC}"
    else
        echo -e "${RED}❌ 异常${NC}"
    fi
    
    # 测试API配置
    echo -n "API配置... "
    if curl -s http://localhost:3001/api/images/config | grep -q "baseUrl"; then
        echo -e "${GREEN}✅ 正常${NC}"
    else
        echo -e "${RED}❌ 异常${NC}"
    fi
    
    echo ""
fi

echo -e "${BLUE}📋 步骤3: 网络诊断${NC}"
echo "------------------------"

# 检查常见API服务器
echo "测试常见API服务器连通性:"

api_servers=(
    "https://api.openai.com"
    "https://api.anthropic.com"
    "https://api.cohere.ai"
)

for server in "${api_servers[@]}"; do
    echo -n "  $server... "
    if curl -s --connect-timeout 5 "$server" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 可达${NC}"
    else
        echo -e "${RED}❌ 不可达${NC}"
    fi
done

echo ""

echo -e "${BLUE}📋 步骤4: 常见问题解决方案${NC}"
echo "------------------------"

echo -e "${YELLOW}🔧 超时错误解决方案:${NC}"
echo "1. 检查API Base URL格式 (必须包含 https://)"
echo "2. 验证API Key有效性"
echo "3. 检查网络连接和防火墙设置"
echo "4. 尝试使用较小的图片文件 (<5MB)"
echo "5. 简化提示词内容"
echo ""

echo -e "${YELLOW}🔧 连接错误解决方案:${NC}"
echo "1. 确认API服务商服务状态"
echo "2. 检查DNS解析: nslookup your-api-domain.com"
echo "3. 测试HTTPS连接: curl -I https://your-api-domain.com"
echo "4. 尝试使用VPN或更换网络环境"
echo ""

echo -e "${YELLOW}🔧 认证错误解决方案:${NC}"
echo "1. 重新生成API Key"
echo "2. 检查API Key权限设置"
echo "3. 确认账户余额和配额"
echo "4. 联系API服务商技术支持"
echo ""

echo -e "${BLUE}📋 步骤5: 推荐操作${NC}"
echo "------------------------"

if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    echo -e "${GREEN}✅ 所有服务正常运行${NC}"
    echo ""
    echo "🎯 下一步操作:"
    echo "1. 打开浏览器访问: http://localhost:3000 或 http://localhost:3004"
    echo "2. 点击右上角设置按钮 ⚙️"
    echo "3. 输入真实的API配置信息"
    echo "4. 点击 '测试连接' 按钮验证配置"
    echo "5. 保存配置并开始使用"
else
    echo -e "${RED}❌ 部分服务未运行${NC}"
    echo ""
    echo "🚀 启动所有服务:"
    echo "   ./start-all.sh"
    echo ""
    echo "或手动启动:"
    if [ "$BACKEND_OK" = false ]; then
        echo "   cd backend-api && pnpm run dev"
    fi
    if [ "$FRONTEND_OK" = false ]; then
        echo "   cd teacher-control && pnpm run dev"
    fi
fi

echo ""
echo -e "${BLUE}📚 更多帮助${NC}"
echo "------------------------"
echo "📖 详细故障排除指南: cat API-TROUBLESHOOTING.md"
echo "🧪 运行完整测试: node simple-test.js"
echo "🔍 查看系统状态: ./test-system.sh"
echo ""

echo -e "${GREEN}🎉 诊断完成！${NC}"
echo "如果问题仍然存在，请查看 API-TROUBLESHOOTING.md 获取详细解决方案。"
