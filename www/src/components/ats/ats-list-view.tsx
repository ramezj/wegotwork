import { useState, useMemo } from "react";
import { ApplicantCard } from "./applicant-card";
import { Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { EditPipelineDialog } from "./edit-pipeline-dialog";
import { ATSFilterBar } from "./ats-filter-bar";

interface ATSListViewProps {
  pipeline: any;
  applicants: any[];
  onMoveApplicant: (applicantId: string, newStageId: string) => void;
  slug: string;
  organizationId: string;
}

export function ATSListView({
  pipeline,
  applicants,
  onMoveApplicant,
  slug,
  organizationId,
}: ATSListViewProps) {
  const stages = pipeline.stages || [];
  const [activeStageId, setActiveStageId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stageData = useMemo(() => {
    return stages.map((stage: any) => ({
      id: stage.id,
      name: stage.name,
      count: applicants.filter((a) => a.currentStageId === stage.id).length,
    }));
  }, [stages, applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesStage =
        activeStageId === "all" || applicant.currentStageId === activeStageId;
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [applicants, activeStageId, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden border rounded-none">
      {/* Header Area */}
      <div className="p-4 bg-muted/20 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-none bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Users className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{pipeline.name}</h2>
              <EditPipelineDialog
                pipeline={pipeline}
                organizationId={organizationId}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full hover:bg-primary/10 hover:text-primary"
                  >
                    <Info className="size-3.5" />
                  </Button>
                }
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1.5 leading-none mt-0.5">
              Active Hiring Pipeline
            </p>
          </div>
        </div>
      </div>
      <ATSFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStageId={activeStageId}
        onStageChange={setActiveStageId}
        stages={stageData}
        totalApplicants={applicants.length}
        resultsCount={filteredApplicants.length}
      />
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-muted/10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredApplicants.map((applicant) => (
                <motion.div
                  key={applicant.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApplicantCard
                    applicant={applicant}
                    onMove={onMoveApplicant}
                    stages={stages}
                    slug={slug}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredApplicants.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-background border rounded-none">
                <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Users className="size-8 text-muted-foreground/40" />
                </div>
                <h4 className="text-lg font-medium">No candidates found</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                  {searchQuery
                    ? `We couldn't find any results matching "${searchQuery}". Try a different search term.`
                    : "There are currently no candidates in this stage of the pipeline."}
                </p>
                {searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
