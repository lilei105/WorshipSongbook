const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test organization creation
    const org = await prisma.organization.create({
      data: {
        name: '测试教会',
        location: '测试城市',
        type: 'church'
      }
    });
    console.log('✅ Organization created:', org);
    
    // Test user creation
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        nickname: '测试用户',
        password: hashedPassword,
        organizationId: org.id
      }
    });
    console.log('✅ User created:', user);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();