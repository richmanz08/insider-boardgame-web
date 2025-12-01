import { RoomContext } from "@/src/containers/room/Room";
import { PlayerData } from "@/src/hooks/interface";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import React, { useContext } from "react";
import { Avatar } from "../avatar/Avatar";

interface PlayerCardProps {
  player: PlayerData;
}
export const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  const { player } = props;

  const { room, my } = useContext(RoomContext);

  return (
    <Card key={player.uuid} className="relative overflow-hidden">
      {/* Host Badge */}
      {player.uuid === room?.hostUuid && (
        <div className="absolute top-2 right-2">
          <Tag
            icon="pi pi-crown"
            severity="warning"
            value="หัวห้อง"
            className="text-xs"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Avatar
          name={player.playerName}
          size="lg"
          showActive={{ show: true, active: player.active }}
        />

        {/* Player Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-lg font-bold ${
                my?.uuid === player.uuid ? "text-blue-500" : "text-white"
              }`}
            >
              {player.playerName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {player.ready ? (
              <span className="text-green-500 text-sm flex items-center gap-1">
                <i className="pi pi-check-circle" />
                พร้อม
              </span>
            ) : player.playing ? (
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <i className="pi pi-play" />
                กำลังเล่น...
              </span>
            ) : (
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <i className="pi pi-clock" />
                รอ...
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
