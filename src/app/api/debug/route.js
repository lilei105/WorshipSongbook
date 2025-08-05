import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware } from "@/lib/auth-middleware";

export async function GET(req) {
  try {
    console.log("=== Debug endpoint ===");
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Test authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) {
      console.log("Auth failed:", user.status);
      return user;
    }
    
    console.log("User authenticated:", user);
    
    // Test database connection
    const count = await prisma.song.count({
      where: { organizationId: user.organizationId }
    });
    
    console.log("Song count:", count);
    
    return NextResponse.json({
      success: true,
      user,
      songCount: count,
      message: "Debug successful"
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      error: "Debug failed",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}