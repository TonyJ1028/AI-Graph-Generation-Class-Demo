# 课堂互动系统部署指南

## 系统架构

```
课堂互动系统
├── backend-api/         # 后端API服务 (Node.js + Express + Socket.IO)
├── teacher-control/     # 教师控制端 (Next.js)
├── whiteboard-display/  # 白板显示端 (Next.js)
└── 部署配置文件
```

## 环境要求

### 开发环境
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 生产环境
- Linux/macOS/Windows Server
- Node.js >= 18.0.0
- PM2 (推荐用于进程管理)
- Nginx (推荐用于反向代理)
- SSL证书 (HTTPS支持)

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd classroom-interactive
```

### 2. 安装依赖
```bash
# 后端API
cd backend-api
pnpm install

# 教师控制端
cd ../teacher-control
pnpm install

# 白板显示端
cd ../whiteboard-display
pnpm install
```

### 3. 环境配置
在 `backend-api` 目录下创建 `.env` 文件：
```env
# 服务器配置
PORT=3001
NODE_ENV=development

# API配置
API_BASE_URL=https://your-api-endpoint.com
API_KEY=your-api-key-here

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# 文件上传配置
MAX_FILE_SIZE=25MB
UPLOAD_DIR=uploads

# WebSocket配置
WS_PORT=3001
```

### 4. 启动开发服务器
```bash
# 使用启动脚本（推荐）
./start-all.sh

# 或手动启动各服务
# 终端1: 后端API
cd backend-api && pnpm run dev

# 终端2: 教师控制端
cd teacher-control && pnpm run dev

# 终端3: 白板显示端
cd whiteboard-display && pnpm run dev
```

### 5. 访问应用
- 教师控制端: http://localhost:3000
- 白板显示端: http://localhost:3002
- 后端API: http://localhost:3001

## 生产环境部署

### 1. 构建应用
```bash
# 构建后端API
cd backend-api
pnpm run build

# 构建教师控制端
cd ../teacher-control
pnpm run build

# 构建白板显示端
cd ../whiteboard-display
pnpm run build
```

### 2. PM2 配置
创建 `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'classroom-api',
      script: 'dist/index.js',
      cwd: './backend-api',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'teacher-control',
      script: 'node_modules/.bin/next',
      args: 'start --port 3000',
      cwd: './teacher-control',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'whiteboard-display',
      script: 'node_modules/.bin/next',
      args: 'start --port 3002',
      cwd: './whiteboard-display',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### 3. 启动生产服务
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # 教师控制端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 白板显示端
    location /whiteboard {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 后端API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket支持
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Docker 部署

### 1. 创建 Dockerfile
```dockerfile
# 后端API Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### 2. Docker Compose
```yaml
version: '3.8'
services:
  backend-api:
    build: ./backend-api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads
  
  teacher-control:
    build: ./teacher-control
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  
  whiteboard-display:
    build: ./whiteboard-display
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
```

## 监控和维护

### 1. 日志管理
```bash
# PM2 日志
pm2 logs

# 特定应用日志
pm2 logs classroom-api
```

### 2. 性能监控
```bash
# PM2 监控
pm2 monit

# 系统资源
pm2 status
```

### 3. 备份策略
- 定期备份上传文件目录
- 备份环境配置文件
- 监控磁盘空间使用

## 故障排除

### 常见问题
1. **WebSocket连接失败**
   - 检查防火墙设置
   - 确认Nginx配置正确
   - 验证SSL证书

2. **文件上传失败**
   - 检查上传目录权限
   - 确认文件大小限制
   - 验证磁盘空间

3. **API调用失败**
   - 检查API密钥配置
   - 验证网络连接
   - 查看后端日志

### 调试命令
```bash
# 检查端口占用
lsof -i :3001

# 检查进程状态
ps aux | grep node

# 检查网络连接
netstat -tlnp | grep :3001
```

## 安全建议

1. **HTTPS强制**
   - 使用SSL证书
   - 重定向HTTP到HTTPS

2. **API安全**
   - 定期更换API密钥
   - 实施速率限制
   - 输入验证和清理

3. **文件安全**
   - 限制上传文件类型
   - 扫描恶意文件
   - 定期清理临时文件

4. **网络安全**
   - 配置防火墙
   - 使用VPN或内网部署
   - 监控异常访问

## 更新和维护

### 更新流程
1. 备份当前版本
2. 拉取最新代码
3. 安装新依赖
4. 构建新版本
5. 重启服务
6. 验证功能

### 维护计划
- 每周检查日志和性能
- 每月更新依赖包
- 每季度安全审计
- 年度系统升级
