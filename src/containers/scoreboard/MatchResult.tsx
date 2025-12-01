import { RuleUI } from "@/src/components/rules/RuleUI";
import { ActiveGame } from "@/src/hooks/interface";
import { Button } from "primereact/button";
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          🏆 สรุปผลเกม
        </h1>
        <p className="text-gray-400 text-lg">คะแนนของทุกคนในเกมนี้</p>
      </div>

      {activeGame.playerInGame.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-700 border-2 border-yellow-500">
            <div className="text-center py-6">
              <i className="pi pi-trophy text-6xl text-white mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">ผู้ชนะ!</h2>
              <p className="text-5xl font-bold text-white mb-2">{"asdd"}</p>
              <p className="text-2xl text-yellow-100">{2} คะแนน</p>
            </div>
          </Card>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-30">
        <div className="container mx-auto max-w-7xl flex gap-3 justify-center">
          <Button
            label="กลับไปหน้าห้อง"
            icon="pi pi-refresh"
            size="large"
            className="flex-1 md:flex-none"
            onClick={onBackToRooms}
          />
        </div>
      </div>

      {/* Scoring Rules */}
      <RuleUI />
    </div>
  );
};
