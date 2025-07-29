# 敬拜歌曲本应用

## 给赞美队同工的话

你是否在教会赞美队服事时遇到过这些烦恼：
- 每次练习前都要翻遍微信群找歌词和和弦谱
- 司琴、吉他手、主领各自保存的版本不一致
- 想找一个合适的诗歌，却记不起歌名或歌词
- 新同工加入时，要花很多时间整理和分享歌曲资料

这个应用就是为了解决这些问题而生的。它是一个专为教会赞美队设计的歌曲管理工具，让你可以：
- 📱 随时查看完整的诗歌歌词和和弦谱
- 🔍 快速搜索歌曲（支持歌词片段搜索）
- 📅 按日期查看当周练习和主日献诗安排
- 📋 创建歌单，方便练习和服事使用

简单、实用、专注服事需要。

## 技术说明

### 技术栈
- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma ORM
- **部署**: Vercel

### 开发环境设置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **数据库配置**
   - 确保本地已安装PostgreSQL
   - 创建数据库：
     ```sql
     CREATE DATABASE worship_songbook;
     ```
   - 复制`.env.example`为`.env`并配置数据库连接：
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/worship_songbook"
     ```

3. **数据库初始化**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开 [http://localhost:3000](http://localhost:3000)

### 项目结构
```
src/
├── app/
│   ├── list/          # 歌曲列表页面
│   ├── detail/        # 歌曲详情页面
│   ├── calendar/      # 日历视图
│   └── api/           # API接口
├── prisma/            # 数据库schema和迁移
└── public/            # 静态资源
```

### 部署
本项目已配置为Vercel一键部署。如需自定义部署，请参考Next.js部署文档。

---

*愿这个小小的工具能帮助你更专注于敬拜本身，而不是繁琐的资料管理。*
