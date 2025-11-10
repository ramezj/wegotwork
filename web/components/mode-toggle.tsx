"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon"}
          variant="default"
          className="rounded-none font-medium text-base align-middle bg-gray-200 hover:bg-gray-200 dark:bg-white border border-foreground/20 border-dashed"
        >
          <Sun className="dark:text-black text-black scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="dark:text-black text-black absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-none dark:bg-black border border-dashed border-foreground/20"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="rounded-none"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="rounded-none"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="rounded-none"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
