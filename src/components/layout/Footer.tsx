import { Typography } from "../text/Typography";

export const FooterLayout: React.FC = () => {
  return (
    <footer className="w-full pt-4 px-4 text-white text-center">
      <Typography type="description" className="text-gray-400">
        © 2025 Insider Boardgame. All rights reserved. <br /> by Arnon Rungrueng
      </Typography>
    </footer>
  );
};
