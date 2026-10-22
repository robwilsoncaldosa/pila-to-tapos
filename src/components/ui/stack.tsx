import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: { gap: 4, align: "stretch" },
})

function Stack({
  className,
  gap,
  align,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="stack"
      className={cn(stackVariants({ gap, align }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
