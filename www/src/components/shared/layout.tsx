import { Button } from "../ui/button";

export function Layout({
  title,
  boldText,
  primaryButton,
  children,
}: {
  title: string;
  boldText?: string;
  primaryButton?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">
          {title}
          {boldText && <b> ({boldText})</b>}
        </h1>
        {primaryButton}
      </div>
      {children}
    </div>
  );
}
