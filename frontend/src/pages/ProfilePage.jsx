import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Camera, Sparkles, RefreshCw, Check } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { INTEREST_OPTIONS, GENDER_OPTIONS, PREFERENCE_OPTIONS } from "../constants";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Field, Input, Textarea } from "../components/ui/Field";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { cn } from "../utils/cn";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TONES = ["witty", "deep", "bold"];

const toFormData = (user) => ({
  name: user?.name || "",
  bio: user?.bio || "",
  age: user?.age || "",
  gender: user?.gender || "",
  genderPreference: user?.genderPreference || "",
  image: user?.image || "",
  interests: user?.interests || [],
});

function InterestToggle({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-medium transition-colors focus-ring",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground-secondary hover:border-border-strong hover:text-foreground"
      )}
    >
      {selected && <Check size={13} aria-hidden="true" />}
      {label}
    </button>
  );
}

function BioAssistant({ disabled, onApply }) {
  const { enhanceProfile } = useUserStore();
  const [tone, setTone] = useState(TONES[0]);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generate = async () => {
    if (disabled) {
      toast.error("Pick at least one interest so the suggestions sound like you.");
      return;
    }
    try {
      setGenerating(true);
      setSuggestions(await enhanceProfile(tone));
    } catch {
      toast.error("Couldn’t generate suggestions. Try again in a moment.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background-secondary p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-surface text-foreground-secondary">
            <Sparkles size={15} aria-hidden="true" />
          </span>
          <div>
            <p className="label-14 text-foreground">Need a hand with the bio?</p>
            <p className="copy-13 text-foreground-secondary">Pick a tone and get three drafts based on your interests.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          <SegmentedControl
            size="sm"
            label="Bio tone"
            className="w-auto"
            options={TONES.map((value) => ({ value, label: value }))}
            value={tone}
            onChange={setTone}
          />
          <Button size="sm" variant="secondary" onClick={generate} loading={generating}>
            {!generating && <RefreshCw aria-hidden="true" />}
            {suggestions.length ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface p-3">
              <p className="copy-13 text-foreground">{suggestion}</p>
              <Button size="sm" variant="ghost" onClick={() => onApply(suggestion)}>
                Use this
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const { loading, updateProfile } = useUserStore();
  const [formData, setFormData] = useState(() => toFormData(authUser));
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(toFormData(authUser));
  }, [authUser]);

  const isDirty = useMemo(() => JSON.stringify(formData) !== JSON.stringify(toFormData(authUser)), [formData, authUser]);

  const update = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const toggleInterest = (tag) =>
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(tag) ? prev.interests.filter((item) => item !== tag) : [...prev.interests, tag],
    }));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Choose an image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => update("image", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.age || !formData.gender) {
      toast.error("Name, age and gender are required.");
      return;
    }
    await updateProfile({ ...formData, name: formData.name.trim(), age: Number(formData.age) });
  };

  const genderLabel = GENDER_OPTIONS.find((option) => option.value === formData.gender)?.label;
  const preferenceLabel = PREFERENCE_OPTIONS.find((option) => option.value === formData.genderPreference)?.label;

  return (
    <AppLayout variant="scroll">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <PageHeader
          title="Profile"
          description="What people see when your card comes up."
          actions={
            <Button type="submit" loading={loading} disabled={!isDirty}>
              {isDirty ? "Save changes" : "Saved"}
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
          <Card className="lg:sticky lg:top-0 lg:col-span-4">
            <CardBody className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <Avatar src={formData.image} alt={formData.name} size="3xl" gold={authUser?.isGold} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-ring"
                  aria-label="Change photo"
                >
                  <Camera size={15} aria-hidden="true" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              <div>
                <p className="heading-20 text-foreground">
                  {formData.name || "Your name"}
                  {formData.age && <span className="ml-1.5 font-normal text-foreground-secondary">{formData.age}</span>}
                </p>
                <p className="copy-13 mt-0.5 text-foreground-secondary">{authUser?.email}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {genderLabel && <Badge>{genderLabel}</Badge>}
                {preferenceLabel && <Badge>Into {preferenceLabel.toLowerCase()}</Badge>}
                <Badge>{formData.interests.length} interests</Badge>
              </div>
              <p className="copy-13 text-foreground-muted">JPG or PNG, up to 5 MB.</p>
            </CardBody>
          </Card>

          <div className="flex flex-col gap-4 lg:col-span-8">
            <Card>
              <CardHeader title="Basics" description="Required so we can show you the right people." />
              <CardBody className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  {(id) => <Input id={id} value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" autoComplete="name" />}
                </Field>
                <Field label="Age" required>
                  {(id) => <Input id={id} type="number" inputMode="numeric" min="18" max="120" value={formData.age} onChange={(e) => update("age", e.target.value)} />}
                </Field>
                <Field label="I am" required>
                  <SegmentedControl label="Your gender" options={GENDER_OPTIONS} value={formData.gender} onChange={(value) => update("gender", value)} />
                </Field>
                <Field label="Interested in">
                  <SegmentedControl label="Who you want to meet" options={PREFERENCE_OPTIONS} value={formData.genderPreference} onChange={(value) => update("genderPreference", value)} />
                </Field>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Interests"
                description="Used for Explore and to show what you have in common."
                action={<span className="label-12 tabular text-foreground-muted">{formData.interests.length} selected</span>}
              />
              <CardBody className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((tag) => (
                  <InterestToggle key={tag} label={tag} selected={formData.interests.includes(tag)} onToggle={() => toggleInterest(tag)} />
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="About you" description="A couple of honest lines beat a long list." />
              <CardBody className="flex flex-col gap-4">
                <Field label="Bio" hint={`${formData.bio.length} characters`}>
                  {(id) => (
                    <Textarea id={id} rows={4} value={formData.bio} onChange={(e) => update("bio", e.target.value)} placeholder="What are you into, and what kind of plans do you like?" />
                  )}
                </Field>
                <BioAssistant disabled={formData.interests.length === 0} onApply={(bio) => update("bio", bio)} />
              </CardBody>
            </Card>

            <div className="flex items-center justify-end gap-3 lg:hidden">
              <Button type="submit" loading={loading} disabled={!isDirty} className="w-full sm:w-auto">
                {isDirty ? "Save changes" : "Saved"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </AppLayout>
  );
}
