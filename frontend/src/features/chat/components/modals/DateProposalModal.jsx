import { useState } from "react";
import { CalendarHeart, MapPin, AlertCircle } from "lucide-react";
import { ACTIVITY_OPTIONS } from "../../../../constants";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Field, Input } from "../../../../components/ui/Field";
import { ToggleChip } from "../../../../components/ui/ToggleChip";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";
import CustomTimePicker from "../../../../components/common/CustomTimePicker";

const DEFAULT_ACTIVITY_KEY = "Coffee";
const FORM_ID = "date-proposal-form";

export default function DateProposalModal({ isOpen, activeChatUser, onClose, onSendProposal }) {
  const [activity, setActivity] = useState(DEFAULT_ACTIVITY_KEY);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const reset = () => {
    setActivity(DEFAULT_ACTIVITY_KEY);
    setDate("");
    setTime("");
    setLocation("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!date || !time || !location.trim()) {
      setError("Pick a date, a time and a place before sending.");
      return;
    }
    setIsSending(true);
    await onSendProposal(`Proposed a date: ${activity}`, "date_proposal", "", {
      date,
      time,
      location: location.trim(),
      activity,
      status: "pending",
    });
    setIsSending(false);
    handleClose();
  };

  return (
    <Modal
      open={isOpen && !!activeChatUser}
      onClose={handleClose}
      icon={CalendarHeart}
      title="Propose a date"
      description={activeChatUser ? `${activeChatUser.name} can accept or decline from the chat.` : undefined}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={isSending}>
            Send proposal
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5 p-5" noValidate>
        <Field label="What">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Activity">
            {Object.entries(ACTIVITY_OPTIONS).map(([key, option]) => (
              <ToggleChip key={key} role="radio" icon={option.icon} selected={activity === key} onToggle={() => setActivity(key)}>
                {option.label}
              </ToggleChip>
            ))}
          </div>
        </Field>
        <Field label="Day">
          <CustomDatePicker value={date} onChange={setDate} placeholder="Pick a day" inline />
        </Field>
        <Field label="Time">
          <CustomTimePicker value={time} onChange={setTime} placeholder="Pick a time" inline />
        </Field>
        <Field label="Where">
          {(id) => (
            <Input
              id={id}
              icon={MapPin}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="A café, a park, a restaurant"
            />
          )}
        </Field>
        {error && (
          <p className="flex items-center gap-2 copy-13 text-danger" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
