import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { songId } = await req.json();

    if (!songId) {
      return NextResponse.json(
        { error: "歌曲ID不能为空" },
        { status: 400 }
      );
    }

    // 检查歌单是否存在
    const songlist = await prisma.songlist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!songlist) {
      return NextResponse.json(
        { error: "歌单不存在" },
        { status: 404 }
      );
    }

    // 检查歌曲是否存在
    const song = await prisma.song.findUnique({
      where: { id: parseInt(songId) },
    });

    if (!song) {
      return NextResponse.json(
        { error: "歌曲不存在" },
        { status: 404 }
      );
    }

    // 更新歌曲的songlist_id
    const updatedSong = await prisma.song.update({
      where: { id: parseInt(songId) },
      data: { songlist_id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      data: updatedSong,
    });
  } catch (error) {
    console.error("添加歌曲到歌单失败:", error);
    return NextResponse.json(
      { error: "添加歌曲到歌单失败" },
      { status: 500 }
    );
  }
}