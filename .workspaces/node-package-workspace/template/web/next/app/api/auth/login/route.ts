import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, signAuthToken } from "../../../../lib/auth-jwt";
import { validateCredential } from "../../../../lib/auth-store";

type LoginBody = {
  id?: string;
  pw?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
  }

  const id = body.id?.trim();
  const pw = body.pw;

  if (!id || !pw) {
    return NextResponse.json({ ok: false, message: "id and pw are required" }, { status: 400 });
  }

  const found = validateCredential(id, pw);
  if (!found) {
    return NextResponse.json({ ok: false, message: "invalid credential" }, { status: 401 });
  }

  const token = await signAuthToken({
    sub: found.userId,
    loginId: found.loginId,
    name: found.name,
  });

  const response = NextResponse.json({
    ok: true,
    user: {
      userId: found.userId,
      loginId: found.loginId,
      name: found.name,
    },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
