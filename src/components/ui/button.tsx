"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border border-primary/20 hover:shadow-xl active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg border border-destructive/20 hover:shadow-xl active:scale-[0.98]",
        outline:
          "border-2 border-primary/30 bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg active:scale-[0.98] font-bold",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg border border-secondary/30 font-bold hover:shadow-xl active:scale-[0.98]",
        ghost: "text-primary hover:bg-primary/10 hover:shadow-md active:scale-[0.98] font-bold border border-primary/0 hover:border-primary/30",
        link: "text-primary underline-offset-4 hover:underline hover:bg-primary/10 active:scale-[0.98] font-bold",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg border border-green-500/30 font-bold active:scale-[0.98]",
        featured: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 shadow-xl border-0 font-bold transform hover:scale-105 active:scale-[0.98]",
        premium: "bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 shadow-xl border-0 font-bold text-base active:scale-[0.98]",
        cta: "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 shadow-xl border-0 font-bold text-lg px-8 py-4 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-13 rounded-xl px-8 py-4 text-lg",
        xl: "h-15 rounded-xl px-10 py-5 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  instantaneous?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, instantaneous, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const content = loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || "Loading..."}
      </>
    ) : (
      children
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }
