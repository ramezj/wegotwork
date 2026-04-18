import { createFileRoute } from "@tanstack/react-router";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { officesQueryOptions } from "@/features/queries/offices";
import { OfficeEditorForm } from "@/components/office/office-editor-form";
import { deleteOfficeFn } from "@/features/services/office/office";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/$slug/_layout/offices/$officeId")({
  component: EditOfficePage,
  loader: async ({ context, params }) => {
    const orgData = await context.queryClient.ensureQueryData(
      organizationBySlugQueryOptions(params.slug),
    );
    const organizationId = orgData?.organization?.id;
    if (organizationId) {
      await context.queryClient.ensureQueryData(
        officesQueryOptions(organizationId),
      );
    }
  },
});

function EditOfficePage() {
  const { slug, officeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id || "";

  const { data: offices } = useSuspenseQuery(
    officesQueryOptions(organizationId),
  );
  const office = offices.find((item: any) => item.id === officeId);

  const deleteMutation = useMutation({
    mutationFn: deleteOfficeFn,
    onSuccess: async () => {
      setDeleteDialogOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["offices", organizationId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organization", slug],
      });
      toast.success("Office deleted successfully");
      navigate({ to: "/$slug/offices", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete office");
    },
  });

  if (!organizationId || !office) {
    return (
      <Layout title="Edit Office">
        <div className="text-sm text-muted-foreground">Office not found.</div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Office">
      <div className="space-y-4">
        <OfficeEditorForm
          mode="edit"
          slug={slug}
          organizationId={organizationId}
          office={office}
        />

        <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 shrink-0">
              <TriangleAlert className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Danger Zone</CardTitle>
              {/* <CardDescription className="text-xs">
                Delete this office permanently
              </CardDescription> */}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Deleting this office will permanently remove it from your
              organization.
              {office._count?.jobs
                ? ` ${office._count.jobs} linked job${office._count.jobs === 1 ? "" : "s"} must be reassigned first.`
                : " This action cannot be undone."}
            </p>

            <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/20 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Delete office</p>
                <p className="text-sm text-muted-foreground">
                  Remove <strong>{office.name}</strong> from this organization.
                </p>
              </div>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Office
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader className="items-start text-left">
                    <DialogTitle>Delete this office?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete{" "}
                      <strong>{office.name}</strong>.
                      {office._count?.jobs
                        ? ` It currently has ${office._count.jobs} linked job${office._count.jobs === 1 ? "" : "s"}, so you will need to reassign those first.`
                        : " This action cannot be undone."}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-row justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={deleteMutation.isPending}
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        deleteMutation.mutate({ data: { id: office.id } })
                      }
                    >
                      {deleteMutation.isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete Office
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
