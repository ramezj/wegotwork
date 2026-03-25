import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { officesQueryOptions } from "@/features/queries/offices";
import { deleteOfficeFn } from "@/features/services/office/office";
import { toast } from "sonner";
import { CreateOfficeDialog } from "@/components/office/create-office-dialog";
import { OfficeCard } from "@/components/office/office-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/$slug/_layout/offices/")({
  component: OfficesPage,
});

function OfficesPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [officeToDelete, setOfficeToDelete] = useState<any | null>(null);

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id || "";

  const { data: offices } = useSuspenseQuery(
    officesQueryOptions(organizationId),
  );

  const deleteMutation = useMutation({
    mutationFn: deleteOfficeFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["offices", organizationId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organization", slug],
      });
      setOfficeToDelete(null);
      toast.success("Office deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete office");
    },
  });

  if (offices.length === 0) {
    return (
      <Layout
        title="Offices (0)"
        primaryButton={<CreateOfficeDialog slug={slug} organizationId={organizationId} />}
      >
        <div className="flex flex-1 items-center justify-center border">
          <div className="flex max-w-sm flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-base font-semibold tracking-tight text-muted-foreground">
              No offices found
            </h2>
            <CreateOfficeDialog slug={slug} organizationId={organizationId} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Offices (${offices.length})`}
      primaryButton={<CreateOfficeDialog slug={slug} organizationId={organizationId} />}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offices.map((office: any) => {
          return (
            <OfficeCard
              key={office.id}
              slug={slug}
              office={office}
              onOpen={() =>
                navigate({
                  to: "/$slug/offices/$officeId",
                  params: { slug, officeId: office.id },
                })
              }
              onDelete={() => setOfficeToDelete(office)}
            />
          );
        })}
      </div>

      <Dialog
        open={!!officeToDelete}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setOfficeToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="items-start text-left">
            <DialogTitle>Delete this office?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <strong>{officeToDelete?.name}</strong>.
              {officeToDelete?._count?.jobs
                ? ` It currently has ${officeToDelete._count.jobs} linked job${officeToDelete._count.jobs === 1 ? "" : "s"}, so you will need to reassign those first.`
                : " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => setOfficeToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!officeToDelete) return;
                deleteMutation.mutate({ data: { id: officeToDelete.id } });
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Office"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
