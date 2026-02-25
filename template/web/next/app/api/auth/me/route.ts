import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../../../../lib/auth-jwt";
import { findUserById } from "../../../../lib/auth-store";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(`${AUTH_COOKIE_NAME}=`.length);

  if (!token) {
    return NextResponse.json({ ok: true, user: null });
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json({ ok: true, user: null });
  }

  const found = findUserById(payload.sub);
  if (!found) {
    return NextResponse.json({ ok: true, user: null });
  }

  return NextResponse.json({
    ok: true,
    user: {
      userId: found.userId,
      loginId: found.loginId,
      name: found.name,
    },
  });
}
