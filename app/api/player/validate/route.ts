import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { apiReq } from "../../request";
import { withErrorHandler } from "@/src/utils/apiErrorHandler";
import { TOKEN_NAME } from "@/src/config/system";

async function getPlayerValidation() {
  const url = `/player/validate`;
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  const result = await apiReq(url, { method: "GET", token });

  return NextResponse.json(result);
}

export const GET = withErrorHandler(getPlayerValidation);
