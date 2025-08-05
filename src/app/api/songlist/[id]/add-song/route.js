import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function POST(req, { params }) {
  const startTime = Date.now();
  const endpoint = '/api/songlist/[id]/add-song';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
      return user;
    }

    const { id } = params;
    const { songId } = await req.json();

    if (!songId) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (validation failed)`);
      return NextResponse.json(
        { error: "歌曲ID不能为空" },
        { status: 400 }
      );
    }

    // 检查歌单是否存在且属于用户的组织
    const songlist = await prisma.songlist.findFirst({
      where: {
        id: parseInt(id),
        ...createOrganizationFilter(user.organizationId),
      },
    });

    if (!songlist) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (songlist not found)`);
      return NextResponse.json(
        { error: "歌单不存在或访问被拒绝" },
        { status: 404 }
      );
    }

    // 检查歌曲是否存在且属于用户的组织
    const song = await prisma.song.findFirst({
      where: {
        id: parseInt(songId),
        ...createOrganizationFilter(user.organizationId),
      },
    });

    if (!song) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (song not found)`);
      return NextResponse.json(
        { error: "歌曲不存在或访问被拒绝" },
        { status: 404 }
      );
    }

    // 更新歌曲的songlist_id
    const updatedSong = await prisma.song.update({
      where: { id: parseInt(songId) },
      data: { songlist_id: parseInt(id) },
    });

    const response = NextResponse.json({
      success: true,
      data: updatedSong,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (success)`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request failed in ${duration}ms: ${error.message}`);
    console.error("添加歌曲到歌单失败:", error);
    return NextResponse.json(
      { error: "添加歌曲到歌单失败" },
      { status: 500 }
    );
  }
}