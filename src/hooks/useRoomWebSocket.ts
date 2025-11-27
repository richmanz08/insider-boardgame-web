// hooks/useRoomWebSocket.ts

import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { PlayerData, RoomUpdateMessage } from "./interface";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

export function useRoomWebSocket(roomCode: string, playerUuid: string) {
  const clientRef = useRef<Client | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RoomUpdateMessage | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("WebSocket Connected!");
      setIsConnected(true);

      // Subscribe to room updates
      client.subscribe(`/topic/room/${roomCode}`, (message: IMessage) => {
        const update: RoomUpdateMessage = JSON.parse(message.body);
        console.log("Room update received:", update);

        setLastUpdate(update);
        setPlayers(update.players);
      });

      // ⭐ ส่ง join message เพื่อขอข้อมูล players จาก backend
      console.log("Sending join message for playerUuid:", playerUuid);
      client.publish({
        destination: `/app/room/${roomCode}/join`,
        body: JSON.stringify({ playerUuid }),
      });
    };

    client.onDisconnect = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("WebSocket error:", frame);
    };

    client.activate();
    clientRef.current = client;

    // ⭐ ส่ง leave message เมื่อ unmount (ปิด tab, refresh, navigate)
    const handleBeforeUnload = () => {
      if (clientRef.current?.connected && playerUuid) {
        // ใช้ sendBeacon สำหรับส่ง request ตอนปิดหน้า
        navigator.sendBeacon(
          `/api/room/${roomCode}/leave`,
          JSON.stringify({ playerUuid })
        );
      }
    };

    // ฟัง event ต่างๆ ที่ user อาจออกจากหน้า
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up WebSocket...");

      // ลบ event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);

      // ส่ง leave message ผ่าน WebSocket
      if (clientRef.current?.connected && playerUuid) {
        try {
          clientRef.current.publish({
            destination: `/app/room/${roomCode}/leave`,
            body: JSON.stringify({ playerUuid }),
          });
        } catch (error) {
          console.error("Error sending leave message:", error);
        }
      }

      clientRef.current?.deactivate();
    };
  }, [roomCode, playerUuid]);

  // Toggle ready status
  const toggleReady = useCallback(() => {
    if (clientRef.current && isConnected) {
      console.log("Sending ready toggle for playerUuid:", playerUuid);

      clientRef.current.publish({
        destination: `/app/room/${roomCode}/ready`,
        body: JSON.stringify({ playerUuid }),
      });
    }
  }, [roomCode, playerUuid, isConnected]);

  return {
    players,
    isConnected,
    lastUpdate,
    toggleReady,
  };
}
