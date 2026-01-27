import { cn } from "@/lib/utils";
import { LoaderPinwheel } from "lucide-react";
export function Layout({
  title,
  boldText,
  primaryButton,
  children,
  className,
}: {
  title: string;
  boldText?: string;
  primaryButton?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">
          {title}
          {boldText && <b> {boldText}</b>}
        </h1>
        {primaryButton}
      </div>
      {children}
    </div>
  );
}

export function LoadingLayout({
  title,
  boldText,
  primaryButton,
  className,
}: {
  title: string;
  boldText?: string;
  primaryButton?: React.ReactNode;
  className?: string;
}) {
  return (
    <Layout title={title} boldText={boldText} primaryButton={primaryButton}>
      <div className="flex-1 items-center flex flex-col justify-center">
        <LoaderPinwheel className="size-8 animate-spin text-foreground" />
      </div>
    </Layout>
  );
}
