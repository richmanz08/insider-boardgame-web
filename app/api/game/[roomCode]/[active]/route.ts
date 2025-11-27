import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { withErrorHandler } from "@/src/utils/apiErrorHandler";
import { TOKEN_NAME } from "@/src/config/system";
import { apiReq } from "@/app/api/request";

async function getRoomCode(
  _: Request,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const roomCode = (await params).roomCode;
  const url = `/game/${roomCode}/active`;
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  const result = await apiReq(url, { method: "GET", token });

  return NextResponse.json(result);
}

export const GET = withErrorHandler(getRoomCode);
