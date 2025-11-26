"use client";
import { RoomContainer } from "@/src/containers/room/Room";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  return <RoomContainer roomCode={id} />;
}
