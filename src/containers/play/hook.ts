import { RoleGame } from "@/src/hooks/interface";

export const usePlayHook = () => {
  function getRoleDisplay(role: RoleGame) {
    switch (role) {
      case RoleGame.INSIDER:
        return {
          name: "Insider",
          color: "text-red-500",
          bgColor: "from-red-600 to-red-800",
          icon: "pi-eye",
          description: "บงการผู้เล่นไปสู่คำตอบโดยไม่ให้ถูกจับได้",
        };
      case RoleGame.MASTER:
        return {
          name: "Master",
          color: "text-purple-500",
          bgColor: "from-purple-600 to-purple-800",
          icon: "pi-crown",
          description: "ให้คำใบ้โดยไม่เปิดเผยคำตอบโดยตรง",
        };
      case RoleGame.CITIZEN:
        return {
          name: "Player",
          color: "text-blue-500",
          bgColor: "from-blue-600 to-blue-800",
          icon: "pi-user",
          description: "ถามคำถามเพื่อหาคำตอบ",
        };
    }
  }
  return { getRoleDisplay };
};
