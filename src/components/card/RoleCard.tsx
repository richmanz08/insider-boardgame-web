import { usePlayHook } from "@/src/containers/play/hook";
import { RoleGame } from "@/src/hooks/interface";
import { Card } from "primereact/card";

interface RoleCardProps {
  role: RoleGame;
  answer: string;
  visible: boolean;
  onFlipCard: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  answer,
  visible,
  onFlipCard,
}) => {
  const { getRoleDisplay } = usePlayHook();

  return (
    <div className="perspective-1000 flex justify-center">
      <div
        className={`relative w-[300px] h-[430px] transition-transform duration-700 transform-style-3d ${
          visible ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Back Side */}
        <div
          className={`absolute inset-0 backface-hidden ${
            visible ? "pointer-events-none" : ""
          }`}
          style={{
            filter:
              "drop-shadow(0 10px 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 4px 8px rgba(96, 165, 250, 0.3))",
          }}
        >
          <Card
            className="!rounded-2xl bg-gradient-to-br w-[300px] h-[430px] from-gray-700 to-gray-900 border-2 border-gray-600 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:scale-105"
            onClick={onFlipCard}
            style={{
              boxShadow:
                "0 20px 40px -10px rgba(59, 130, 246, 0.6), 0 8px 16px -5px rgba(96, 165, 250, 0.4)",
            }}
          >
            <div className="flex flex-col items-center justify-between py-2 h-[400px]">
              <div />
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                <i className="pi pi-face-smile !text-3xl" />
              </div>

              <p className="text-gray-400 text-center">แตะเพื่อแสดง</p>
            </div>
          </Card>
        </div>

        {/* Front Side */}
        <div
          className={`absolute inset-0 backface-hidden ${
            visible ? "" : "pointer-events-none"
          }`}
          style={{
            transform: "rotateY(180deg)",
            filter:
              "drop-shadow(0 10px 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 4px 8px rgba(96, 165, 250, 0.3))",
          }}
        >
          <Card
            className={`!rounded-2xl bg-gradient-to-br w-[300px] h-[430px] ${
              getRoleDisplay(role).bgColor
            } border-2 border-opacity-50`}
            style={{
              boxShadow:
                "0 20px 40px -10px rgba(59, 130, 246, 0.6), 0 8px 16px -5px rgba(96, 165, 250, 0.4)",
            }}
            onClick={onFlipCard}
          >
            <div className="flex flex-col items-center justify-center py-8">
              {/* Role Icon */}
              <div className="w-24 h-24 rounded-full border border-gray-600 bg-opacity-20 flex items-center justify-center mb-6">
                <i
                  className={`pi ${
                    getRoleDisplay(role).icon
                  } text-gray-600 !text-4xl`}
                />
              </div>

              {/* Role Name */}
              <h2 className="text-4xl font-bold text-white mb-6">
                {getRoleDisplay(role).name}
              </h2>

              <div className="w-full space-y-4">
                {/* CITIZEN */}
                {role === RoleGame.CITIZEN && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-lg">คุณไม่ทราบคำตอบ</p>
                      <i className="pi pi-question-circle text-white text-3xl" />
                    </div>

                    <p className="text-gray-200 text-sm mt-2">
                      ถามคำถามเพื่อหาคำตอบ
                    </p>
                  </div>
                )}

                {/* MASTER */}
                {role === RoleGame.MASTER && (
                  <div className="space-y-3">
                    <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                      <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                      <p className="text-white text-2xl font-bold">
                        {answer ?? ""}
                      </p>
                    </div>

                    <div className="bg-amber-500 bg-opacity-20 rounded-lg p-4 flex items-center">
                      <i className="pi pi-info-circle mr-2" />
                      <p className="text-white-500 text-sm">
                        คุณต้องให้คำใบ้ผู้เล่นแต่ไม่ให้รู้คำตอบ
                      </p>
                    </div>
                  </div>
                )}

                {/* INSIDER */}
                {role === RoleGame.INSIDER && (
                  <div className="space-y-3">
                    <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                      <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                      <p className="text-white text-2xl font-bold">
                        {answer ?? ""}
                      </p>
                    </div>

                    <div className="bg-red-500 bg-opacity-20 rounded-lg p-4 flex items-center">
                      <i className="pi pi-eye mr-2" />
                      <p className="text-red-200 text-sm">
                        คุณต้องบงการผู้เล่นให้ไปสู่คำตอบ แต่อย่าให้ถูกจับได้!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
