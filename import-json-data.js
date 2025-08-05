
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importFromJSON() {
  // 示例：从JSON文件导入数据
  const songlists = require('./data/songlists.json');
  const songs = require('./data/songs.json');
  
  for (const songlist of songlists) {
    await prisma.songlist.create({ data: songlist });
  }
  
  for (const song of songs) {
    await prisma.song.create({ data: song });
  }
  
  console.log('导入完成！');
}

// importFromJSON();
