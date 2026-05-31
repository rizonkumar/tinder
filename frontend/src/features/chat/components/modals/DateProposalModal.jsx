import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVITY_OPTIONS } from "../../../../constants";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";
import CustomTimePicker from "../../../../components/common/CustomTimePicker";

const SPRING_TRANSITION = { type: "spring", stiffness: 350, damping: 25 };

function ActivitySelector({ selectedActivity, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 select-none">
      {Object.entries(ACTIVITY_OPTIONS).map(([key, act]) => {
        const isSelected = selectedActivity === key;
        const IconComponent = act.icon;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-outfit border transition-colors ${
              isSelected
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700"
            }`}
          >
            <IconComponent
              size={14}
              className={
                isSelected ? "text-white" : "text-slate-400 dark:text-zinc-500"
              }
            />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function DateProposalModal({
  isOpen,
  activeChatUser,
  onClose,
  onSendProposal,
}) {
  const [selectedActivity, setSelectedActivity] = useState("Coffee");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const resetState = () => {
    setSelectedActivity("Coffee");
    setDateInput("");
    setTimeInput("");
    setLocationInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateInput || !timeInput || !locationInput) {
      alert("Please fill in all date details");
      return;
    }

    const proposal = {
      date: dateInput,
      time: timeInput,
      location: locationInput.trim(),
      activity: selectedActivity,
      status: "pending",
    };

    await onSendProposal(
      `Proposed a date: ${selectedActivity}`,
      "date_proposal",
      "",
      proposal,
    );

    resetState();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && activeChatUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={SPRING_TRANSITION}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 shadow-2xl p-6 font-sans text-slate-800 dark:text-zinc-100 rounded-[32px] relative overflow-visible"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100 font-outfit flex items-center gap-2">
                <Calendar size={18} className="text-pink-500" />
                <span>Plan a Social Date</span>
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-355 focus:outline-none"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5 font-sans leading-relaxed">
              Choose a cute activity, pick a date and time, and suggest a nice
              venue to meet {activeChatUser.name}!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                  Choose Activity
                </label>
                <ActivitySelector
                  selectedActivity={selectedActivity}
                  onSelect={setSelectedActivity}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Date
                  </label>
                  <CustomDatePicker
                    value={dateInput}
                    onChange={setDateInput}
                    placeholder="Select Date"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                    Time
                  </label>
                  <CustomTimePicker
                    value={timeInput}
                    onChange={setTimeInput}
                    placeholder="Select Time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest font-outfit block">
                  Suggested Venue / Location
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500/80 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    required
                    placeholder="e.g. Starbucks Main St, Central Park..."
                    className="w-full text-xs rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 pl-9.5 pr-4 py-2.5 outline-none focus:border-pink-500 text-slate-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3 w-full">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all font-outfit focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-xl transition-colors font-outfit focus:outline-none flex items-center justify-center space-x-2"
                >
                  <Calendar size={14} />
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
