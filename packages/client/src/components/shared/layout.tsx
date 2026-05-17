import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const pageTitleClass = "text-xl font-semibold tracking-tighter leading-none";
const pageHeaderRowClass = "flex min-h-10 items-center justify-between gap-3";

export function Layout({
  title,
  primaryButton,
  children,
  className,
  variant = "default",
}: {
  title?: string;
  primaryButton?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "header";
}) {
  if (variant === "header") {
    return (
      <div className={cn("flex flex-1 flex-col", className)}>
        {/* Sticky Page Header */}
        <div className="sticky h-(--header-height) top-0 z-20 border-b bg-background/95 items-center content-center px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className={pageHeaderRowClass}>
            <h1 className={cn(pageTitleClass, "font-medium")}>{title}</h1>
            <div className="flex items-center gap-2">{primaryButton}</div>
          </div>
        </div>
        {/* Content with padding */}
        <div className="flex flex-col flex-1 p-4">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-1 flex-col space-y-4 p-4 min-h-0", className)}
    >
      <div className={pageHeaderRowClass}>
        <h1 className={pageTitleClass}>{title}</h1>
        <div className="flex items-center gap-2">{primaryButton}</div>
      </div>
      {children}
    </div>
  );
}

export function LoadingLayout({
  title,
  primaryButton,
}: {
  title: string;
  primaryButton?: React.ReactNode;
}) {
  return (
    <Layout title={title} primaryButton={primaryButton}>
      <div className="flex-1 items-center flex flex-col justify-center">
        <Loader2 className="size-8 animate-spin text-foreground" />
      </div>
    </Layout>
  );
}
