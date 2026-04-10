import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { officesQueryOptions } from "@/features/queries/offices";
import { CreateOfficeDialog } from "@/components/office/create-office-dialog";
import { OfficeCard } from "@/components/office/office-card";

export const Route = createFileRoute("/$slug/_layout/offices/")({
  component: OfficesPage,
});

function OfficesPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id || "";

  const { data: offices } = useSuspenseQuery(
    officesQueryOptions(organizationId),
  );
  return (
    <Layout
      variant="header"
      title={`Offices (${offices.length})`}
      primaryButton={
        <CreateOfficeDialog slug={slug} organizationId={organizationId} />
      }
    >
      {offices.length === 0 ? (
        <div className="flex flex-1 items-center justify-center border bg-secondary">
          <div className="flex max-w-sm flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-primary">
              No Offices found
            </h2>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office: any) => {
            return (
              <OfficeCard
                key={office.id}
                office={office}
                onOpen={() =>
                  navigate({
                    to: "/$slug/offices/$officeId",
                    params: { slug, officeId: office.id },
                  })
                }
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
}
