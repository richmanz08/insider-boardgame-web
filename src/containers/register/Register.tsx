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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="card flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Insider Game
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="playerName" className="font-semibold">
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
                pattern: {
                  value: /^[a-zA-Z0-9\u0E00-\u0E7F]+$/,
                  message:
                    "ชื่อต้องเป็นตัวอักษร a-z, A-Z, 0-9 หรือภาษาไทยเท่านั้น",
                },
              })}
              placeholder="กรุณากรอกชื่อของคุณ"
              className={`w-full ${errors.playerName ? "p-invalid" : ""}`}
            />
            {errors.playerName && (
              <small className="text-red-500">
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
