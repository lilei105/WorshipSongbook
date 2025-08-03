import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, date } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "歌单名称不能为空" },
        { status: 400 }
      );
    }

    const songlist = await prisma.songlist.create({
      data: {
        name: name.trim(),
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: songlist,
    });
  } catch (error) {
    console.error("创建歌单失败:", error);
    return NextResponse.json(
      { error: "创建歌单失败" },
      { status: 500 }
    );
  }
}