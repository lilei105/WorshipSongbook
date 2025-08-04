import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter, createUserFilter } from "@/lib/auth-middleware";

export async function POST(req) {
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) return user;

    const { name, by, note, sheet_url, audio_url } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "歌曲名称不能为空" },
        { status: 400 }
      );
    }

    const song = await prisma.song.create({
      data: {
        name: name.trim(),
        by: by?.trim() || null,
        note: note?.trim() || null,
        sheet_url: sheet_url?.trim() || null,
        audio_url: audio_url?.trim() || null,
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

    return NextResponse.json({
      success: true,
      data: song,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "创建歌曲失败" },
      { status: 500 }
    );
  }
}