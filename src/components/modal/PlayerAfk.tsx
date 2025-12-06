"use client";
import React, { useEffect } from "react";
import { Typography } from "@/src/components/text/Typography";
import { Button } from "@/src/components/button/Button";

interface PlayerAfkModalProps {
  open: boolean;
  playerName: string;
  onMoveToLobby: () => void;
  onReconnect: () => void;
}

export const PlayerAfkModal: React.FC<PlayerAfkModalProps> = ({
  open,
  playerName,
  onMoveToLobby,
  onReconnect,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop - ไม่สามารถคลิกปิดได้ */}
      <div className="fixed inset-0 bg-black/90 z-[100]" />
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="rounded-2xl shadow-2xl p-6 text-center max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-red-500 rounded-full h-[56px] w-[56px] flex items-center justify-center animate-pulse">
              <i className="pi pi-exclamation-triangle !text-3xl text-white" />
            </div>
          </div>

          {/* Title */}
          <Typography type="bigheader" className="mb-4 text-white">
            ผู้เล่น AFK!
          </Typography>

          {/* Player Name */}
          <div className="my-8">
            <Typography type="title" className="text-5xl text-red-400 mb-4">
              {playerName}
            </Typography>
            {/* <Typography type="subheader" className="text-gray-300">
              ไม่ได้ตอบสนอง
            </Typography> */}
          </div>

          {/* Message */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <Typography type="body" className="text-gray-200">
              ผู้เล่นไม่ได้ตอบสนองต่อเกม
            </Typography>
            <Typography type="description" className="text-gray-400 mt-2">
              คุณต้องการเชื่อมต่อใหม่หรือกลับไปที่ล็อบบี้?
            </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              label="เชื่อมต่อใหม่"
              icon="pi-refresh"
              onClick={onReconnect}
              severity="indigo"
              size="medium"
              className="w-full"
            />
            <Button
              label="กลับไปล็อบบี้"
              icon="pi-sign-out"
              onClick={onMoveToLobby}
              severity="secondary"
              size="medium"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};
