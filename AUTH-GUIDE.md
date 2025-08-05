# 用户认证系统使用指南

## 系统概述

本项目现已实现完整的用户认证和多租户组织系统，支持以下功能：

- 组织搜索和选择
- 用户注册和登录
- JWT令牌认证
- 组织间数据隔离
- 用户权限管理

## 新用户注册流程

### 1. 选择或创建组织
访问 `/organizations/select` 页面：
- 搜索现有组织
- 或创建新组织
- 选择后将跳转到用户注册页面

### 2. 用户注册
访问 `/register` 页面：
- 填写个人信息（昵称、邮箱、手机号、密码）
- 自动关联到之前选择的组织

### 3. 用户登录
访问 `/login` 页面：
- 使用邮箱和密码登录
- 登录后访问组织专属的数据

## 快速开始

### 首次运行

1. 确保数据库已正确配置并运行：
```bash
npx prisma db push
npx prisma generate
```

2. 运行数据迁移脚本（创建默认组织和管理员）：
```bash
node migrate-existing-data.js
```

3. 启动开发服务器：
```bash
npm run dev
```

### 默认管理员账号
- 邮箱：admin@worship.local
- 密码：admin123

## API端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/session` - 获取当前用户信息

### 组织相关
- `GET /api/organizations/search?q=关键词` - 搜索组织
- `POST /api/organizations/create` - 创建新组织

### 数据访问
所有现有API端点都已更新为需要认证，并自动过滤当前用户组织的数据：
- `GET /api/getByDate?date=YYYY-MM-DD`
- `GET /api/songs`
- `POST /api/songs/create`
- `POST /api/songlist/create`

## 前端集成

### 认证状态管理
使用 `AuthContext` 管理认证状态：

```javascript
import { useAuth } from '@/lib/auth-context';

const { user, login, logout, isAuthenticated } = useAuth();
```

### 受保护路由
在需要认证的页面中：

```javascript
// 检查用户是否已登录
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

### API请求认证
所有API请求自动包含JWT令牌：

```javascript
// 在API路由中自动验证令牌
const user = await requireAuthMiddleware(req);
```

## 数据模型

### 组织模型
- 名称、位置、类型
- 关联用户、歌曲、歌单

### 用户模型
- 昵称、邮箱、手机号、密码
- 所属组织、角色权限
- 创建的歌曲和歌单

### 数据隔离
- 所有查询自动按组织过滤
- 用户只能访问自己组织的资源
- 创建数据时自动关联用户和组织

## 安全特性

- 密码使用bcrypt加密存储
- JWT令牌用于会话管理
- 所有API端点需要认证
- 跨组织数据隔离
- 输入验证和错误处理

## 部署注意事项

1. 确保环境变量正确配置：
```bash
DATABASE_URL="mysql://username:password@localhost:3306/worship_songbook"
JWT_SECRET="your-secret-key-here"
```

2. 运行数据库迁移：
```bash
npx prisma migrate deploy
```

3. 运行数据迁移脚本：
```bash
node migrate-existing-data.js
```

## 故障排除

### 常见问题
1. **数据库连接错误**：检查DATABASE_URL配置
2. **Prisma客户端未生成**：运行 `npx prisma generate`
3. **认证失败**：检查JWT_SECRET配置和令牌有效性
4. **权限问题**：确保用户属于正确的组织

### 调试技巧
- 查看浏览器开发者工具的Network标签
- 检查sessionStorage中的token和user信息
- 查看服务器控制台日志
- 使用 `console.log` 调试认证流程