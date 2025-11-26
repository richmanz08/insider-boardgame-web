import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "../../request";
import { withErrorHandler } from "@/src/utils/apiErrorHandler";
import { TOKEN_NAME } from "@/src/config/system";

async function leaveRoom(req: Request) {
  const body = await req.json();
  const url = `/room/leave`;
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  const result = await apiReq(url, { method: "POST", token, body });

  return NextResponse.json(result);
}

export const POST = withErrorHandler(leaveRoom);
