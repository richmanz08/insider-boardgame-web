import { usePlayHook } from "@/src/containers/play/hook";
import { RoleAssignment } from "@/src/containers/play/Play";
import { RoleGame } from "@/src/hooks/interface";
import Image from "next/image";
import { Card } from "primereact/card";
import React, { useEffect } from "react";

interface DraftRoleCardProps {
  isCardFlipped: boolean;
  onFlipCard: () => void;
  my: RoleAssignment;
}

export const DraftRoleCard: React.FC<DraftRoleCardProps> = ({
  isCardFlipped,
  onFlipCard,
  my,
}) => {
  const { getRoleDisplay } = usePlayHook();

  const [timeRemaining, setTimeRemaining] = React.useState(10); // 10 seconds

  // countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining]);

  // auto flip card in 10 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isCardFlipped) {
      timer = setTimeout(() => {
        onFlipCard();
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCardFlipped, onFlipCard]);

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full max-w-md mx-auto transition-transform duration-700 transform-style-3d ${
          isCardFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          minHeight: isCardFlipped ? "auto" : "400px",
        }}
      >
        {/* Card Back (ด้านหลัง) */}
        <div
          className={`absolute inset-0 backface-hidden ${
            isCardFlipped ? "pointer-events-none" : ""
          }`}
        >
          <Card
            className="bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:scale-105"
            onClick={onFlipCard}
          >
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                <i className="pi pi-question text-white text-6xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">???</h2>
              <p className="text-gray-400 text-center">คลิกเพื่อเปิดการ์ด</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeRemaining <= 60
                    ? "bg-red-500"
                    : timeRemaining <= 180
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${(timeRemaining / 600) * 100}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Card Front (ด้านหน้า - เปิดแล้ว) */}
        <div
          className={`backface-hidden rotate-y-180 ${
            isCardFlipped ? "relative" : "absolute inset-0"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {my && (
            <Card
              className={`bg-gradient-to-br ${
                getRoleDisplay(my.role).bgColor
              } border-2 border-opacity-50`}
            >
              <div className="flex flex-col items-center justify-center py-8">
                {/* Role Icon */}
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6">
                  <i
                    className={`pi ${
                      getRoleDisplay(my.role).icon
                    } text-white text-5xl`}
                  />
                </div>

                {/* Role Name */}
                <h2 className="text-4xl font-bold text-white mb-6">
                  {getRoleDisplay(my.role).name}
                </h2>

                {/* Role Information */}
                <div className="w-full space-y-4">
                  {my.role === RoleGame.CITIZEN && (
                    <>
                      <i className="pi pi-question-circle text-white text-3xl mb-3" />
                      <p className="text-white text-lg">คุณไม่ทราบคำตอบ</p>
                      <p className="text-gray-200 text-sm mt-2">
                        ถามคำถามเพื่อหาคำตอบ
                      </p>
                    </>
                  )}

                  {my.role === RoleGame.MASTER && (
                    <div className="space-y-3">
                      {/* Image Display */}
                      {my.answer && (
                        <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 overflow-hidden border border-gray-700">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3">
                            <Image
                              src="/images/disneyland.png"
                              alt={my.answer || "Answer image"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover rounded-lg"
                              priority
                            />
                          </div>
                        </div>
                      )}

                      {/* Answer */}
                      <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                        <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                        <p className="text-white text-2xl font-bold">
                          {my.answer}
                        </p>
                      </div>

                      {/* Instruction */}
                      <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-yellow-200 text-sm">
                          <i className="pi pi-info-circle mr-2" />
                          คุณต้องให้คำใบ้ผู้เล่นแต่ไม่ให้รู้คำตอบ
                        </p>
                      </div>
                    </div>
                  )}

                  {my.role === RoleGame.INSIDER && (
                    <div className="space-y-3">
                      {/* Image Display */}
                      {my.answer && (
                        <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 overflow-hidden border border-gray-700">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3">
                            <Image
                              src="/images/disneyland.png"
                              alt={my.answer || "Answer image"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover rounded-lg"
                              priority
                            />
                          </div>
                        </div>
                      )}

                      {/* Answer */}
                      <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 border border-gray-600">
                        <p className="text-gray-300 text-xs mb-1">คำตอบ:</p>
                        <p className="text-white text-2xl font-bold">
                          {my.answer}
                        </p>
                      </div>

                      {/* Instruction */}
                      <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
                        <p className="text-red-200 text-sm">
                          <i className="pi pi-eye mr-2" />
                          คุณต้องบงการผู้เล่นให้ไปสู่คำตอบ แต่อย่าให้ถูกจับได้!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
