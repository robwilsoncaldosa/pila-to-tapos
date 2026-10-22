"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const radioGroupVariants = cva("w-full", {
  variants: {
    layout: {
      stack: "grid gap-2",
      wrap: "flex flex-wrap gap-x-6 gap-y-2",
      segmented: "grid grid-cols-3 gap-2",
    },
  },
  defaultVariants: { layout: "stack" },
})

function RadioGroup({
  className,
  layout = "stack",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(radioGroupVariants({ layout }), className)}
      {...props}
    />
  )
}

const radioItemVariants = cva(
  "group/radio-group-item peer relative flex aspect-square shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
  {
    variants: {
      size: {
        default: "size-4",
        lg: "size-7 border-2 border-foreground bg-card",
        /** A wide labelled button in a segmented group; the label is the children. */
        segment:
          "aspect-auto min-h-12 w-full items-center justify-center rounded-lg border-2 border-foreground bg-card px-2 py-2 text-center text-base font-medium whitespace-normal transition-[scale,background-color,color] duration-160 ease-out active:scale-[0.97]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

function RadioGroupItem({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioItemVariants>) {
  if (size === "segment") {
    return (
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(radioItemVariants({ size }), className)}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Item>
    )
  }
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <span className="size-3 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
