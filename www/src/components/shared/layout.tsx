import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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
      <div className={cn("flex flex-1 flex-col min-h-0", className)}>
        {/* Sticky Page Header */}
        <div className="sticky top-0 z-20 p-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">{primaryButton}</div>
        </div>
        {/* Content with padding */}
        <div className="px-4 pb-4 flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-1 flex-col space-y-4 p-4 min-h-0", className)}
    >
      <div className="flex items-center justify-between min-h-8">
        <h1 className="text-xl font-semibold ">{title}</h1>
        {primaryButton}
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
