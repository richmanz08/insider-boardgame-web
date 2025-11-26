import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import { Avatar } from "../avatar/Avatar";

export const Header = () => {
  const meState = useSelector((state: RootState) => state.me);
  return (
    <div className="flex items-center justify-between mb-4">
      <div>Insider BoardGame</div>
      <div className="flex items-center gap-3">
        <Avatar name={meState.me?.playerName ?? ""} />
        {meState.me && <p>{meState.me.playerName}</p>}
      </div>
    </div>
  );
};
