import { cn } from "@/lib/utils";
import { Loader, Loader2, LoaderPinwheel } from "lucide-react";
export function Layout({
  title,
  primaryButton,
  children,
  className,
}: {
  title?: string;
  primaryButton?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col space-y-4 min-h-0", className)}>
      <div className="flex items-center justify-between min-h-8">
        <h1 className="text-xl font-semibold lowercase">{title}</h1>
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
