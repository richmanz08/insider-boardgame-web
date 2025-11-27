import { PlayerData } from "@/src/hooks/interface";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import React from "react";

interface PlayerCardProps {
  player: PlayerData;
}
export const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  const { player } = props;
  return (
    <Card key={player.uuid} className="relative overflow-hidden">
      {/* Host Badge */}
      {player.isHost && (
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
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {player.playerName.charAt(0).toUpperCase()}
          </div>
          {/* Ready Indicator */}
          {player.isReady && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <i className="pi pi-check text-white text-xs" />
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{player.playerName}</h3>
          <div className="flex items-center gap-2">
            {player.isReady ? (
              <span className="text-green-500 text-sm flex items-center gap-1">
                <i className="pi pi-check-circle" />
                พร้อม
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
