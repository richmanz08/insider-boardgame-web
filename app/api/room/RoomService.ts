import { ApiResponseCommon } from "@/src/common/interface";
import { CreateRoomRequest, RoomData } from "../room/RoomInterface";

export const createRoomService = async (
  body: CreateRoomRequest,
  signal?: AbortSignal
): Promise<ApiResponseCommon<RoomData> | null> => {
  try {
    const res = await fetch(`/api/room/create`, {
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
    console.log("Error Fetching createRoomService:", error);
    return null;
  }
};

export const getRoomListService = async (
  signal?: AbortSignal
): Promise<ApiResponseCommon<RoomData[]> | null> => {
  try {
    const res = await fetch(`/api/room/available`, {
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
    console.log("Error Fetching getRoomListService:", error);
    return null;
  }
};
