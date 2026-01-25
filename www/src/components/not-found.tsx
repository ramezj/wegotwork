import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </Empty>
    </div>
  );
}
