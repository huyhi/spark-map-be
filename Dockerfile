# =============================
# 1. 构建阶段
# =============================
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 lock 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝项目源码
COPY . .

# 构建项目（TypeScript -> JavaScript）
RUN npm run build

# =============================
# 2. 生产阶段
# =============================
FROM node:20-alpine AS production

WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ENV PORT=8000

# 拷贝 package.json 并安装生产依赖
COPY package*.json ./
RUN npm install --only=production

# 拷贝构建好的 JS 文件
COPY --from=builder /app/dist ./dist

# 如果有静态资源也需要拷贝
# COPY --from=builder /app/public ./public

# 暴露 8000 端口
EXPOSE 8000

# 启动命令
CMD ["node", "dist/main.js"]