import { useState } from "react";
import { FormFieldConfig, FormFieldType } from "@/types/form-config";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Plus,
  Trash2,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  GripVertical,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormBuilderProps {
  value: FormFieldConfig[];
  onChange: (value: FormFieldConfig[]) => void;
}

const FIELD_TYPES: {
  type: FormFieldType;
  label: string;
  icon: any;
  description: string;
  color: string;
}[] = [
  {
    type: "SHORT_ANSWER",
    label: "Short Answer",
    icon: Type,
    description: "Single line text",
    color: "text-blue-500",
  },
  {
    type: "LONG_ANSWER",
    label: "Long Answer",
    icon: AlignLeft,
    description: "Multi-line text",
    color: "text-violet-500",
  },
  {
    type: "SELECT",
    label: "Single Select",
    icon: List,
    description: "Pick one option",
    color: "text-amber-500",
  },
  {
    type: "CHECKBOX",
    label: "Checkbox",
    icon: CheckSquare,
    description: "Yes / No or Agreement",
    color: "text-emerald-500",
  },
];

const TYPE_BADGE_COLORS: Record<FormFieldType, string> = {
  SHORT_ANSWER: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  LONG_ANSWER: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  SELECT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  MULTI_SELECT: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  FILE: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  CHECKBOX: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function FormBuilder({ value, onChange }: FormBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormFieldConfig = {
      id: crypto.randomUUID(),
      label: "New Question",
      type: "SHORT_ANSWER",
      required: false,
      placeholder: "",
      options: [],
      order: value.length,
    };
    onChange([...value, newField]);
    setExpandedId(newField.id);
  };

  const removeField = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const updateField = (id: string, updates: Partial<FormFieldConfig>) => {
    onChange(value.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= value.length) return;
    const newList = [...value];
    const item = newList[index];
    newList.splice(index, 1);
    newList.splice(newIndex, 0, item);
    onChange(newList);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Custom Questions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {value.length === 0
              ? "No custom questions yet"
              : `${value.length} question${value.length !== 1 ? "s" : ""} added`}
          </p>
        </div>
        <Button type="button" size="sm" onClick={addField} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Question
        </Button>
      </div>

      {/* Empty state */}
      {value.length === 0 && (
        <div
          onClick={addField}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/40 transition-all group"
        >
          <div className="size-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium">Add your first question</p>
            <p className="text-xs text-muted-foreground mt-1">
              Candidates already provide Name, Email, and Resume by default.
            </p>
          </div>
        </div>
      )}

      {/* Field cards */}
      <div className="space-y-2">
        {value.map((field, index) => {
          const typeInfo = FIELD_TYPES.find((t) => t.type === field.type);
          const Icon = typeInfo?.icon ?? Type;
          const isExpanded = expandedId === field.id;

          return (
            <div
              key={field.id}
              className={cn(
                "border rounded-xl bg-card overflow-hidden transition-all",
                isExpanded ? "shadow-sm" : "hover:border-border/80",
              )}
            >
              {/* Field header row — always visible */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleExpand(field.id)}
              >
                {/* Drag handle + order */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, "up");
                      }}
                      disabled={index === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-opacity leading-none"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, "down");
                      }}
                      disabled={index === value.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-opacity leading-none"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                </div>

                {/* Field type icon */}
                <div
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center shrink-0",
                    "bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      typeInfo?.color ?? "text-muted-foreground",
                    )}
                  />
                </div>

                {/* Label + badges */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {field.label || (
                      <span className="text-muted-foreground italic">
                        Untitled question
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0 hidden sm:inline-flex",
                      TYPE_BADGE_COLORS[field.type],
                    )}
                  >
                    {typeInfo?.label}
                  </Badge>
                  {field.required && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/20 hidden sm:inline-flex"
                    >
                      Required
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180",
                    )}
                  />
                </div>
              </div>

              {/* Expanded editing panel */}
              {isExpanded && (
                <div className="border-t bg-muted/20 px-4 py-4 space-y-4">
                  {/* Question label + type */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Question Label
                      </Label>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        placeholder="e.g. Why do you want to work here?"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Type
                      </Label>
                      <Select
                        value={field.type}
                        onValueChange={(val: FormFieldType) =>
                          updateField(field.id, { type: val })
                        }
                      >
                        <SelectTrigger className="h-9 sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t.type} value={t.type}>
                              <div className="flex items-center gap-2">
                                <t.icon
                                  className={cn("h-3.5 w-3.5", t.color)}
                                />
                                <span className="text-sm">{t.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Placeholder hint */}
                  {(field.type === "SHORT_ANSWER" ||
                    field.type === "LONG_ANSWER") && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Placeholder hint{" "}
                        <span className="normal-case font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        value={field.placeholder ?? ""}
                        onChange={(e) =>
                          updateField(field.id, {
                            placeholder: e.target.value,
                          })
                        }
                        placeholder="e.g. Describe your experience..."
                        className="h-9"
                      />
                    </div>
                  )}

                  {/* Options for SELECT */}
                  {field.type === "SELECT" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Options
                      </Label>
                      <div className="space-y-1.5">
                        {(field.options || []).map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex gap-2 items-center"
                          >
                            <div className="size-5 shrink-0 rounded border bg-background flex items-center justify-center">
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {optIndex + 1}
                              </span>
                            </div>
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[optIndex] = e.target.value;
                                updateField(field.id, { options: newOptions });
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="h-8 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateField(field.id, {
                                  options: (field.options || []).filter(
                                    (_, i) => i !== optIndex,
                                  ),
                                })
                              }
                              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            updateField(field.id, {
                              options: [...(field.options || []), ""],
                            })
                          }
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full border border-dashed rounded-lg px-3 py-2 hover:border-border"
                        >
                          <Plus className="h-3 w-3" />
                          Add option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Footer: Required toggle + Delete */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`req-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(val) =>
                          updateField(field.id, { required: val })
                        }
                        className="scale-90"
                      />
                      <Label
                        htmlFor={`req-${field.id}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        Required
                      </Label>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove question
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add more button when fields exist */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full border border-dashed rounded-xl px-4 py-3 hover:border-border hover:bg-muted/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another question
        </button>
      )}
    </div>
  );
}
