import type { SecondaryButtonProps } from "../../types/ui";
import "./SecondaryButton.css";

export default function SecondaryButton({
  children,
  fullWidth = false,
  ...rest
}: SecondaryButtonProps) {
  return (
    <button {...rest} className={`btnSecondary ${fullWidth ? "btnFull" : ""}`}>
      <span className="btnLabel">{children}</span>
    </button>
  );
}
