# Toast System - วิธีการใช้งาน

## การ Setup

Toast Provider ถูก setup แล้วใน `InsiderAppProvider.tsx` ครอบทั้งแอพพลิเคชัน

## วิธีใช้งาน

### 1. Import useToast hook

```tsx
import { useToast } from "@/src/contexts/ToastContext";
```

### 2. เรียกใช้ใน Component

```tsx
function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast("success", "บันทึกข้อมูลสำเร็จ");
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Toast Types

### Success (สีเขียว)

```tsx
showToast("success", "บันทึกข้อมูลสำเร็จ");
```

### Error (สีแดง)

```tsx
showToast("error", "รหัสผ่านไม่ถูกต้อง");
```

### Warning (สีเหลือง)

```tsx
showToast("warning", "กรุณาตรวจสอบข้อมูล");
```

### Info (สีน้ำเงิน)

```tsx
showToast("info", "มีข้อความใหม่");
```

## ตัวอย่างการใช้งานจริง

### ใน Form Submit

```tsx
const handleSubmit = async () => {
  try {
    await saveData();
    showToast("success", "บันทึกข้อมูลสำเร็จ");
  } catch (error) {
    showToast("error", "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  }
};
```

### ใน Authentication

```tsx
const handleLogin = async () => {
  const result = await login(username, password);
  if (result.success) {
    showToast("success", "เข้าสู่ระบบสำเร็จ");
  } else {
    showToast("error", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
};
```

## Features

- ✅ แสดงตรงกลางด้านล่างของหน้าจอ
- ✅ รองรับ 4 สถานะ: success, error, warning, info
- ✅ Auto-dismiss หลัง 3 วินาที
- ✅ สามารถปิดด้วยตนเองได้
- ✅ มี animation slide up สวยงาม
- ✅ แสดงได้หลายข้อความพร้อมกัน
- ✅ Backdrop blur effect
- ✅ Icon และสีที่เหมาะสมกับแต่ละประเภท
