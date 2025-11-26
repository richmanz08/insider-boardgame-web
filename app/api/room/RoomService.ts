import { ApiResponseCommon } from "@/src/common/interface";
import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
  RoomData,
} from "../room/RoomInterface";

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

export const joinRoomService = async (
  body: JoinRoomRequest,
  signal?: AbortSignal
): Promise<ApiResponseCommon<RoomData> | null> => {
  try {
    const res = await fetch(`/api/room/join`, {
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
    console.log("Error Fetching joinRoomService:", error);
    return null;
  }
};

export const leaveRoomService = async (
  body: LeaveRoomRequest,
  signal?: AbortSignal
): Promise<ApiResponseCommon<null> | null> => {
  try {
    const res = await fetch(`/api/room/leave`, {
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
    console.log("Error Fetching leaveRoomService:", error);
    return null;
  }
};
