import { useState } from "react";
import { PlusIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OfficeEditorForm } from "@/components/office/office-editor-form";

export function CreateOfficeDialog({
  slug,
  organizationId,
}: {
  slug: string;
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group transition-all">
          Create Office
          <PlusIcon className="duration-300 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Create Office
          </DialogTitle>
          <DialogDescription>
            Add a new office location for this organization.
          </DialogDescription>
        </DialogHeader>
        <OfficeEditorForm
          mode="create"
          slug={slug}
          organizationId={organizationId}
          wrapInCard={false}
          onCreated={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
