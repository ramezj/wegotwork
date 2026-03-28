import { useState, useMemo } from "react";
import { Users, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ATSFilterBar } from "./ats-filter-bar";
import { CandidateCard } from "./candidate-card";
import { CandidateSidebar } from "./candidate-sidebar";
import { Candidate, CandidateResponse } from "@/types/candidate";
import { FormFieldConfig } from "@/types/form-config";
import { Link } from "@tanstack/react-router";

interface ATSListViewProps {
  pipeline: any;
  candidates: (Candidate & { responses: CandidateResponse[] })[];
  onMoveCandidate: (candidateId: string, newStageId: string) => Promise<void>;
  isMovingCandidate: boolean;
  slug: string;
  organizationId: string;
  jobName?: string;
  questions: FormFieldConfig[];
}

export function ATSListView({
  pipeline,
  candidates,
  onMoveCandidate,
  isMovingCandidate,
  slug,
  jobName,
  questions,
}: ATSListViewProps) {
  const stages = pipeline.stages || [];
  const [activeStageId, setActiveStageId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<
    (Candidate & { responses: CandidateResponse[] }) | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stageData = useMemo(() => {
    return stages.map((stage: any) => ({
      id: stage.id,
      name: stage.name,
      count: candidates.filter((c) => c.currentStageId === stage.id).length,
    }));
  }, [stages, candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesStage =
        activeStageId === "all" || candidate.currentStageId === activeStageId;
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [candidates, activeStageId, searchQuery]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background overflow-hidden border rounded-md">
      {/* Pipeline Header */}
      <div className="h-16 p-4 border-b flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Users className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{jobName}</h2>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-xs font-semibold shrink-0"
          asChild
        >
          <Link
            to="/$slug/pipelines/$pipelineId"
            params={{ slug, pipelineId: pipeline.id }}
          >
            <Settings2 className="size-3.5" />
            <span className="hidden sm:inline">Configure Hiring Pipeline</span>
            <span className="sm:hidden">Configure</span>
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <ATSFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStageId={activeStageId}
        onStageChange={setActiveStageId}
        stages={stageData}
        totalCandidates={candidates.length}
        resultsCount={filteredCandidates.length}
      />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {filteredCandidates.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground bg-muted/5">
            <Users className="size-10 mb-2 text-primary" />
            <p className="font-medium text-primary">No candidates found</p>
          </div>
        ) : (
          <ul className="p-4 space-y-2.5 relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredCandidates.map((candidate) => (
                <motion.li
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                >
                  <CandidateCard
                    candidate={candidate}
                    stages={stages}
                    slug={slug}
                    onMove={onMoveCandidate}
                    onSelect={(
                      selected: Candidate & { responses: CandidateResponse[] },
                    ) => {
                      setSelectedCandidate(selected);
                      setIsSidebarOpen(true);
                    }}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <CandidateSidebar
        key={
          selectedCandidate
            ? `${selectedCandidate.id}:${selectedCandidate.currentStageId ?? ""}`
            : "candidate-sidebar-empty"
        }
        candidate={selectedCandidate}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        stages={stages}
        slug={slug}
        questions={questions}
        onMoveCandidate={onMoveCandidate}
        isMovingCandidate={isMovingCandidate}
      />
    </div>
  );
}
