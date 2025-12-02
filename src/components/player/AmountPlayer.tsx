import { map } from "lodash";
interface AmountPlayerProps {
  current: number;
  max: number;
}
export const AmountPlayer: React.FC<AmountPlayerProps> = ({ current, max }) => {
  return (
    <div className="flex items-center gap-1">
      {map(Array.from({ length: max }), (_, index) => {
        const isStay = index <= current - 1;
        return (
          <div
            key={index}
            className={`w-[4px] h-[12px] ${
              isStay ? "bg-indigo-500" : "bg-gray-500"
            }`}
          />
        );
      })}
      {/* {room.currentPlayers}/{room.maxPlayers} ผู้เล่น */}
    </div>
  );
};
