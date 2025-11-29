import { Tag } from "primereact/tag";
import { useRoomHook } from "./hook";
import { Button } from "primereact/button";
import { RoomStatus } from "@/app/api/room/RoomInterface";
import { Card } from "primereact/card";
import { MINIMUM_PLAYERS } from "@/src/config/system";
import { PlayerData, RoomUpdateMessage } from "@/src/hooks/interface";

interface HeaderRoomProps {
  roomName: string;
  hasPassword: boolean;
  roomStatus: RoomStatus;
  maxPlayers: number;
  allPlayersReady: boolean;
  isHost: boolean;
  currentPlayerMemorize: PlayerData;
  setShowEditModal: (show: boolean) => void;
  onExitRoom: () => void;
  room: RoomUpdateMessage;
}
export const HeaderRoom: React.FC<HeaderRoomProps> = ({
  room,
  roomName,
  hasPassword,
  roomStatus,
  maxPlayers,
  allPlayersReady,
  isHost,
  currentPlayerMemorize,
  setShowEditModal,
  onExitRoom,
}) => {
  const { getStatusLabel, getStatusSeverity } = useRoomHook();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{roomName}</h1>
            {hasPassword && (
              <i
                className="pi pi-lock text-yellow-400"
                title="ห้องมีพาสเวิร์ด"
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <Tag
              value={getStatusLabel(roomStatus)}
              severity={getStatusSeverity(roomStatus)}
              icon="pi pi-info-circle"
            />
            <span className="text-gray-400">
              <i className="pi pi-users mr-2" />
              {room?.players.length}/{maxPlayers} ผู้เล่น
            </span>
            {allPlayersReady && (
              <Tag
                value="ทุกคนพร้อมแล้ว!"
                severity="success"
                icon="pi pi-check-circle"
              />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* ปุ่มแก้ไขห้อง - แสดงเฉพาะหัวห้อง */}
          {isHost && roomStatus !== RoomStatus.PLAYING && (
            <Button
              label="แก้ไขห้อง"
              icon="pi pi-cog"
              severity="secondary"
              outlined
              onClick={() => setShowEditModal(true)}
            />
          )}
          {!currentPlayerMemorize?.playing && (
            <Button
              label="ออกจากห้อง"
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              onClick={() => onExitRoom()}
            />
          )}
        </div>
      </div>

      {/* Progress Info */}
      {roomStatus === RoomStatus.WAITING && (
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
