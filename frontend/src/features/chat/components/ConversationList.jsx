import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, MessageCircle } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
import { Input } from "../../../components/ui/Field";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ROUTES } from "../../../constants/navigation";
import { isChatVerified } from "../utils/verifiedChats";
import { cn } from "../../../utils/cn";

function ConversationItem({ match, isOnline, isActive }) {
  const verified = isChatVerified(match._id);
  return (
    <li>
      <Link
        to={`${ROUTES.chat}/${match._id}`}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors focus-ring",
          isActive ? "bg-surface-active" : "hover:bg-surface-hover"
        )}
      >
        <Avatar src={match.image} alt={match.name} size="md" online={isOnline} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="label-14 truncate text-foreground">{match.name}</p>
            {verified && <ShieldCheck size={13} className="shrink-0 text-success" aria-label="Verified chat" />}
          </div>
          <p className={cn("copy-13 truncate", isOnline ? "text-success" : "text-foreground-muted")}>
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default function ConversationList({ matches, isLoading, onlineUsers, activeId, className }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = matches || [];
    const sorted = [...list].sort((a, b) => Number(onlineUsers.includes(b._id)) - Number(onlineUsers.includes(a._id)));
    return term ? sorted.filter((match) => match.name.toLowerCase().includes(term)) : sorted;
  }, [matches, onlineUsers, query]);

  return (
    <section aria-label="Conversations" className={cn("flex h-full flex-col bg-surface", className)}>
      <div className="flex flex-col gap-3 border-b border-border px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="heading-20 text-foreground">Messages</h1>
          <span className="label-12 tabular text-foreground-muted">{matches?.length || 0}</span>
        </div>
        <Input
          icon={Search}
          type="search"
          placeholder="Search matches"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search matches"
          className="h-9"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <ul className="space-y-1">
            {[0, 1, 2, 3].map((item) => (
              <li key={item} className="flex items-center gap-3 px-2.5 py-2">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <EmptyState
            compact
            icon={MessageCircle}
            title={query ? "No matches found" : "No conversations yet"}
            description={query ? "Try a different name." : "Match with someone and your chat will show up here."}
          />
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((match) => (
              <ConversationItem
                key={match._id}
                match={match}
                isOnline={onlineUsers.includes(match._id)}
                isActive={activeId === match._id}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
