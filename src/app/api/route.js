import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  console.log('prisma is working');
  const songs = await prisma.songs.findMany();

  return NextResponse.json({ data: songs });
}
