import { useEffect, useState } from "react";
import { Crown, Heart, X, Check, EyeOff, BarChart3, Users, Percent, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import AppLayout from "../../components/AppLayout";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";
import { useMatchStore } from "../../store/useMatchStore";
import { MOCK_LIKES } from "../../constants";
import { PageHeader, SectionHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardHeader } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";
import { SettingsRow } from "../../components/ui/SettingsRow";
import { StatTile } from "../../components/ui/StatTile";
import { CardGridSkeleton, Skeleton } from "../../components/ui/Skeleton";
import { Modal } from "../../components/ui/Modal";
import { ProfileCard } from "../../components/ProfileCard";

const BENEFITS = [
  { icon: Heart, title: "See who liked you", text: "Like them back for an instant match." },
  { icon: EyeOff, title: "Incognito browsing", text: "Only people you like can see your profile." },
  { icon: BarChart3, title: "Swipe statistics", text: "Your swipes, likes and match rate." },
];

const GOLD_CONFETTI = ["#a67c1a", "#cfa64a", "#1c1917", "#ffffff"];
const MATCH_CONFETTI = ["#c43d22", "#a67c1a", "#2f7d4a"];

function StatsGrid({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-24" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatTile label="Swipes" value={stats?.totalSwipes ?? 0} icon={Users} />
      <StatTile label="Likes received" value={stats?.likesReceived ?? 0} icon={Heart} />
      <StatTile label="Match rate" value={`${stats?.matchRate ?? 0}%`} icon={Percent} />
    </div>
  );
}

function ProfileDetailsModal({ profile, onClose, onPass, onLike }) {
  return (
    <Modal open={!!profile} onClose={onClose} size="sm">
      {profile && (
        <>
          <div className="relative aspect-[4/3] bg-background-secondary">
            <img src={profile.image || "/avatar.png"} alt={profile.name} className="size-full object-cover" />
          </div>
          <div className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="heading-20 text-foreground">
                  {profile.name}
                  <span className="ml-1.5 font-normal text-foreground-secondary">{profile.age}</span>
                </h2>
                <p className="copy-13 mt-0.5 text-foreground-secondary">Liked your profile</p>
              </div>
              <Badge tone="gold" icon={Crown}>Gold</Badge>
            </div>
            <section>
              <p className="eyebrow">About</p>
              <p className="copy-14 mt-1.5 text-foreground-secondary">{profile.bio || "No bio yet."}</p>
            </section>
            {profile.interests?.length > 0 && (
              <section>
                <p className="eyebrow">Interests</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.interests.map((interest) => (
                    <Badge key={interest}>{interest}</Badge>
                  ))}
                </div>
              </section>
            )}
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={onPass}>
                <X aria-hidden="true" />
                Pass
              </Button>
              <Button className="flex-1" onClick={onLike}>
                <Heart aria-hidden="true" />
                Like back
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function GoldHubPage() {
  const { authUser } = useAuthStore();
  const {
    toggleGold,
    toggleIncognito,
    getSwipeStats,
    swipeStats,
    getWhoLikedMe,
    whoLikedMe,
    isLoadingWhoLikedMe,
    isLoadingStats,
    loading,
  } = useUserStore();
  const { swipeRight, swipeLeft } = useMatchStore();
  const [activeProfile, setActiveProfile] = useState(null);

  const isGold = !!authUser?.isGold;
  const incognito = isGold && !!authUser?.incognitoMode;

  useEffect(() => {
    getSwipeStats();
    getWhoLikedMe();
  }, [getSwipeStats, getWhoLikedMe]);

  const handleToggleGold = async () => {
    const updated = await toggleGold();
    if (updated?.isGold) {
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.5 }, colors: GOLD_CONFETTI });
      getWhoLikedMe();
    }
  };

  const handleAction = async (profile, action) => {
    if (!isGold) {
      handleToggleGold();
      return;
    }
    if (action === "like") {
      await swipeRight(profile);
      confetti({ particleCount: 50, spread: 55, origin: { y: 0.8 }, colors: MATCH_CONFETTI });
    } else {
      await swipeLeft(profile);
    }
    setActiveProfile(null);
    getWhoLikedMe();
    getSwipeStats();
  };

  const likes = whoLikedMe?.length > 0 ? whoLikedMe : MOCK_LIKES;

  return (
    <AppLayout variant="scroll">
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Swipe Gold"
          description="See who already likes you, browse without being seen, and keep an eye on your numbers."
          meta={
            isGold ? (
              <Badge tone="gold" icon={Crown}>Membership active</Badge>
            ) : (
              <Badge tone="neutral" icon={Crown}>Not active</Badge>
            )
          }
          actions={
            isGold ? (
              <Button variant="danger-outline" size="sm" onClick={handleToggleGold} loading={loading}>
                Cancel membership
              </Button>
            ) : (
              <Button onClick={handleToggleGold} loading={loading}>
                <Crown aria-hidden="true" />
                Activate Gold
              </Button>
            )
          }
        />

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader title="What you get" description="Three things, all reversible." />
            <ul className="divide-y divide-border">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3.5 px-5 py-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-gold-surface text-gold-strong">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="label-14 text-foreground">{title}</p>
                    <p className="copy-13 text-foreground-secondary">{text}</p>
                  </div>
                  {isGold && <Check size={16} className="mt-1 shrink-0 text-success" aria-hidden="true" />}
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-4 lg:col-span-7">
            <Card>
              <SettingsRow
                icon={EyeOff}
                title="Incognito mode"
                description={
                  isGold
                    ? incognito
                      ? "On. Only people you swipe right on can see your profile."
                      : "Off. Everyone in your preferences can see your profile."
                    : "Requires Gold. Browse without appearing in anyone’s deck."
                }
                control={
                  <Switch
                    checked={incognito}
                    disabled={!isGold || loading}
                    onChange={() => toggleIncognito()}
                    label="Toggle incognito mode"
                  />
                }
              />
            </Card>
            <div>
              <SectionHeader title="Your activity" className="mb-3" />
              <StatsGrid stats={swipeStats} loading={isLoadingStats} />
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <SectionHeader
            title="Who liked you"
            description={isGold ? "Like them back and it’s an instant match." : "Activate Gold to reveal these profiles."}
            action={<Badge tone={isGold ? "gold" : "neutral"} icon={Sparkles}>{likes.length} {likes.length === 1 ? "person" : "people"}</Badge>}
          />
          {isLoadingWhoLikedMe ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {likes.map((profile) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  locked={!isGold}
                  lockedLabel="Activate Gold to see"
                  onClick={isGold ? () => setActiveProfile(profile) : handleToggleGold}
                  badge={<Badge tone="gold" icon={Heart} className="bg-surface">Liked you</Badge>}
                  footer={
                    isGold ? (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleAction(profile, "dislike")}>
                          <X aria-hidden="true" />
                          Pass
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => handleAction(profile, "like")}>
                          <Heart aria-hidden="true" />
                          Like
                        </Button>
                      </div>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ProfileDetailsModal
        profile={activeProfile}
        onClose={() => setActiveProfile(null)}
        onPass={() => handleAction(activeProfile, "dislike")}
        onLike={() => handleAction(activeProfile, "like")}
      />
    </AppLayout>
  );
}
