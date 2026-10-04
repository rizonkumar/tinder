import { useState, useRef } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseTime } from "../../utils/dateUtils";
import useClickOutside from "../../hooks/useClickOutside";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";
import PickerTrigger from "./PickerTrigger";

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

function TimeColumn({ label, options, selected, onSelect }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="pb-1.5 text-center text-xs text-foreground-muted">{label}</span>
      <div className="max-h-44 space-y-0.5 overflow-y-auto scrollbar-none" role="listbox" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={option === selected}
            onClick={() => onSelect(option)}
            className={cn(
              "tabular h-8 w-full rounded-md text-[0.8125rem] transition-colors focus-ring",
              option === selected ? "bg-primary font-medium text-primary-foreground" : "text-foreground hover:bg-surface-hover"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CustomTimePicker({ value, onChange, placeholder = "Pick a time", inline = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  const { hour, minute, period } = parseTime(value);
  const update = (next) => {
    const merged = { hour, minute, period, ...next };
    onChange(`${merged.hour}:${merged.minute} ${merged.period}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <PickerTrigger icon={Clock} value={value} placeholder={placeholder} isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "mt-2 rounded-lg border border-border bg-surface p-3 shadow-popover",
              inline ? "relative w-full" : "absolute left-0 top-full z-[90] w-72"
            )}
          >
            <div className="flex gap-2 divide-x divide-border">
              <TimeColumn label="Hour" options={HOURS} selected={hour} onSelect={(next) => update({ hour: next })} />
              <div className="flex flex-1 pl-2">
                <TimeColumn label="Minute" options={MINUTES} selected={minute} onSelect={(next) => update({ minute: next })} />
              </div>
              <div className="flex flex-1 pl-2">
                <TimeColumn label="Period" options={PERIODS} selected={period} onSelect={(next) => update({ period: next })} />
              </div>
            </div>
            <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
