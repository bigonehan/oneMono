import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/auth-store";

type SignUpBody = {
  id?: string;
  name?: string;
  pw?: string;
};

export async function POST(request: Request) {
  let body: SignUpBody;

  try {
    body = (await request.json()) as SignUpBody;
  } catch {
    return NextResponse.json({ ok: false, message: "invalid payload" }, { status: 400 });
  }

  const id = body.id?.trim();
  const name = body.name?.trim();
  const pw = body.pw;

  if (!id || !name || !pw) {
    return NextResponse.json({ ok: false, message: "id, name, pw are required" }, { status: 400 });
  }

  const created = createUser({ loginId: id, name, pw });
  if (!created) {
    return NextResponse.json({ ok: false, message: "id already exists" }, { status: 409 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      userId: created.userId,
      loginId: created.loginId,
      name: created.name,
    },
  });
}
