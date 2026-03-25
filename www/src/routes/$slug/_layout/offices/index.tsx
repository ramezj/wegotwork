import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  MapPin,
  MoreVertical,
  Plus,
  PlusIcon,
  Settings2,
  Trash2,
} from "lucide-react";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { officesQueryOptions } from "@/features/queries/offices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteOfficeFn } from "@/features/services/office/office";
import { toast } from "sonner";

export const Route = createFileRoute("/$slug/_layout/offices/")({
  component: OfficesPage,
});

function OfficesPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id || "";

  const { data: offices } = useSuspenseQuery(officesQueryOptions(organizationId));

  const deleteMutation = useMutation({
    mutationFn: deleteOfficeFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["offices", organizationId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organization", slug],
      });
      toast.success("Office deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete office");
    },
  });

  return (
    <Layout
      title="Offices"
      primaryButton={
        <Button asChild>
          <Link
            to="/$slug/offices/create"
            params={{ slug }}
            className="group transition-all"
          >
            Create Office
            <PlusIcon className="duration-300 group-hover:rotate-90" />
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offices.map((office: any) => {
          const locationParts = [office.city, office.state, office.country].filter(Boolean);

          return (
            <Card
              key={office.id}
              className="group cursor-pointer overflow-hidden transition-colors hover:border-primary/40"
              onClick={() =>
                navigate({
                  to: "/$slug/offices/$officeId",
                  params: { slug, officeId: office.id },
                })
              }
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Building2 className="size-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/$slug/offices/$officeId"
                          params={{ slug, officeId: office.id }}
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer"
                        >
                          <Settings2 className="size-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive"
                        onClick={() => {
                          if (
                            confirm("Are you sure you want to delete this office?")
                          ) {
                            deleteMutation.mutate({ data: { id: office.id } });
                          }
                        }}
                      >
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{office.name}</CardTitle>
                <CardDescription>
                  {office._count.jobs} linked job{office._count.jobs === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {locationParts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{locationParts.join(", ")}</span>
                  </div>
                )}
                {office.address && <p>{office.address}</p>}
                {locationParts.length === 0 && !office.address && (
                  <p>No location details added yet.</p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {offices.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Plus className="size-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">No offices yet</h3>
            <p className="max-w-sm text-muted-foreground">
              Create your first office so jobs can be tied to a real company location.
            </p>
            <Button asChild className="mt-6">
              <Link to="/$slug/offices/create" params={{ slug }}>
                Create Office
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
