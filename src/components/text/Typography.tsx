interface TypographyProps {
  children: React.ReactNode;
  type?:
    | "bigheader"
    | "header"
    | "title"
    | "subtitle"
    | "subheader"
    | "label"
    | "body"
    | "strong-body"
    | "description"
    | "small"
    | "";

  className?: string;
  maxLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  type,
  className,
  maxLines,
}) => {
  const typeStyles: Record<string, string> = {
    bigheader: "text-3xl font-bold",
    header: "text-2xl font-bold",
    title: "text-2xl font-semibold tracking-widest",
    subtitle: "text-2xl font-semibold tracking-wider",
    subheader: "text-2xl font-medium",
    label: "text-1xl font-medium",
    body: "text-base",
    "strong-body": "text-base font-semibold",
    description: "text-sm font-light",
    small: "text-xs font-light",
  };

  // ⭐ CSS สำหรับจำกัดจำนวนบรรทัด
  const maxLinesStyle = maxLines
    ? {
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {};

  return (
    <div
      className={`${typeStyles[type || "body"]} ${className || ""}`}
      style={maxLinesStyle}
    >
      {children}
    </div>
  );
};
