import { NextResponse } from "next/server";
import { apiReq } from "../../request";
import { withErrorHandler } from "@/src/utils/apiErrorHandler";

async function createPlayerRegister(req: Request) {
  const body = await req.json();
  const url = `/player/register`;
  const result = await apiReq(url, { method: "POST", body });

  return NextResponse.json(result);
}

export const POST = withErrorHandler(createPlayerRegister);
