"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] shadow-lg border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-xl active:scale-[0.98] shadow-lg border border-destructive/20",
        outline:
          "border-2 border-primary/30 bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg active:scale-[0.98] font-bold",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg active:scale-[0.98] border border-secondary/30 font-bold",
        ghost: "text-primary hover:bg-primary/10 hover:shadow-md active:scale-[0.98] font-bold border border-primary/0 hover:border-primary/30",
        link: "text-primary underline-offset-4 hover:underline hover:bg-primary/10 active:scale-[0.98] font-bold",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 active:scale-[0.98] shadow-lg border border-green-500/30 font-bold",
        featured: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-red-600 hover:shadow-2xl active:scale-[0.98] shadow-xl border-0 font-bold transform hover:scale-105",
        premium: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 hover:shadow-2xl active:scale-[0.98] shadow-xl border-0 font-bold text-base",
        cta: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:shadow-2xl active:scale-[0.98] shadow-xl border-0 font-bold text-lg px-8 py-4",
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
  ({ className, variant, size, asChild = false, loading = false, loadingText, instantaneous = false, children, disabled, onClick, ...props }, ref) => {

    // State for instant feedback
    const [isPressed, setIsPressed] = React.useState(false);
    const [clickCount, setClickCount] = React.useState(0);

    // Instant feedback on click (even if async operations are slow)
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      setIsPressed(true);
      setClickCount(prev => prev + 1);

      // Provide immediate visual feedback
      if (instantaneous) {
        // Instant loading state for fast actions
        const timer = setTimeout(() => setIsPressed(false), 200);
        // Call original onClick
        if (onClick) onClick(e);
        return () => clearTimeout(timer);
      }

      // Call original onClick for normal async operations
      if (onClick) onClick(e);
    }, [disabled, loading, onClick, instantaneous]);

    // Reset pressed state after animation
    React.useEffect(() => {
      if (isPressed && !loading) {
        const timer = setTimeout(() => setIsPressed(false), 300);
        return () => clearTimeout(timer);
      }
    }, [isPressed, loading]);

    const Comp = asChild ? motion(Slot) : motion.button;

    const isActuallyDisabled = disabled || loading;

    // Show loading state content
    const content = loading ? (
      <>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="mr-2 h-4 w-4" />
        </motion.div>
        {loadingText || "Loading..."}
      </>
    ) : (
      children
    );

    return (
      <motion.div
        className="relative"
        animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: loading ? 0.8 : 0.1
        }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isActuallyDisabled}
          onClick={handleClick}
          {...props}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'content'}
              initial={{ opacity: 0, y: loading ? -10 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: loading ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </Comp>

        {/* Animated border effect on click */}
        <AnimatePresence>
          {isPressed && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
