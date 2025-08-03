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
    // 查询指定日期范围内的所有歌单
    const songlists = await prisma.songlist.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
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
      const dateKey = list.date.toISOString().split("T")[0];
      if (!datesWithData.has(dateKey)) {
        datesWithData.set(dateKey, []);
      }
      datesWithData.get(dateKey).push(list);
    });

    // 转换为对象格式
    const result = Object.fromEntries(datesWithData);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching songlists by date range:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}