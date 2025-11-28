import { Avatar } from "@/src/components/avatar/Avatar";
import { PlayerData } from "@/src/hooks/interface";

interface WaitingOpenCardBoxProps {
  players: PlayerData[];
  openedCard: Record<string, boolean>;
}
export const WaitingOpenCardBox: React.FC<WaitingOpenCardBoxProps> = ({
  players,
  openedCard,
}) => {
  return (
    <div className="text-center mt-8 animate-fade-in w-full mt-16">
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 inline-block min-w-[300px] w-full flex flex-col items-center justify-center">
        <i className="pi pi-spin pi-spinner text-3xl text-blue-400 mb-3" />
        <p className="text-lg text-blue-300 font-semibold mb-3">
          รอผู้เล่นคนอื่นเปิดการ์ด...
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 w-full">
          {players.map((player) => {
            const isOpened = openedCard[player.uuid];
            return (
              <div
                className={`opacity-${isOpened ? 100 : 60} border-2 border-${
                  isOpened ? "green" : "gray"
                }-500 rounded-full p-0.5 transition-opacity shadow-lg`}
                key={player.uuid}
              >
                <Avatar size="sm" name={player.playerName} />
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-400 mt-4">
          เกมจะเริ่มอัตโนมัติเมื่อทุกคนพร้อม
        </p>
      </div>
    </div>
  );
};
