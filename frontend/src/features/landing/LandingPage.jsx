import { Link } from "react-router-dom";
import { ArrowRight, Check, Crown } from "lucide-react";
import { BrandMark } from "../../components/layout/BrandMark";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { ROUTES } from "../../constants/navigation";
import { FEATURES, GOLD_BENEFITS, LANDING_NAV, STEPS } from "./landingContent";
import { ProductPreview } from "./ProductPreview";
import { cn } from "../../utils/cn";

const SIGNUP_LINK = `${ROUTES.auth}?mode=signup`;

function Container({ className, children }) {
  return <div className={cn("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-header items-center justify-between">
        <BrandMark />
        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {LANDING_NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="flex h-9 items-center rounded-md px-3 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link to={ROUTES.auth} className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground focus-ring sm:inline-flex">
            Log in
          </Link>
          <Link to={SIGNUP_LINK} className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-ring">
            Sign up
          </Link>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-border">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="animate-fade-up lg:col-span-6">
          <p className="eyebrow">Dating, without the noise</p>
          <h1 className="heading-40 mt-4 text-foreground sm:text-[3.25rem] sm:leading-[1.05]">
            Meet people who share your vibe.
          </h1>
          <p className="copy-16 mt-5 max-w-lg text-foreground-secondary">
            Swipe is a dating app built around interests, honest conversations and actually meeting up.
            Explore by what you love, verify your chats, and plan the first date without leaving the thread.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={SIGNUP_LINK} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-ring">
              Create your account
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-ring">
              See how it works
            </a>
          </div>
          <p className="copy-13 mt-4 text-foreground-muted">Free to join. Gold is optional.</p>
        </div>
        <div className="animate-fade-up [animation-delay:120ms] lg:col-span-6">
          <ProductPreview />
        </div>
      </Container>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-header border-b border-border bg-background-secondary">
      <Container className="py-16 lg:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">Features</p>
          <h2 className="heading-32 mt-3 text-foreground">Everything between “hi” and the first date.</h2>
        </div>
        <ul role="list" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map(({ icon: Icon, title, text, span }) => (
            <li key={title} className={cn("flex flex-col gap-4 rounded-lg border border-border bg-surface p-6", span)}>
              <span className="flex size-10 items-center justify-center rounded-md bg-background-secondary text-foreground">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="heading-16 text-foreground">{title}</h3>
                <p className="copy-14 mt-1.5 text-foreground-secondary">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-header border-b border-border">
      <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <p className="eyebrow">How it works</p>
          <h2 className="heading-32 mt-3 text-foreground">Three steps. No tricks.</h2>
          <p className="copy-14 mt-3 text-foreground-secondary">
            There is no algorithm hiding profiles until you pay. You see people who match your preferences, in order.
          </p>
        </div>
        <ol className="lg:col-span-8">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative flex gap-5 pb-8 last:pb-0">
              {index < STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-border" />
              )}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground">
                <Icon size={17} aria-hidden="true" />
              </span>
              <div className="pt-1.5">
                <p className="label-12 text-foreground-muted">Step {index + 1}</p>
                <h3 className="heading-16 mt-1 text-foreground">{title}</h3>
                <p className="copy-14 mt-1.5 max-w-lg text-foreground-secondary">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Gold() {
  return (
    <section id="gold" className="scroll-mt-header border-b border-border bg-background-secondary">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-10 rounded-xl border border-border bg-surface p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-surface px-2.5 py-1 text-xs font-medium text-gold-strong">
              <Crown size={12} aria-hidden="true" />
              Swipe Gold
            </span>
            <h2 className="heading-32 mt-4 text-foreground">A little more signal, when you want it.</h2>
            <p className="copy-14 mt-3 text-foreground-secondary">
              Gold is a toggle you turn on from your account. It never changes who you can match with. It only shows you more about what is already happening.
            </p>
            <Link to={SIGNUP_LINK} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-ring">
              Start free, upgrade later
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ul className="space-y-5 lg:col-span-7 lg:pl-8">
            {GOLD_BENEFITS.map(({ title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-surface text-gold-strong">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="label-14 text-foreground">{title}</p>
                  <p className="copy-13 mt-0.5 text-foreground-secondary">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function FinalCall() {
  return (
    <section>
      <Container className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between lg:py-20">
        <div>
          <h2 className="heading-24 text-foreground">Ready when you are.</h2>
          <p className="copy-14 mt-1 text-foreground-secondary">Create an account and start with the vibes you already have.</p>
        </div>
        <Link to={SIGNUP_LINK} className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-ring">
          Create your account
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-4 py-8 text-sm text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
        <BrandMark />
        <p className="copy-13">© {new Date().getFullYear()} Swipe. Built for people who would rather talk than scroll.</p>
      </Container>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Gold />
        <FinalCall />
      </main>
      <Footer />
    </div>
  );
}
