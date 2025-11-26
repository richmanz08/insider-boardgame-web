"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/redux/store";
import { playerValidateService } from "@/app/api/player/PlayerService";
import { updateMe } from "@/src/redux/slice/meSlice";
import { get } from "lodash";

interface AuthGuardProps {
  children: React.ReactNode;
}

// หน้าที่ไม่ต้องตรวจสอบ authentication
const PUBLIC_ROUTES = ["/register"];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const meState = useSelector((state: RootState) => state.me);
  const me = meState.me;

  const [isChecking, setIsChecking] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  // ตรวจสอบ token และ validate
  useEffect(() => {
    const validatePlayer = async () => {
      setIsChecking(true);

      // ถ้ามีข้อมูล me ใน Redux แล้ว
      if (me && me.uuid && me.playerName) {
        setIsValidated(true);
        setIsChecking(false);

        // ถ้ามีข้อมูลแล้วแต่อยู่หน้า register ให้ redirect ไปหน้าหลัก
        if (pathname === "/register") {
          console.log("Player already registered, redirecting to /");
          router.push("/");
        }
        return;
      }

      // ถ้ายังไม่มีข้อมูลใน Redux ลอง validate จาก token (cookie)
      try {
        const response = await playerValidateService();

        if (response && get(response, "success") && response.data) {
          // Validate สำเร็จ - บันทึกข้อมูลลง Redux
          console.log("Token validated successfully");
          dispatch(updateMe(response.data));
          setIsValidated(true);

          // ถ้าอยู่หน้า register ให้ redirect ไปหน้าหลัก
          if (pathname === "/register") {
            console.log("Player already registered, redirecting to /");
            router.push("/");
          }
        } else {
          // Validate ไม่สำเร็จ
          console.log("Token validation failed");
          setIsValidated(false);

          // ถ้าไม่ใช่หน้า register ให้ redirect ไป register
          if (!PUBLIC_ROUTES.includes(pathname)) {
            console.log("Player not registered, redirecting to /register");
            router.push("/register");
          }
        }
      } catch (error) {
        console.error("Validation error:", error);
        setIsValidated(false);

        // ถ้าไม่ใช่หน้า register ให้ redirect ไป register
        if (!PUBLIC_ROUTES.includes(pathname)) {
          console.log("Player not registered, redirecting to /register");
          router.push("/register");
        }
      } finally {
        setIsChecking(false);
      }
    };

    validatePlayer();
  }, [pathname, me, router, dispatch]);

  // กำลัง checking แสดง loading
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  // ถ้าเป็นหน้า register และ validated แล้ว (จะ redirect อยู่แล้ว)
  if (pathname === "/register" && isValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังเปลี่ยนหน้า...</p>
        </div>
      </div>
    );
  }

  // ถ้าเป็น protected route แต่ไม่ validated (จะ redirect อยู่แล้ว)
  if (!PUBLIC_ROUTES.includes(pathname) && !isValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังเปลี่ยนหน้า...</p>
        </div>
      </div>
    );
  }

  // แสดง children ตามปกติ
  return <>{children}</>;
};
