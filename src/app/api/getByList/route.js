import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuthMiddleware, createOrganizationFilter } from '@/lib/auth-middleware';

export async function GET(req) {
  // Require authentication
  const user = await requireAuthMiddleware(req);
  if (user instanceof NextResponse) return user;

  const listId = parseInt(req.nextUrl.searchParams.get('listId'));
  
  if (!listId || isNaN(listId)) {
    return NextResponse.json(
      { error: "Invalid list ID" },
      { status: 400 }
    );
  }

  try {
    // Verify the songlist belongs to the user's organization
    const songlist = await prisma.songlist.findFirst({
      where: {
        id: listId,
        ...createOrganizationFilter(user.organizationId),
      },
    });

    if (!songlist) {
      return NextResponse.json(
        { error: "Songlist not found or access denied" },
        { status: 404 }
      );
    }

    const songs = await prisma.song.findMany({
      where: {
        songlist_id: listId,
        ...createOrganizationFilter(user.organizationId),
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      data: songs,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    console.error("Error fetching songs by list:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
