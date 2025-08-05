
# 数据迁移指南

## 步骤1：获取线上数据
1. 访问Vercel项目：https://worship-songbook.vercel.app
2. 在浏览器中打开开发者工具 (F12)
3. 访问以下URL获取数据：
   - 歌单数据：https://worship-songbook.vercel.app/api/getByDateRange?startDate=2024-01-01&endDate=2025-12-31
   - 所有歌曲：https://worship-songbook.vercel.app/api/songs

## 步骤2：使用Prisma Studio导入数据
1. 运行：npx prisma studio
2. 访问：http://localhost:5555
3. 手动添加数据

## 步骤3：使用脚本导入（如果有JSON数据）
如果有导出的JSON数据，可以运行：
node import-json-data.js
