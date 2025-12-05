import { Tag } from "primereact/tag";
import { useRoomHook } from "../hook";
import { RoomStatus } from "@/app/api/room/RoomInterface";
import { Card } from "primereact/card";
import { MINIMUM_PLAYERS } from "@/src/config/system";
import { useContext } from "react";
import { RoomContext } from "../Room";
import { AmountPlayer } from "@/src/components/player/AmountPlayer";

export const HeaderRoom: React.FC = () => {
  const { getStatusLabel, getStatusSeverity } = useRoomHook();
  const { allReady, room } = useContext(RoomContext);
  const hasPassword = false; // Replace with actual password check if needed

  if (!room) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{room?.roomName ?? ""}</h1>
            {hasPassword && (
              <i
                className="pi pi-lock text-yellow-400"
                title="ห้องมีพาสเวิร์ด"
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <Tag
              value={getStatusLabel(room?.status ?? RoomStatus.WAITING)}
              severity={getStatusSeverity(room?.status ?? RoomStatus.WAITING)}
              icon="pi pi-info-circle"
            />
            <div className="flex items-center gap-1">
              <i className="pi pi-users mr-2" />
              <AmountPlayer
                current={room.currentPlayers}
                max={room.maxPlayers}
              />{" "}
            </div>
            {allReady && (
              <Tag
                value="ทุกคนพร้อมแล้ว!"
                severity="success"
                icon="pi pi-check-circle"
              />
            )}
          </div>
        </div>
      </div>

      {/* Progress Info */}
      {room?.status === RoomStatus.WAITING && (
        <Card className="bg-blue-900/20 border-blue-500/30">
          <div className="flex items-center gap-3">
            <i className="pi pi-info-circle text-blue-400 text-xl" />
            <div>
              <p className="font-semibold mb-1">รอผู้เล่นพร้อม</p>
              <p className="text-sm text-gray-400">
                ทุกคนต้องกดปุ่ม &quot;พร้อม&quot; ก่อนเริ่มเกม (ต้องมีอย่างน้อย{" "}
                {MINIMUM_PLAYERS} คน)
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
