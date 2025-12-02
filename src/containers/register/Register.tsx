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

          {/* Magician Hat (Classic tall cone with wide brim) */}
          <g filter="url(#glow)">
            {/* Wide circular brim */}
            <ellipse
              cx="60"
              cy="50"
              rx="35"
              ry="8"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
            />

            {/* Tall cone body - curved for realistic magician hat */}
            <path
              d="M32 50 Q40 45, 45 35 L55 15 Q60 8, 65 15 L75 35 Q80 45, 88 50"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hat band with decorative buckle */}
            <path
              d="M32 50 L88 50"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Decorative buckle on band */}
            <rect
              x="56"
              y="47"
              width="8"
              height="6"
              rx="1"
              stroke="url(#glowGradient)"
              strokeWidth="2"
              fill="none"
            />

            {/* Moon and stars decorations on hat */}
            <path
              d="M50 25 Q48 22, 50 20 Q52 22, 50 25"
              stroke="url(#glowGradient)"
              strokeWidth="2"
              fill="url(#glowGradient)"
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Twinkling stars */}
            <circle cx="68" cy="28" r="2" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="1.5;3;1.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="45" cy="32" r="1.5" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="1;2.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="70" cy="18" r="1.5" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="1;2;1"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Head - Realistic face shape */}
          <g filter="url(#glow)">
            {/* Face outline - oval shape with defined jawline */}
            <path
              d="M48 58 Q45 62, 45 68 Q45 75, 48 80 Q52 84, 60 85 Q68 84, 72 80 Q75 75, 75 68 Q75 62, 72 58 Q68 54, 60 54 Q52 54, 48 58 Z"
              stroke="url(#glowGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left Ear */}
            <path
              d="M44 65 Q41 65, 40 68 Q40 71, 41 74 Q42 75, 44 74"
              stroke="url(#glowGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Right Ear */}
            <path
              d="M76 65 Q79 65, 80 68 Q80 71, 79 74 Q78 75, 76 74"
              stroke="url(#glowGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Face Features */}
          <g filter="url(#glow)">
            {/* Left Eye */}
            <circle cx="53" cy="67" r="2" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="2;0.5;2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Right Eye */}
            <circle cx="67" cy="67" r="2" fill="url(#glowGradient)">
              <animate
                attributeName="r"
                values="2;0.5;2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Nose */}
            <line
              x1="60"
              y1="70"
              x2="60"
              y2="74"
              stroke="url(#glowGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M60 74 Q58 75, 57 75"
              stroke="url(#glowGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Smiling Mouth */}
            <path
              d="M53 77 Q60 80, 67 77"
              stroke="url(#glowGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M53 77 Q60 80, 67 77;M53 77 Q60 81, 67 77;M53 77 Q60 80, 67 77"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

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
              maxLength={20}
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
            className="w-full !mt-8"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
              border: "none",
              boxShadow:
                "0 8px 16px rgba(139, 92, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(139, 92, 246, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(139, 92, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
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
