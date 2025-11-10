"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1 active:shadow-none text-center w-full py-3 px-4",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-50",
        primary:
          "bg-black text-white border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,0.25)] hover:bg-gray-900",
        outline:
          "bg-white text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-gray-50",
        dark: "bg-black text-white border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,0.25)] hover:bg-gray-900",
      },
      size: {
        default: "h-12",
        sm: "h-10 text-sm",
        lg: "h-14 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };
