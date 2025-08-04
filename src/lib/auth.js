import jwt from "jsonwebtoken";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyToken(token) {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        organizationId: true
      }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return await verifyToken(token);
}

export function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}