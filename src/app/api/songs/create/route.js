import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
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
      },
    });

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("创建歌曲失败:", error);
    return NextResponse.json(
      { error: "创建歌曲失败" },
      { status: 500 }
    );
  }
}