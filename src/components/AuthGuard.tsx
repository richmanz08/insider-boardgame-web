"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

// หน้าที่ไม่ต้องตรวจสอบ authentication
const PUBLIC_ROUTES = ["/register"];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const meState = useSelector((state: RootState) => state.me);
  const me = meState.me;

  // ถ้าเป็นหน้า public ให้ผ่านไปเลย
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // ถ้าเป็น public route ไม่ต้องเช็ค
    if (isPublicRoute) return;

    // ถ้ายังไม่มีข้อมูล player (ยังไม่ register)
    if (!me || !me.uuid || !me.playerName) {
      console.log("Player not registered, redirecting to /register");
      router.push("/register");
    }
  }, [me, router, isPublicRoute, pathname]);

  // ถ้าเป็น public route ให้แสดงเลย
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // ถ้ายังไม่มีข้อมูล แสดง loading
  if (!me || !me.uuid || !me.playerName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-400">กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  // ถ้ามีข้อมูลแล้ว แสดง children
  return <>{children}</>;
};
