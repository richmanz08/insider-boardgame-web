/* eslint-disable react-hooks/set-state-in-effect */

"use client";
import { RoomData } from "@/app/api/room/RoomInterface";
import { getRoomByCodeService } from "@/app/api/room/RoomService";
import { RoomContainer } from "@/src/containers/room/Room";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();

  const [roomSetting, setRoomSetting] = useState<RoomData | null>(null);

  const { data: roomData } = useQuery({
    queryKey: ["room", code],
    queryFn: async () => {
      const res = await getRoomByCodeService(code);
      return res;
    },
  });

  useEffect(() => {
    if (roomData && roomData.data) {
      setRoomSetting(roomData.data);
    }
  }, [roomData, code]);

  if (!roomSetting) {
    return <div>Loading room data...</div>;
  }

  return <RoomContainer roomData={roomSetting} />;
}
