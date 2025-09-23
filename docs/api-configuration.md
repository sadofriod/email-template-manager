# API 配置说明

## 开发环境配置

### 内部 API 路由
对于 Next.js 应用内部的 API 路由（如 `/api/auth/login`），系统会自动使用相对路径，无需配置 BASE_URL。

### 外部 API 调用
如果需要调用外部 API 服务，可以通过环境变量配置：

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 生产环境配置
在生产环境中，可以设置完整的 API 基础 URL：

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## API 工具函数

所有 API 调用都通过 `src/utils/index.ts` 中的 `api` 对象进行：

- `api.get(url)` - GET 请求
- `api.post(url, body)` - POST 请求  
- `api.put(url, body)` - PUT 请求
- `api.delete(url)` - DELETE 请求

这些函数会自动处理 URL 构建和错误处理。

## API 路由常量

所有 API 路径定义在 `src/constants/index.ts` 的 `API_ROUTES` 中，确保路径的一致性和可维护性。