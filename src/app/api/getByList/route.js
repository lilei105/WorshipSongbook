import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const listId = parseInt(req.nextUrl.searchParams.get('listId'));
  //console.log("listID = ", listID);

  const songs = await prisma.song.findMany({
    where: {
      songlist_id: listId,
    },
  });
  
  console.log(`API getByList - listId: ${listId}, songs found: ${songs.length}`, songs);

  return NextResponse.json({ data: songs });
}
