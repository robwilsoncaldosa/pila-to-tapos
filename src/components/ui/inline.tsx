import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const inlineVariants = cva("flex flex-row", {
  variants: {
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: { gap: 3, align: "center", justify: "start", wrap: false },
})

function Inline({
  className,
  gap,
  align,
  justify,
  wrap,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inlineVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="inline"
      className={cn(inlineVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  )
}

export { Inline, inlineVariants }
