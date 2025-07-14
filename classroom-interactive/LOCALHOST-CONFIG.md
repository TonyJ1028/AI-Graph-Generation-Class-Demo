# Localhost 配置说明

## 问题解决总结

### 1. 字体加载问题
**问题**: Geist Mono 字体从 Google Fonts 加载失败
**解决方案**:
- 添加字体预连接配置
- 配置字体回退机制
- 优化 Next.js 字体加载设置

### 2. 访问地址配置
**问题**: setup-env.sh 脚本无法正确修改访问地址
**解决方案**:
- 改进了 setup-env.sh 脚本，添加自动配置模式
- 创建了快速配置脚本 setup-localhost.sh
- 手动更新了所有配置文件

## 当前配置

### 服务地址
- **后端API**: http://localhost:3001
- **教师控制端**: http://localhost:3000
- **白板显示端**: http://localhost:3002

### 配置文件
1. `backend-api/.env` - 后端服务配置
2. `teacher-control/.env.local` - 教师端配置
3. `whiteboard-display/.env.local` - 白板端配置

## 使用方法

### 快速启动 (推荐)
```bash
# 自动配置为 localhost
./scripts/setup-env.sh --auto

# 启动所有服务
./scripts/start-all.sh
```

### 手动配置
```bash
# 交互式配置
./scripts/setup-env.sh

# 或使用快速配置脚本
./scripts/setup-localhost.sh
```

### 单独启动服务
```bash
# 后端API
cd backend-api && pnpm run dev

# 教师端
cd teacher-control && pnpm run dev

# 白板端
cd whiteboard-display && pnpm run dev
```

## 脚本改进

### setup-env.sh 改进
- 添加了 `--auto` 参数支持自动配置
- 改进了用户交互体验
- 添加了使用说明

### 新增脚本
- `setup-localhost.sh` - 快速设置 localhost 配置的专用脚本

## 验证配置

### 检查服务状态
```bash
# 检查后端API
curl http://localhost:3001/health

# 检查服务是否正常运行
ps aux | grep node
```

### 访问地址
- 教师控制端: http://localhost:3000
- 白板显示端: http://localhost:3002
- 后端API: http://localhost:3001

## 注意事项

1. **端口冲突**: 如果端口被占用，start-all.sh 会自动尝试终止占用进程
2. **环境变量**: 修改配置后需要重启服务才能生效
3. **网络访问**: localhost 配置仅支持本机访问，如需局域网访问请使用 setup-env.sh 配置具体IP地址

## 故障排除

### 字体加载问题
如果仍有字体加载警告，这是正常的，因为：
- 已配置字体回退机制
- 不影响应用正常使用
- 在网络不稳定时会自动使用系统字体

### 端口占用
```bash
# 查看端口占用
lsof -i :3000
lsof -i :3001
lsof -i :3002

# 终止占用进程
kill -9 <PID>
```

### 配置重置
```bash
# 重新配置所有服务为 localhost
./scripts/setup-env.sh --auto
```
