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
import { Logo } from "@/src/components/logo/Logo";
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
      <Logo />

      <div className="card flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Insider Game
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="playerName" className="font-semibold text-center">
              ชื่อผู้เล่น
            </label> */}
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
                    (value.trim().length > 0 && value.trim().length >= 3) ||
                    "ชื่อต้องมีตัวอักษร ไม่ใช่แค่ช่องว่าง, และต้องมีอย่างน้อย 3 ตัวอักษร",
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
