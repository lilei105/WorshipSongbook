const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugOrganization() {
  try {
    console.log('Testing organization creation...');
    
    // Check if Organization model exists
    const org = await prisma.organization.create({
      data: {
        name: '测试教会',
        location: '北京',
        type: 'church'
      }
    });
    
    console.log('Organization created:', org);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOrganization();