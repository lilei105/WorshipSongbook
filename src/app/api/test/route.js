import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("=== Testing database connection ===");
    
    // Test database connection
    const count = await prisma.song.count();
    console.log("Total songs:", count);
    
    // Test user query
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Sample user:", users[0]);
    
    return NextResponse.json({
      success: true,
      songCount: count,
      sampleUser: users[0]
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      error: "Database test failed",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}