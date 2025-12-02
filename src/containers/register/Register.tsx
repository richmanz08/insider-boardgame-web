/* eslint-disable react-hooks/incompatible-library */
import React from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { playerRegisterService } from "@/app/api/player/PlayerService";
import { useDispatch } from "react-redux";
import { updateMe } from "@/src/redux/slice/meSlice";
import { get } from "lodash";
import { setCookie } from "cookies-next";
import { TOKEN_NAME } from "@/src/config/system";
interface PlayerFormData {
  playerName: string;
}

export const RegisterContainer: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlayerFormData>({
    defaultValues: {
      playerName: "",
    },
    mode: "onChange",
  });

  const name = watch("playerName");

  const onSubmit = async (data: PlayerFormData) => {
    try {
      const response = await playerRegisterService({
        playerName: data.playerName,
      });
      console.log("Player registration response:", response);

      if (get(response, "success") && response) {
        router.push("/");
        setCookie(TOKEN_NAME, response.data.token);
        dispatch(updateMe(response.data));
      }
    } catch (error) {
      console.error("Error during player registration:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[88vh] p-8">
      {/* Magician Icon with Animation */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <svg
          width="150"
          height="150"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative magician-icon"
        >
          <defs>
            {/* Gradient for glow animation */}
            <linearGradient
              id="glowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a78bfa">
                <animate
                  attributeName="stop-color"
                  values="#a78bfa;#ec4899;#8b5cf6;#a78bfa"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#ec4899">
                <animate
                  attributeName="stop-color"
                  values="#ec4899;#8b5cf6;#a78bfa;#ec4899"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#8b5cf6">
                <animate
                  attributeName="stop-color"
                  values="#8b5cf6;#a78bfa;#ec4899;#8b5cf6"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Filter for glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Wizard Hat */}
          <g filter="url(#glow)">
            <path
              d="M60 10 L35 50 L85 50 Z"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hat Brim */}
            <ellipse
              cx="60"
              cy="50"
              rx="28"
              ry="6"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
            />
            {/* Hat Band */}
            <rect
              x="35"
              y="45"
              width="50"
              height="8"
              rx="2"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
            />

            {/* Star decorations on hat */}
            <circle cx="60" cy="30" r="2" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="2;3;2"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="38" r="1.5" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="1.5;2.5;1.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="70" cy="38" r="1.5" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="1.5;2.5;1.5"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Head (Circle) */}
          <circle
            cx="60"
            cy="70"
            r="18"
            stroke="url(#glowGradient)"
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
          />

          {/* Body (Triangle/Robe) */}
          <g filter="url(#glow)">
            <path
              d="M50 88 L60 110 L70 88"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="60"
              y1="88"
              x2="60"
              y2="110"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Arms */}
          <g filter="url(#glow)">
            <path
              d="M50 90 L40 95 L38 100"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M70 90 L80 95 L82 100"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Magic Wand */}
          <line
            x1="82"
            y1="100"
            x2="95"
            y2="85"
            stroke="url(#glowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Star on wand */}
          <path
            d="M95 85 L97 80 L99 85 L104 85 L100 88 L102 93 L97 90 L92 93 L94 88 L90 85 Z"
            stroke="url(#glowGradient)"
            strokeWidth="1.5"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 97 87"
              to="360 97 87"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>

          {/* Sparkles */}
          <circle cx="25" cy="30" r="2" fill="#8b5cf6" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="95" cy="40" r="2" fill="#6366f1" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="20" cy="70" r="2" fill="#a78bfa" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="100" cy="70" r="2" fill="#8b5cf6" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div className="card flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Insider Game
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="playerName" className="font-semibold text-center">
              ชื่อผู้เล่น
            </label>
            <InputText
              id="playerName"
              {...register("playerName", {
                required: "กรุณากรอกชื่อของคุณ",
                minLength: {
                  value: 2,
                  message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
                },
                validate: {
                  notOnlySpaces: (value) =>
                    value.trim().length > 0 ||
                    "ชื่อต้องมีตัวอักษร ไม่ใช่แค่ช่องว่าง",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\u0E00-\u0E7F\s]+$/,
                  message:
                    "ชื่อต้องเป็นตัวอักษร a-z, A-Z, 0-9 หรือภาษาไทยเท่านั้น",
                },
              })}
              placeholder="กรุณากรอกชื่อของคุณ"
              className={`w-full text-center border-0 border-b-2 rounded-none focus:ring-0 h-[54px] ${
                errors.playerName
                  ? "border-b-red-500"
                  : "border-b-gray-300 focus:border-b-blue-500"
              }`}
              style={{
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                boxShadow: "none",
              }}
            />
            {errors.playerName && (
              <small className="text-red-500 text-center block">
                {errors.playerName.message}
              </small>
            )}
          </div>

          <Button
            type="submit"
            label="เริ่มเกม"
            className="w-full"
            disabled={!name}
          />
        </form>

        {name && (
          <p className="text-center mt-4">
            สวัสดี, <strong>{name}</strong>!
          </p>
        )}
      </div>
    </div>
  );
};
