import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, ShieldCheck, CalendarHeart } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { BrandMark } from "../../components/layout/BrandMark";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { ROUTES } from "../../constants/navigation";

const MODES = { login: "login", signup: "signup" };

const COPY = {
  login: {
    title: "Welcome back",
    description: "Sign in to pick up your conversations and see who liked you.",
    switchLabel: "New to Swipe?",
    switchAction: "Create an account",
  },
  signup: {
    title: "Create your account",
    description: "It takes about a minute. You can edit everything later from your profile.",
    switchLabel: "Already have an account?",
    switchAction: "Sign in",
  },
};

const PROMISES = [
  { icon: Compass, title: "Match on shared interests", text: "Browse by the things you actually care about, not just photos." },
  { icon: ShieldCheck, title: "Private by default", text: "Verified end-to-end chats and an incognito mode when you want it." },
  { icon: CalendarHeart, title: "From chat to a real date", text: "Plan the venue and time together, right inside the conversation." },
];

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === MODES.signup ? MODES.signup : MODES.login;
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(searchParams.get("mode") === MODES.signup ? MODES.signup : MODES.login);
  }, [searchParams]);

  const switchMode = () => {
    const next = mode === MODES.login ? MODES.signup : MODES.login;
    setSearchParams(next === MODES.signup ? { mode: next } : {}, { replace: true });
  };

  const copy = COPY[mode];

  return (
    <div className="grid min-h-dvh w-full bg-background lg:grid-cols-[5fr_7fr]">
      <aside className="hidden flex-col justify-between border-r border-border bg-background-secondary p-10 lg:flex">
        <BrandMark />
        <div className="max-w-sm space-y-10">
          <div className="space-y-3">
            <p className="eyebrow">Dating, without the noise</p>
            <h2 className="heading-32 text-foreground">Meet people who share your vibe.</h2>
          </div>
          <ul className="space-y-6">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground-secondary">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <p className="label-14 text-foreground">{title}</p>
                  <p className="copy-13 mt-0.5 text-foreground-secondary">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="copy-13 text-foreground-muted">Made for people who would rather talk than scroll.</p>
      </aside>

      <section className="relative flex flex-col">
        <div className="flex h-header items-center justify-between px-4 sm:px-8">
          <BrandMark className="lg:invisible" />
          <div className="flex items-center gap-2">
            <Link to={ROUTES.landing} className="hidden text-sm font-medium text-foreground-secondary hover:text-foreground sm:inline-flex">
              Back to site
            </Link>
            <ThemeToggle variant="outline" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="heading-24 text-foreground">{copy.title}</h1>
              <p className="copy-14 mt-1.5 text-foreground-secondary">{copy.description}</p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                {mode === MODES.login ? <LoginForm /> : <SignupForm />}
              </motion.div>
            </AnimatePresence>

            <p className="copy-13 mt-8 text-center text-foreground-secondary">
              {copy.switchLabel}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-foreground underline-offset-4 hover:underline focus-ring rounded-sm"
              >
                {copy.switchAction}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
