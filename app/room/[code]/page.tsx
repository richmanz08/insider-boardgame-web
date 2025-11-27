/* eslint-disable react-hooks/set-state-in-effect */

"use client";
import { RoomData } from "@/app/api/room/RoomInterface";
import { getRoomByCodeService } from "@/app/api/room/RoomService";
import { RoomContainer } from "@/src/containers/room/Room";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [roomSetting, setRoomSetting] = useState<RoomData | null>(null);

  const {
    data: roomData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room", code],
    queryFn: async () => {
      const res = await getRoomByCodeService(code);
      return res;
    },
    retry: 1, // ลองใหม่แค่ 1 ครั้งถ้า error
  });

  useEffect(() => {
    if (roomData && roomData.data) {
      setRoomSetting(roomData.data);
    } else if (roomData && !roomData.success) {
      // API คืนค่ามาแต่ไม่พบห้อง
      console.log("Room not found or deleted:", code);
      router.push("/");
    }
  }, [roomData, code, router]);

  // เช็คถ้า error จาก query หรือ API ตอบว่าไม่พบข้อมูล
  useEffect(() => {
    if (isError) {
      console.log("Error loading room:", code);
      router.push("/");
    }
  }, [isError, code, router]);

  if (isLoading || !roomSetting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังโหลดข้อมูลห้อง...</p>
        </div>
      </div>
    );
  }

  return <RoomContainer roomData={roomSetting} />;
}
