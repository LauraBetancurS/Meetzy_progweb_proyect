
import type { PrimaryButtonProps } from "../../types/ui";
import "./PrimaryButton.css";

export default function PrimaryButton({
  children,
  fullWidth = false,
  showPlusIcon = true,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button {...rest} className={`btnPrimary ${fullWidth ? "btnFull" : ""}`}>
      {showPlusIcon && (
        <svg className="btnIcon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      <span className="btnLabel">{children}</span>
    </button>
  );
}
