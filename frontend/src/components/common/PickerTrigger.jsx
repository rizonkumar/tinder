import { cn } from "../../utils/cn";
import { FIELD_CLASS } from "../ui/Field";

export default function PickerTrigger({ icon: Icon, value, placeholder, isOpen, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className={cn(FIELD_CLASS, "flex h-10 items-center justify-between text-left", isOpen && "border-border-strong")}
    >
      <span className={value ? "text-foreground" : "text-foreground-muted"}>{value || placeholder}</span>
      <Icon size={16} className="text-foreground-muted" aria-hidden="true" />
    </button>
  );
}
