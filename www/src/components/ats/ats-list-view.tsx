import { useState, useMemo } from "react";
import { Users, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { EditPipelineDialog } from "./edit-pipeline-dialog";
import { ATSFilterBar } from "./ats-filter-bar";
import { CandidateCard } from "./candidate-card";

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
    <div className="flex flex-col flex-1 min-h-0 bg-background overflow-hidden border">
      {/* Pipeline Header */}
      <div className="h-16 p-4 border-b flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Users className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{pipeline.name}</h2>
          </div>
        </div>
        <EditPipelineDialog
          pipeline={pipeline}
          organizationId={organizationId}
          trigger={
            <Button
              variant="outline"
              className="gap-2 text-xs font-semibold shrink-0"
            >
              <Settings2 className="size-3.5" />
              <span className="hidden sm:inline">
                Configure Hiring Pipeline
              </span>
              <span className="sm:hidden">Configure</span>
            </Button>
          }
        />
      </div>

      {/* Filter Bar */}
      <ATSFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStageId={activeStageId}
        onStageChange={setActiveStageId}
        stages={stageData}
        totalApplicants={applicants.length}
        resultsCount={filteredApplicants.length}
      />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {filteredApplicants.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h4 className="text-base font-semibold">No candidates found</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "There are no candidates in this stage yet."}
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
        ) : (
          <ul className="p-4 space-y-2.5">
            <AnimatePresence mode="sync" initial={false}>
              {filteredApplicants.map((applicant) => (
                <motion.li
                  key={applicant.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <CandidateCard
                    applicant={applicant}
                    stages={stages}
                    slug={slug}
                    onMove={onMoveApplicant}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
