import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicantCard } from "./applicant-card";
import { Users, LayoutGrid, List as ListIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";

interface ATSListViewProps {
  pipeline: any;
  applicants: any[];
  onMoveApplicant: (applicantId: string, newStageId: string) => void;
  slug: string;
}

export function ATSListView({
  pipeline,
  applicants,
  onMoveApplicant,
  slug,
}: ATSListViewProps) {
  const stages = pipeline.stages || [];
  const [activeStageId, setActiveStageId] = useState<string>(
    stages[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesStage = applicant.currentStageId === activeStageId;
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [applicants, activeStageId, searchQuery]);

  const activeStage = stages.find((s: any) => s.id === activeStageId);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background overflow-hidden">
      {/* Header Area */}
      <div className="p-4 border-b space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {pipeline.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <div className="flex items-center bg-muted p-1 rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stage Tabs */}
        <ScrollArea className="w-full">
          <Tabs
            value={activeStageId}
            onValueChange={setActiveStageId}
            className="w-full"
          >
            <TabsList className="bg-transparent h-auto p-0 gap-2">
              {stages.map((stage: any) => {
                const count = applicants.filter(
                  (a) => a.currentStageId === stage.id,
                ).length;
                return (
                  <TabsTrigger
                    key={stage.id}
                    value={stage.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border px-4 py-2 flex items-center gap-2 h-9"
                  >
                    <span className="text-sm">{stage.name}</span>
                    <Badge
                      variant={
                        activeStageId === stage.id ? "secondary" : "outline"
                      }
                      className="px-1.5 h-4 text-[10px]"
                    >
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">
              {activeStage?.name}{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({filteredApplicants.length})
              </span>
            </h3>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-2"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredApplicants.map((applicant) => (
                <motion.div
                  key={applicant.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/5">
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No candidates in this stage."}
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
