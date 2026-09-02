import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // หน้า login เข้าได้เสมอ
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
