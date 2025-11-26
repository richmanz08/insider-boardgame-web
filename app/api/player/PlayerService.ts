import { ApiResponseCommon } from "@/src/common/interface";
import { PlayerData, RegisterBody } from "./PlayerInterface";

export const playerRegisterService = async (
  body: RegisterBody,
  signal?: AbortSignal
): Promise<ApiResponseCommon<PlayerData> | null> => {
  try {
    const res = await fetch(`/api/player/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("Error Fetching playerRegisterService:", error);
    return null;
  }
};
