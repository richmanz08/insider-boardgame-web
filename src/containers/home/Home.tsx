import React from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

interface PlayerFormData {
  playerName: string;
}

export const HomeContainer: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlayerFormData>({
    defaultValues: {
      playerName: "",
    },
  });

  const playerName = watch("playerName");

  const onSubmit = (data: PlayerFormData) => {
    console.log("Form submitted:", data);
    // ที่นี่สามารถทำอะไรต่อกับข้อมูลได้ เช่น navigate ไปหน้าอื่น
    router.push("/room/list");
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
            disabled={!playerName}
          />
        </form>

        {playerName && (
          <p className="text-center mt-4">
            สวัสดี, <strong>{playerName}</strong>!
          </p>
        )}
      </div>
    </div>
  );
};
