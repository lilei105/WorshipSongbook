import { NextResponse } from "next/server";
import { getAuthUser } from "./auth";

export async function requireAuth(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return null;
  }
  return user;
}

export function withOrganizationFilter(where, organizationId) {
  return {
    ...where,
    organizationId
  };
}

export function withUserFilter(where, userId) {
  return {
    ...where,
    userId
  };
}

export async function getCurrentUser(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  
  if (!token) return null;
  
  const { verifyToken } = await import("./auth");
  return await verifyToken(token);
}

export async function requireAuthMiddleware(request) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Authentication error", details: error.message },
      { status: 500 }
    );
  }
}

export async function requireOrganizationAccess(request, organizationId) {
  const user = await getAuthUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  
  if (user.organizationId !== parseInt(organizationId)) {
    return NextResponse.json(
      { error: "Access denied to this organization" },
      { status: 403 }
    );
  }
  
  return user;
}

export function createOrganizationFilter(organizationId) {
  return {
    organizationId
  };
}

export function createUserFilter(userId) {
  return {
    userId
  };
}

export function combineFilters(...filters) {
  return filters.reduce((acc, filter) => ({ ...acc, ...filter }), {});
}