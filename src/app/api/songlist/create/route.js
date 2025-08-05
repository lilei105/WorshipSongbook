import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter, createUserFilter } from "@/lib/auth-middleware";

export async function POST(req) {
  const startTime = Date.now();
  const endpoint = '/api/songlist/create';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
      return user;
    }

    const { name, date } = await req.json();

    if (!name || name.trim() === "") {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (validation failed)`);
      return NextResponse.json(
        { error: "歌单名称不能为空" },
        { status: 400 }
      );
    }

    const songlist = await prisma.songlist.create({
      data: {
        name: name.trim(),
        date: date ? new Date(date) : new Date(),
        organizationId: user.organizationId,
        userId: user.id,
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
      success: true,
      data: songlist,
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
    console.error("创建歌单失败:", error);
    return NextResponse.json(
      { error: "创建歌单失败" },
      { status: 500 }
    );
  }
}