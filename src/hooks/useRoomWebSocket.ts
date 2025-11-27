// hooks/useRoomWebSocket.ts

import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { PlayerData, RoomUpdateMessage, GamePrivateMessage } from "./interface";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

export function useRoomWebSocket(roomCode: string, playerUuid: string) {
  const clientRef = useRef<Client | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RoomUpdateMessage | null>(null);
  const [gamePrivateInfo, setGamePrivateInfo] =
    useState<GamePrivateMessage | null>(null);

  // Connect to WebSocket และ Setup Visibility Detection
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
        console.log("@@@@@ Room update received:", update);

        setLastUpdate(update);
        setPlayers(update.players);
      });

      // ⭐ Subscribe to game private messages (role & word for MASTER/INSIDER)
      client.subscribe(`/user/queue/game_private`, (message: IMessage) => {
        const privateInfo: GamePrivateMessage = JSON.parse(message.body);
        console.log("@@@@@Game private info received:", privateInfo);
        setGamePrivateInfo(privateInfo);
      });

      // ⭐ ส่ง join message เพื่อขอข้อมูล players จาก backend
      console.log("Sending join message for playerUuid:", playerUuid);

      client.publish({
        destination: `/app/room/${roomCode}/join`,
        body: JSON.stringify({
          playerUuid,
          active: true, // ⭐ ส่ง true เสมอเมื่อ join (ถ้า join ได้ = หน้าต้อง active)
        }),
      });

      // ส่ง status update หลัง join เสร็จ เพื่อซิงค์ visibility state
      setTimeout(() => {
        const isVisible = document.visibilityState === "visible";
        console.log("Post-join visibility check:", isVisible);

        if (!isVisible && clientRef.current?.connected) {
          // ถ้าหน้าไม่ visible จริงๆ (เช่น switch tab ระหว่างโหลด) ให้ส่ง update
          clientRef.current.publish({
            destination: `/app/room/${roomCode}/status`,
            body: JSON.stringify({
              playerUuid,
              active: false,
            }),
          });
        }
      }, 500); // รอ 500ms หลัง join
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

    // ⭐ Setup Page Visibility Detection (หลัง WebSocket connect)
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";

      console.log(
        "@@@@@Page visibility changed:",
        isVisible ? "visible" : "hidden"
      );

      // ส่ง status update ไปยัง backend
      if (clientRef.current?.connected && playerUuid) {
        clientRef.current.publish({
          destination: `/app/room/${roomCode}/status`,
          body: JSON.stringify({
            playerUuid,
            active: isVisible, // true = active, false = inactive
          }),
        });
      }
    };

    // ฟัง visibility change event
    document.addEventListener("visibilitychange", handleVisibilityChange);

    console.log(
      "Note: Not sending leave on refresh - Backend will handle via disconnect event"
    );

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up WebSocket...");

      // ลบ visibility event listener
      document.removeEventListener("visibilitychange", handleVisibilityChange);

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

  // ⭐ Start game (only host can call)
  const startGame = useCallback(() => {
    if (clientRef.current && isConnected) {
      console.log("@@@@@Starting game triggered by:", playerUuid);

      clientRef.current.publish({
        destination: `/app/room/${roomCode}/start`,
        body: JSON.stringify({ triggerByUuid: playerUuid }),
      });
    }
  }, [roomCode, playerUuid, isConnected]);

  return {
    players,
    isConnected,
    lastUpdate,
    gamePrivateInfo,
    toggleReady,
    startGame,
  };
}
