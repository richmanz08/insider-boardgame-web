import { RoomData, RoomStatus } from "@/app/api/room/RoomInterface";
import { map } from "lodash";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { AmountPlayer } from "../player/AmountPlayer";

interface RoomCardProps {
  room: RoomData;
  onJoin: (room: RoomData) => void;
}
export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  // const isJoinable =
  //   room.status === RoomStatus.WAITING && room.currentPlayers < room.maxPlayers;

  const isJoinable = room.currentPlayers < room.maxPlayers;

  const getStatusSeverity = (status: RoomData["status"]) => {
    switch (status) {
      case RoomStatus.WAITING:
        return "success";
      case RoomStatus.PLAYING:
        return "info";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: RoomData["status"]) => {
    switch (status) {
      case RoomStatus.WAITING:
        return "รอผู้เล่น";
      case RoomStatus.PLAYING:
        return "กำลังเล่น";

      default:
        return status;
    }
  };

  return (
    <Card key={room.roomCode} className="mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold">{room.roomName}</h3>
            {room.hasPassword && <i className="pi pi-lock text-yellow-500" />}
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <i className="pi pi-users" />
              <AmountPlayer
                current={room.currentPlayers}
                max={room.maxPlayers}
              />
            </div>

            {/* <Tag
              value={getStatusLabel(room.status)}
              severity={getStatusSeverity(room.status)}
            /> */}
          </div>

          <p className="text-sm text-gray-400">
            <i className="pi pi-user mr-1" />
            Host: {room.hostName}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {isJoinable ? (
            <Button
              label={
                room.status === RoomStatus.PLAYING ? "เข้าไปรอ" : "เข้าร่วม"
              }
              icon="pi pi-sign-in"
              onClick={() => onJoin(room)}
              severity="success"
            />
          ) : (
            <Button label={"เต็ม"} disabled severity="secondary" />
          )}
        </div>
      </div>
    </Card>
  );
};
