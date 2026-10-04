import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles, Clock } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { useMatchStore } from "../../store/useMatchStore";
import { PageHeader } from "../../components/ui/PageHeader";
import { Tabs } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { CardGridSkeleton } from "../../components/ui/Skeleton";
import { ProfileCard } from "../../components/ProfileCard";
import { ROUTES } from "../../constants/navigation";

const TAB = { matches: "matches", liked: "liked" };

export default function MatchesPage() {
  const { getMyMatches, matches, isLoadingMyMatches, getLikedUsers, likedUsers, isLoadingLikedUsers } = useMatchStore();
  const [activeTab, setActiveTab] = useState(TAB.matches);
  const navigate = useNavigate();

  useEffect(() => {
    getMyMatches();
    getLikedUsers();
  }, [getMyMatches, getLikedUsers]);

  const tabs = [
    { value: TAB.matches, label: "Mutual matches", icon: Heart, count: matches?.length || 0 },
    { value: TAB.liked, label: "People you liked", icon: Sparkles, count: likedUsers?.length || 0 },
  ];

  const renderMatches = () => {
    if (isLoadingMyMatches) return <CardGridSkeleton />;
    if (!matches?.length) {
      return (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon={Heart}
            title="No matches yet"
            description="When someone you liked likes you back, they show up here and you can start chatting."
            actions={[{ label: "Start swiping", onClick: () => navigate(ROUTES.swipe) }]}
          />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {matches.map((match) => (
          <ProfileCard
            key={match._id}
            profile={match}
            badge={<Badge tone="success" icon={Heart}>Matched</Badge>}
            footer={
              <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate(`${ROUTES.chat}/${match._id}`)}>
                <MessageCircle aria-hidden="true" />
                Message
              </Button>
            }
          />
        ))}
      </div>
    );
  };

  const renderLiked = () => {
    if (isLoadingLikedUsers) return <CardGridSkeleton />;
    if (!likedUsers?.length) {
      return (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon={Sparkles}
            title="You haven’t liked anyone yet"
            description="Swipe right on people you find interesting. They appear here until they like you back."
            actions={[{ label: "Start swiping", onClick: () => navigate(ROUTES.swipe) }]}
          />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {likedUsers.map((liked) => (
          <ProfileCard
            key={liked._id}
            profile={liked}
            badge={<Badge tone="neutral" icon={Sparkles} className="bg-surface">Liked</Badge>}
            footer={
              <p className="flex items-center justify-center gap-1.5 text-xs text-foreground-muted">
                <Clock size={13} aria-hidden="true" />
                Waiting for them to like you back
              </p>
            }
          />
        ))}
      </div>
    );
  };

  return (
    <AppLayout variant="scroll">
      <div className="flex flex-col gap-6">
        <PageHeader title="Matches" description="Mutual matches and the people you have liked so far." />
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} layoutId="matches-tabs" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === TAB.matches ? renderMatches() : renderLiked()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
