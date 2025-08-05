import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuthMiddleware, createOrganizationFilter } from '@/lib/auth-middleware';

export async function GET(req) {
  const startTime = Date.now();
  const endpoint = '/api/getByList';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  // Require authentication
  const user = await requireAuthMiddleware(req);
  if (user instanceof NextResponse) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
    return user;
  }

  const listId = parseInt(req.nextUrl.searchParams.get('listId'));
  
  if (!listId || isNaN(listId)) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (validation failed)`);
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
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (songlist not found)`);
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

    const response = NextResponse.json({ 
      data: songs,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (success, ${songs.length} songs)`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request failed in ${duration}ms: ${error.message}`);
    console.error("Error fetching songs by list:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
