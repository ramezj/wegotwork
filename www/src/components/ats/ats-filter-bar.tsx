import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

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
  const activeStage = stages.find((s) => s.id === activeStageId);

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
          <div className="w-full sm:w-auto min-w-[200px]">
            <Select value={activeStageId} onValueChange={onStageChange}>
              <SelectTrigger className="w-full font-semibold">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">
                  All Stages ({totalCandidates})
                </SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name} ({stage.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
