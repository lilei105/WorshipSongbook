const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateExistingData() {
  console.log('开始迁移现有数据...');

  try {
    // 1. 创建默认组织
    const defaultOrg = await prisma.organization.create({
      data: {
        name: '默认组织',
        location: '未知',
        type: 'church'
      }
    });
    console.log(`创建默认组织: ${defaultOrg.name} (ID: ${defaultOrg.id})`);

    // 2. 创建默认管理员用户
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const defaultUser = await prisma.user.create({
      data: {
        email: 'admin@worship.local',
        nickname: '管理员',
        password: hashedPassword,
        organizationId: defaultOrg.id,
        role: 'admin'
      }
    });
    console.log(`创建默认管理员: ${defaultUser.nickname} (ID: ${defaultUser.id})`);

    // 3. 更新现有歌曲关联到默认组织和管理员
    const updatedSongs = await prisma.song.updateMany({
      where: {
        organizationId: null,
        userId: null
      },
      data: {
        organizationId: defaultOrg.id,
        userId: defaultUser.id
      }
    });
    console.log(`更新 ${updatedSongs.count} 首歌曲的组织关联`);

    // 4. 更新现有歌单关联到默认组织和管理员
    const updatedSonglists = await prisma.songlist.updateMany({
      where: {
        organizationId: null,
        userId: null
      },
      data: {
        organizationId: defaultOrg.id,
        userId: defaultUser.id
      }
    });
    console.log(`更新 ${updatedSonglists.count} 个歌单的组织关联`);

    console.log('数据迁移完成！');
    console.log('');
    console.log('=== 默认用户信息 ===');
    console.log('邮箱: admin@worship.local');
    console.log('密码: admin123');
    console.log('');
    console.log('请登录后修改默认密码。');

  } catch (error) {
    console.error('数据迁移失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExistingData();