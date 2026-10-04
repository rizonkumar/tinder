import { Header } from "./layout/Header";
import { MobileTabBar } from "./layout/MobileTabBar";
import { cn } from "../utils/cn";

const VARIANTS = {
  scroll: "overflow-y-auto px-4 py-6 pb-[calc(var(--tabbar-h)+1.5rem)] sm:px-6 md:pb-8 lg:px-8 lg:py-8",
  fixed: "flex items-center justify-center overflow-hidden p-4 pb-[calc(var(--tabbar-h)+1rem)] md:pb-4",
  flush: "flex flex-col overflow-hidden pb-tabbar md:pb-0",
};

export default function AppLayout({ children, variant = "scroll", width = "page" }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <main className={cn("min-w-0 flex-1 [scrollbar-gutter:stable]", VARIANTS[variant])}>
        {variant === "scroll" ? (
          <div className={cn("mx-auto w-full", width === "narrow" ? "max-w-narrow" : "max-w-page")}>
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      <MobileTabBar />
    </div>
  );
}
