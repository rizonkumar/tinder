import { useState, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MONTH_NAMES, DAYS_OF_WEEK } from "../../constants";
import { formatLocalDate, formatDisplayDate } from "../../utils/dateUtils";
import useClickOutside from "../../hooks/useClickOutside";

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date(),
  );
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(year, month, day);
    const formatted = formatLocalDate(selected);
    onChange(formatted);
    setIsOpen(false);
  };

  const formattedDisplay = formatDisplayDate(value);

  // Check if a day is today
  const today = new Date();
  const isToday = (d) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    d === today.getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="w-9 h-9" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected =
      value ===
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={() => handleSelectDay(d)}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-sans transition-colors ${
          isSelected
            ? "bg-pink-500 text-white"
            : isToday(d)
              ? "bg-pink-50 dark:bg-pink-950/20 text-pink-500 font-bold"
              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100"
        }`}
      >
        {d}
      </button>,
    );
  }

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-xs rounded-xl border px-3.5 py-3 cursor-pointer transition-all duration-200 font-sans ${
          isOpen
            ? "border-pink-500 bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-pink-500/15"
            : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 hover:border-slate-300 dark:hover:border-zinc-700"
        }`}
      >
        <span
          className={
            formattedDisplay
              ? "text-slate-800 dark:text-zinc-100 font-semibold"
              : "text-slate-400 dark:text-zinc-500 font-medium"
          }
        >
          {formattedDisplay || placeholder}
        </span>
        <Calendar
          size={14}
          className={`transition-colors duration-200 ${isOpen ? "text-pink-500" : "text-slate-400 dark:text-zinc-500"}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-[300px] z-[260] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-lg rounded-2xl p-4 flex flex-col font-sans"
          >
            <div className="flex items-center justify-between mb-4 text-xs font-bold text-slate-800 dark:text-zinc-100 font-outfit px-1 select-none">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus:outline-none"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tracking-wide text-sm font-bold">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus:outline-none"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 text-center mb-2 select-none">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="py-1 shrink-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center shrink-0">
              {calendarCells}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
