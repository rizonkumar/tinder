import { MessageCircle } from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function NoChatSelected() {
  return (
    <div className="hidden h-full flex-1 items-center justify-center bg-background md:flex">
      <EmptyState
        icon={MessageCircle}
        title="Pick a conversation"
        description="Choose a match on the left to read your messages, plan a date or start a call."
      />
    </div>
  );
}
