import { ApiResponseCommon } from "@/src/common/interface";
import { GameData } from "./GameInterface";

export const getActiveGameService = async (
  roomCode: string,
  signal?: AbortSignal
): Promise<ApiResponseCommon<GameData> | null> => {
  try {
    const res = await fetch(`/api/game/${roomCode}/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("Error Fetching playerValidateService:", error);
    return null;
  }
};
