import type React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  ctaText = "Learn more",
  ctaLink = "#",
}: FeatureCardProps) {
  return (
    <Card className="flex flex-col h-full w-[22rem] rounded-sm bg-white border border-black">
      <CardHeader>
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 text-black">
          {icon}
        </div>
        <CardTitle className="text-xl font-extrabold text-black">
          {title}
        </CardTitle>
        <CardDescription className="text-base font-medium text-black">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Button
          variant={"default"}
          className="font-medium bg-black text-white hover:bg-black hover:text-white rounded-sm"
        >
          <Link
            href={ctaLink}
            className="flex items-center gap-2 hover:gap-3 transition-all"
          >
            {ctaText} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
