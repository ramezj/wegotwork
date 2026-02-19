import { useSuspenseQuery } from "@tanstack/react-query";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function OrganizationHeader({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <>No Organization Found.</>;
  }
  return (
    <div className="w-full">
      <div className="text-center flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 rounded-none">
          <AvatarImage
            src={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${data.organization.logo}`}
          />
          <AvatarFallback className="text-4xl rounded-none bg-white text-black">
            {data.organization.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {/* <div> */}
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-none">
          {data.organization.name}
        </h1>
        {/* <p className="text-muted-foreground text-base text-balance font-light">
                Explore our open positions and join our team in building the
                future.
              </p> */}
        {/* </div> */}
      </div>
    </div>
  );
}
