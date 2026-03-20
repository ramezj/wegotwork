import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvaluationFn } from "@/features/services/ats/evaluation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EvaluationFormProps {
  candidateId: string;
  stageId: string;
  onSuccess?: () => void;
}

export function EvaluationForm({
  candidateId,
  stageId,
  onSuccess,
}: EvaluationFormProps) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEvaluationFn,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Evaluation submitted");
      setScore(0);
      setFeedback("");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit evaluation");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) {
      toast.error("Please provide a score");
      return;
    }
    mutation.mutate({
      data: {
        candidateId,
        stageId,
        score,
        feedback,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-bold tracking-tight uppercase text-muted-foreground">
          Overall Score
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScore(s)}
              className={cn(
                "size-12 rounded-xl border-2 flex items-center justify-center transition-all",
                score >= s
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "bg-muted/50 border-input text-muted-foreground hover:border-primary/50 hover:bg-primary/5",
              )}
            >
              <Star className={cn("size-6", score >= s && "fill-current")} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold tracking-tight uppercase text-muted-foreground">
          Detailed Feedback
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What did you think of the candidate's performance in this stage?"
          className="min-h-[120px] rounded-xl border-border bg-muted/20 focus:bg-background transition-all"
        />
      </div>

      <Button
        type="submit"
        className="w-full font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Submitting..." : "Submit Evaluation"}
      </Button>
    </form>
  );
}
