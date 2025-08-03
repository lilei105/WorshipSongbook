import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  try {
    const startParsed = new Date(startDate);
    const endParsed = new Date(endDate);
    
    if (isNaN(startParsed) || isNaN(endParsed)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // 查询指定日期范围内的所有歌单
    const songlists = await prisma.songlist.findMany({
      where: {
        date: {
          gte: startParsed,
          lte: endParsed,
        },
      },
      include: {
        songs: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // 按日期分组数据
    const datesWithData = new Map();
    songlists.forEach((list) => {
      try {
        const dateKey = list.date.toISOString().split("T")[0];
        if (!datesWithData.has(dateKey)) {
          datesWithData.set(dateKey, []);
        }
        datesWithData.get(dateKey).push(list);
      } catch (dateError) {
        console.warn("Error processing date:", dateError);
      }
    });

    // 转换为对象格式
    const result = Object.fromEntries(datesWithData);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching songlists by date range:", error);
    return NextResponse.json(
      { data: {} },
      { status: 200 }
    );
  } finally {
    await prisma.$disconnect();
  }
}