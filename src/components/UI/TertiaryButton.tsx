import type { TertiaryButtonProps } from "../../types/ui";
import "./TertiaryButton.css";

export default function TertiaryButton({
  children,
  fullWidth = false,
  ...rest
}: TertiaryButtonProps) {
  return (
    <button
      {...rest}
      className={`btnTertiary ${fullWidth ? "btnFull" : ""}`}
    >
      <span className="btnTertiaryLabel">{children}</span>
    </button>
  );
}