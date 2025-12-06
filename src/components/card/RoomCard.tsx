import { RoomData, RoomStatus } from "@/app/api/room/RoomInterface";
import { Card } from "primereact/card";
import { AmountPlayer } from "../player/AmountPlayer";
import { Typography } from "../text/Typography";
import { Button } from "../button/Button";

interface RoomCardProps {
  room: RoomData;
  onJoin: (room: RoomData) => void;
}
export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const isJoinable = room.currentPlayers < room.maxPlayers;

  return (
    <Card key={room.roomCode} className="mb-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 min-w-0">
            <Typography type="subtitle" maxLines={1}>
              {room.roomName}
            </Typography>
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
          </div>

          <div className="flex items-center gap-1">
            <i className="pi pi-crown mr-1" />
            <p className="text-sm text-gray-400">{room.hostName}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <Button
            label={
              isJoinable
                ? room.status === RoomStatus.PLAYING
                  ? "เข้าไปรอ"
                  : "เข้าร่วม"
                : "เต็ม"
            }
            {...(isJoinable && {
              icon: "pi-play",
            })}
            onClick={() => onJoin(room)}
            severity={isJoinable ? "indigo" : "secondary"}
            size="medium"
            className="min-w-[120px]"
            disabled={!isJoinable}
          />
        </div>
      </div>
    </Card>
  );
};
