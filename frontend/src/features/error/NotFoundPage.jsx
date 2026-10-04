import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "../../components/layout/BrandMark";
import { ROUTES } from "../../constants/navigation";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      <BrandMark />
      <div className="space-y-2">
        <p className="eyebrow">Error 404</p>
        <h1 className="heading-32 text-foreground">This page doesn’t exist.</h1>
        <p className="copy-14 mx-auto max-w-sm text-foreground-secondary">
          The link may be broken or the page may have moved. Head back and keep swiping.
        </p>
      </div>
      <Link
        to={ROUTES.landing}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-ring"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Swipe
      </Link>
    </div>
  );
}
