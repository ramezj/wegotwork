"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { Button } from "../ui/button";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant={"ghost"} onClick={toggleSidebar}>
      <PanelLeft className="w-4 h-4" />
    </Button>
  );
}
