interface ButtonProps {
  label?: string;
  icon?: string;
  onClick: () => void;
  severity?: ButtonSeverity;
  outlined?: boolean;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}
type ButtonSize = "small" | "medium" | "large";
type ButtonSeverity =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "indigo"
  | "btntext";

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  severity,
  outlined,
  size,
  disabled,
  className,
}) => {
  const styleClass: Record<string, string> = {
    primary: "btn-grad",
    secondary: "btn-secondary",
    info: "btn-info",
    success: "btn-grad-success ",
    warning: "btn-grad-warn",
    danger: "btn-grad-danger",
    indigo: "btn-grad-indigo",
    btntext: "btn-text",
  };
  const sizeClass: Record<string, string> = {
    small: "h-[34px] px-4 py-2",
    medium: "h-[40px] px-5 py-2",
    large: "h-[48px] px-6 py-3 text-lg font-semibold",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn ${sizeClass[size ?? "medium"]} ${
        styleClass[severity ?? "primary"]
      } ${outlined ? "outlined !bg-inherit" : ""} ${
        disabled ? "disabled-button" : "cursor-pointer"
      } active:scale-95 transition-transform duration-200 ${className ?? ""}`}
    >
      {icon && <i className={`pi ${icon} ${label ? "mr-2" : ""}`} />}
      {label}
    </button>
  );
};
