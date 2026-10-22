import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full px-4", {
  variants: {
    size: {
      phone: "max-w-lg",
      wide: "max-w-3xl",
    },
    padY: {
      none: "",
      page: "py-8",
    },
  },
  defaultVariants: { size: "phone", padY: "page" },
})

function Container({
  className,
  size,
  padY,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="container"
      className={cn(containerVariants({ size, padY }), className)}
      {...props}
    />
  )
}

export { Container, containerVariants }
