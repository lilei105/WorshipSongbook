import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email, phone, nickname, password, organizationId } = await request.json();

    // Validate required fields
    if (!email || !nickname || !password || !organizationId) {
      return NextResponse.json(
        { error: "Email, nickname, password, and organization are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(organizationId) }
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Check for existing phone if provided
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already exists" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        phone: phone || null,
        nickname: nickname.trim(),
        password: hashedPassword,
        organizationId: parseInt(organizationId),
        role: "member"
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        organizationId: true,
        role: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        organizationId: user.organizationId 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}