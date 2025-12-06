import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import { Avatar } from "../avatar/Avatar";
import { Typography } from "../text/Typography";
import Image from "next/image";

export const Header = () => {
  const meState = useSelector((state: RootState) => state.me);
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative">
          <Image
            src="/joker.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full"
            priority
            unoptimized
          />
        </div>

        <Typography type="header" className="max-sm:hidden">
          Insider Online play!
        </Typography>
      </div>
      <div className="flex items-center gap-3">
        {meState.me && <p>{meState.me.playerName}</p>}
        <Avatar name={meState.me?.playerName ?? ""} />
      </div>
    </div>
  );
};
