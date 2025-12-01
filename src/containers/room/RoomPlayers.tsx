import { PlayerCard } from "@/src/components/card/PlayerCard";
import { PlayerCardEmpty } from "@/src/components/card/PlayerCardEmpty";
import { PlayerData, RoomUpdateMessage } from "@/src/hooks/interface";
import { map } from "lodash";
import { Button } from "primereact/button";
import { useContext } from "react";
import { RoomContext } from "./Room";
interface RoomPlayersListProps {
  room: RoomUpdateMessage;
  me: PlayerData;
  allReady: boolean;
  onToggleReady: () => void;
}
export const RoomPlayersList: React.FC<RoomPlayersListProps> = ({
  room,
  me,
  allReady,
  onToggleReady,
}) => {
  const { isHost } = useContext(RoomContext);
  return (
    <div>
      <>
        {/* Players Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">ผู้เล่นในห้อง</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {map(room.players || [], (player) => (
              <PlayerCard key={player.uuid} player={player} />
            ))}

            {/* Empty Slots */}
            {Array.from({
              length: room.maxPlayers - (room?.players.length || 0),
            }).map((_, index) => (
              <PlayerCardEmpty key={`empty-${index}`} />
            ))}
          </div>
        </div>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 p-4 z-30">
          <div className="container mx-auto max-w-6xl flex gap-4 justify-center">
            <Button
              label={me?.ready ? "ยกเลิกพร้อม" : "พร้อม"}
              icon={me?.ready ? "pi pi-times" : "pi pi-check"}
              severity={me?.ready ? "secondary" : "success"}
              size="large"
              onClick={function () {
                onToggleReady();
              }}
              className="w-full md:w-auto min-w-[200px]"
            />
          </div>
        </div>

        {/* Spacer for fixed button */}
        <div className="h-24" />

        {/* Host Info */}
        {isHost && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              <i className="pi pi-crown mr-1" />
              คุณเป็นหัวห้อง เกมจะเริ่มอัตโนมัติเมื่อทุกคนพร้อม
            </p>
            {!allReady && (
              <p className="text-sm text-yellow-500 mt-2">
                <i className="pi pi-exclamation-triangle mr-1" />
                รอผู้เล่น {room?.players.filter((p) => !p.ready).length}{" "}
                คนกดพร้อม
              </p>
            )}
          </div>
        )}
      </>
    </div>
  );
};
