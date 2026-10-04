import { useState, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MONTH_NAMES, DAYS_OF_WEEK } from "../../constants";
import { formatLocalDate, formatDisplayDate } from "../../utils/dateUtils";
import useClickOutside from "../../hooks/useClickOutside";
import { IconButton } from "../ui/IconButton";
import { cn } from "../../utils/cn";
import PickerTrigger from "./PickerTrigger";

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export default function CustomDatePicker({ value, onChange, placeholder = "Pick a day", inline = false, allowPast = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(`${value}T00:00`) : new Date()));
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = startOfToday();
  const isViewingPastMonth = !allowPast && new Date(year, month, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);

  const selectDay = (day) => {
    onChange(formatLocalDate(new Date(year, month, day)));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <PickerTrigger
        icon={Calendar}
        value={formatDisplayDate(value)}
        placeholder={placeholder}
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "mt-2 rounded-lg border border-border bg-surface p-3 shadow-popover",
              inline ? "relative w-full" : "absolute left-0 top-full z-[90] w-[18.5rem]"
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <IconButton label="Previous month" size="sm" onClick={() => setViewDate(new Date(year, month - 1, 1))} disabled={isViewingPastMonth}>
                <ChevronLeft />
              </IconButton>
              <span className="label-14 text-foreground">
                {MONTH_NAMES[month]} {year}
              </span>
              <IconButton label="Next month" size="sm" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                <ChevronRight />
              </IconButton>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-foreground-muted">
              {DAYS_OF_WEEK.map((day) => (
                <span key={day} className="py-1.5">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {Array.from({ length: firstWeekday }).map((_, index) => (
                <span key={`blank-${index}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
                const cellDate = new Date(year, month, day);
                const iso = formatLocalDate(cellDate);
                const isSelected = value === iso;
                const isToday = cellDate.getTime() === today.getTime();
                const isDisabled = !allowPast && cellDate < today;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => selectDay(day)}
                    aria-pressed={isSelected}
                    aria-label={cellDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                    className={cn(
                      "tabular mx-auto flex size-9 items-center justify-center rounded-md text-[0.8125rem] transition-colors focus-ring disabled:cursor-not-allowed disabled:text-foreground-muted/50",
                      isSelected
                        ? "bg-primary font-medium text-primary-foreground"
                        : isToday
                          ? "font-semibold text-accent hover:bg-surface-hover"
                          : "text-foreground hover:bg-surface-hover"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
