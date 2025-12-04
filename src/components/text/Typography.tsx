interface TypographyProps {
  children: React.ReactNode;
  type?: "header" | "title" | "subheader" | "body";
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  type,
  className,
}) => {
  const typeStyles: Record<string, string> = {
    header: "text-2xl font-bold",
    title: "text-2xl font-semibold",
    subheader: "text-2xl font-medium",
    body: "text-base",
  };
  return (
    <div className={`${typeStyles[type || "body"]} ${className}`}>
      {children}
    </div>
  );
};
