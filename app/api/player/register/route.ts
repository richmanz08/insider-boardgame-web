import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "../../request";
import { withErrorHandler } from "@/src/utils/apiErrorHandler";

async function createPlayerRegister(req: Request) {
  const body = await req.json();
  const url = `/player/register`;
  const token = (await cookies()).get("access_token")?.value;
  const result = await apiReq(url, { method: "POST", token, body });

  return NextResponse.json(result);
}

export const POST = withErrorHandler(createPlayerRegister);
