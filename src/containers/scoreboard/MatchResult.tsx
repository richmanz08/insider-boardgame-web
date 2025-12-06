import { Avatar } from "@/src/components/avatar/Avatar";
import { Button } from "@/src/components/button/Button";
import { RuleUI } from "@/src/components/rules/RuleUI";
import { Typography } from "@/src/components/text/Typography";
import { ActiveGame, RoleGame } from "@/src/hooks/interface";
import { Card } from "primereact/card";
import React from "react";

interface MatchResultProps {
  activeGame: ActiveGame;
  onBackToRooms: () => void;
}
export const MatchResult: React.FC<MatchResultProps> = ({
  onBackToRooms,
  activeGame,
}) => {
  const getRoleIcon = (role: RoleGame) => {
    switch (role) {
      case RoleGame.INSIDER:
        return "pi-eye";
      case RoleGame.MASTER:
        return "pi-crown";
      case RoleGame.CITIZEN:
        return "pi-user";
    }
  };

  const getRoleColor = (role: RoleGame) => {
    switch (role) {
      case RoleGame.INSIDER:
        return "text-red-500";
      case RoleGame.MASTER:
        return "text-purple-500";
      case RoleGame.CITIZEN:
        return "text-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          🏆 สรุปผลเกม
        </h1>
        <p className="text-gray-400 text-lg">คะแนนของทุกคนในเกมนี้</p>
      </div>

      <Card key={activeGame.id} className="bg-gray-700 border border-gray-600">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-lg font-bold text-white">
                {/* เกม {activeGame.id} */}
                {activeGame.word}
              </h4>
              {/* <p className="text-yellow-400 font-semibold">{activeGame.word}</p> */}
            </div>
            <div className="flex gap-1">
              {activeGame.summary?.citizensAnsweredCorrectly && (
                <span className="text-xs bg-green-600 px-2 py-0.5 rounded">
                  ✓ ตอบถูก
                </span>
              )}
              {/* {activeGame.timeUp && (
                <span className="text-xs bg-red-600 px-2 py-0.5 rounded">
                  ⏰ หมดเวลา
                </span>
              )} */}
              {activeGame.summary?.insiderCaught && (
                <span className="text-xs bg-amber-600 px-2 py-0.5 rounded">
                  ✓ จับได้
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {activeGame.playerInGame.map((player) => {
              const role = activeGame.roles[player.uuid];
              const score = activeGame.summary?.scores[player.uuid] || 0;
              return (
                <div
                  key={player.uuid}
                  className="bg-gray-800 rounded p-2 flex items-center justify-between overflow-hidden"
                >
                  <div className="flex items-center gap-2">
                    {/* <span className="text-white text-sm"></span>   */}
                    <Avatar size="sm" name={player.playerName} />
                    <Typography
                      type="strong-body"
                      maxLines={1}
                      className="text-white !text-bold"
                    >
                      {player.playerName}
                    </Typography>
                    <i
                      className={`pi ${getRoleIcon(role)} ${getRoleColor(
                        role
                      )}`}
                    />
                  </div>
                  {score > 0 && (
                    <span className="text-yellow-400 font-bold animate-fade-from-right">
                      +{score}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-30">
        <div className="container mx-auto max-w-7xl flex gap-3 justify-center">
          <Button
            label="กลับไปหน้าห้อง"
            icon="pi pi-list"
            size="large"
            severity="secondary"
            className="flex-1 md:flex-none"
            onClick={onBackToRooms}
          />
        </div>
      </div>

      {/* Scoring Rules */}
      {/* <div className="mt-8">
        <RuleUI />
      </div> */}
    </div>
  );
};
