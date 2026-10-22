import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const gridVariants = cva("grid", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    },
    gap: {
      0: "gap-0",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
    },
  },
  defaultVariants: { columns: 1, gap: 4 },
})

function Grid({
  className,
  columns,
  gap,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof gridVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="grid"
      className={cn(gridVariants({ columns, gap }), className)}
      {...props}
    />
  )
}

export { Grid, gridVariants }
