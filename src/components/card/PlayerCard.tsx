import { PlayerData } from "@/src/hooks/interface";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import React from "react";

interface PlayerCardProps {
  player: PlayerData;
}
export const PlayerCard: React.FC<PlayerCardProps> = (props) => {
  const { player } = props;

  console.log("Rendering PlayerCard for player:", player);

  return (
    <Card key={player.uuid} className="relative overflow-hidden">
      {/* Host Badge */}
      {player.host && (
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
            {player?.playerName?.charAt(0).toUpperCase()}
          </div>

          {/* Active Status Indicator - จุดเขียว/เทา */}
          <div
            className="absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: player.active ? "#10b981" : "#6b7280" }}
            title={player.active ? "ออนไลน์" : "ออฟไลน์"}
          />

          {/* Ready Indicator */}
          {player.ready && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <i className="pi pi-check text-white text-xs" />
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold">{player.playerName}</h3>
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
