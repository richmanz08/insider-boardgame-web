interface TypographyProps {
  children: React.ReactNode;
  type?: "header" | "title" | "subtitle" | "subheader" | "body" | "description";
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  type,
  className,
}) => {
  const typeStyles: Record<string, string> = {
    header: "text-2xl font-bold",
    title: "text-2xl font-semibold tracking-widest",
    subtitle: "text-2xl font-semibold tracking-wider",
    subheader: "text-2xl font-medium",
    body: "text-base",
    description: "text-sm font-light",
  };
  //  normal: "tracking-normal",
  // wide: "tracking-wide",
  // wider: "tracking-wider",
  // widest: "tracking-widest",
  return (
    <div className={`${typeStyles[type || "body"]} ${className}`}>
      {children}
    </div>
  );
};
