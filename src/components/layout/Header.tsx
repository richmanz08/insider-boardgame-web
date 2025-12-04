import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import { Avatar } from "../avatar/Avatar";
import { Logo } from "../logo/Logo";
import { Typography } from "../text/Typography";

export const Header = () => {
  const meState = useSelector((state: RootState) => state.me);
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="!scale-40 w-6 h-6 -mt-8">
          <Logo />
        </div>

        <Typography type="header" className="ml-12 mt-3 max-sm:hidden">
          Insider BoardGame
        </Typography>
      </div>
      <div className="flex items-center gap-3 pr-2">
        {meState.me && <p>{meState.me.playerName}</p>}
        <Avatar name={meState.me?.playerName ?? ""} />
      </div>
    </div>
  );
};
