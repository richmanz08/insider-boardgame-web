interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showActive?: {
    show: boolean;
    active: boolean;
  };
}

export const Avatar = ({
  name,
  size = "md",
  className = "",
  showActive,
}: AvatarProps) => {
  // ดึงตัวอักษรแรกของชื่อ
  const getInitial = (name: string): string => {
    if (!name || name.trim().length === 0) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  // กำหนดขนาด Avatar
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  // สุ่มสีจากชื่อ (ให้ชื่อเดียวกันได้สีเดียวกันเสมอ)
  const getColorFromName = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    const charCode = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCode % colors.length];
  };

  const initial = getInitial(name);
  const bgColor = getColorFromName(name);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${bgColor}
        ${className}
        rounded-full
        flex items-center justify-center
        text-white font-bold
        select-none
        shadow-md
        relative
      `}
      title={name}
    >
      {initial}
      {showActive && showActive.show && (
        <div
          className="absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white"
          style={{
            backgroundColor: showActive?.active ? "#10b981" : "#6b7280",
          }}
          title={showActive?.active ? "ออนไลน์" : "ออฟไลน์"}
        />
      )}
    </div>
  );
};
