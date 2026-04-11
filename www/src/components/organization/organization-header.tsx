import { useSuspenseQuery } from "@tanstack/react-query";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function OrganizationHeader({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <>No Organization Found.</>;
  }
  const org = data.organization;
  return (
    <div className="border border-input bg-secondary">
      <div className="bg-secondary px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${org.logo}`}
            />
            <AvatarFallback className="text-2xl font-medium bg-primary text-primary-foreground">
              {org.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight">
            Careers at {org.name}
          </h1>
          {org.description && (
            <p className="text-muted-foreground text-sm sm:text-base text-balance leading-relaxed font-normal">
              {org.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
