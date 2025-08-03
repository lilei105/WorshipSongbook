import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const listId = parseInt(req.nextUrl.searchParams.get('listId'));
  //console.log("listID = ", listID);

  const songs = await prisma.song.findMany({
    where: {
      songlist_id: listId,
    },
  });

  return NextResponse.json({ data: songs });
}
