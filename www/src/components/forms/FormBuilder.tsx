import { FormFieldConfig, FormFieldType } from "@/types/form-config";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent } from "../ui/card";
import {
  Plus,
  Trash2,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface FormBuilderProps {
  value: FormFieldConfig[];
  onChange: (value: FormFieldConfig[]) => void;
}

const FIELD_TYPES: { type: FormFieldType; label: string; icon: any }[] = [
  { type: "SHORT_ANSWER", label: "Short Answer", icon: Type },
  { type: "LONG_ANSWER", label: "Long Answer", icon: AlignLeft },
  { type: "SELECT", label: "Single Select", icon: List },
  { type: "CHECKBOX", label: "Checkbox / Agreement", icon: CheckSquare },
];

export function FormBuilder({ value, onChange }: FormBuilderProps) {
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
  };

  const removeField = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Application Form Fields</h3>
        <Button type="button" size="sm" onClick={addField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <div className="space-y-3">
        {value.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
            No custom fields added yet. Candidates will only be asked for Name,
            Email, and Resume.
          </div>
        ) : (
          value.map((field, index) => (
            <Card key={field.id} className="relative group overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <div className="flex flex-col gap-1 items-center justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === 0}
                    onClick={() => moveField(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === value.length - 1}
                    onClick={() => moveField(index, "down")}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <Label>Question Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        placeholder="e.g. Why do you want to work here?"
                      />
                    </div>
                    <div className="w-full sm:w-48 space-y-1.5">
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(val: FormFieldType) =>
                          updateField(field.id, { type: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t.type} value={t.type}>
                              <div className="flex items-center gap-2">
                                <t.icon className="h-4 w-4" />
                                <span>{t.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`req-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(val: boolean) =>
                          updateField(field.id, { required: val })
                        }
                      />
                      <Label
                        htmlFor={`req-${field.id}`}
                        className="text-sm font-normal"
                      >
                        Required field
                      </Label>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  {field.type === "SELECT" && (
                    <div className="space-y-3 pt-2 bg-muted/30 p-3 rounded-md border">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Options
                      </Label>
                      <div className="space-y-2">
                        {(field.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                updateField(field.id, {
                                  options: (field.options || []).filter(
                                    (_, i) => i !== optIndex,
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-8 border-dashed"
                          onClick={() => {
                            updateField(field.id, {
                              options: [...(field.options || []), ""],
                            });
                          }}
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
