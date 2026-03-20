import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { useIsMobile } from "@/hooks/use-mobile";

interface Stage {
  id: string;
  name: string;
  count: number;
}

interface ATSFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeStageId: string;
  onStageChange: (value: string) => void;
  stages: Stage[];
  totalCandidates: number;
  resultsCount: number;
}

export function ATSFilterBar({
  searchQuery,
  onSearchChange,
  activeStageId,
  onStageChange,
  stages,
  totalCandidates,
  resultsCount,
}: ATSFilterBarProps) {
  const isMobile = useIsMobile();
  const activeStage = stages.find((s) => s.id === activeStageId);
  const activeLabel =
    activeStageId === "all"
      ? `All Stages (${totalCandidates})`
      : `${activeStage?.name} (${activeStage?.count})`;

  return (
    <div className="flex flex-col lg:h-16 lg:justify-center p-4 border-b sticky top-0 z-10 bg-background">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left Side: Active Stage Name */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">
            {activeStageId === "all" ? "All Stages" : activeStage?.name} (
            {resultsCount})
          </h1>
        </div>
        {/* Right Side: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <InputGroup className="flex-1 shadow-none">
            <InputGroupInput
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full font-semibold"
            />
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <div className="w-full flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-semibold"
                >
                  <span className="truncate">{activeLabel}</span>
                  <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? "start" : "end"}
                className="DropdownMenuContent"
              >
                <DropdownMenuItem onClick={() => onStageChange("all")}>
                  All Stages ({totalCandidates})
                </DropdownMenuItem>
                {stages.map((stage) => (
                  <DropdownMenuItem
                    key={stage.id}
                    onClick={() => onStageChange(stage.id)}
                  >
                    {stage.name} ({stage.count})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
