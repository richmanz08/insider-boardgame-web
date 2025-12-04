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
  | "indigo";

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
    success: "btn-success",
    warning: "btn-grad-warn",
    danger: "btn-grad-danger",
    indigo: "btn-grad-indigo",
  };
  const sizeClass: Record<string, string> = {
    small: "h-[34px] px-4 py-2",
    medium: "h-[40px] px-5 py-2",
    large: "h-[48px]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn ${sizeClass[size ?? "medium"]} ${
        styleClass[severity ?? "primary"]
      } ${outlined ? "outlined !bg-inherit" : ""} ${
        disabled ? "disabled-button" : "cursor-pointer"
      } ${className ?? ""}`}
    >
      {icon && <i className={`pi ${icon} ${label ? "mr-2" : ""}`} />}
      {label}
    </button>
  );
};
