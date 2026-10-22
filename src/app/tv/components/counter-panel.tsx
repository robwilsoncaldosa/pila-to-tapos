import { cva } from "class-variance-authority"

import { Stack } from "@/components/ui"

const panelVariants = cva("w-full rounded-3xl border border-white/20 px-6 py-10", {
  variants: {
    pulse: {
      true: "tv-pulse",
      false: "",
    },
  },
  defaultVariants: { pulse: false },
})

const numberVariants = cva(
  "text-[clamp(6rem,18vw,16rem)] leading-none font-bold tabular-nums",
  {
    variants: {
      active: {
        true: "text-turn",
        false: "text-white/30",
      },
    },
    defaultVariants: { active: false },
  }
)

type CounterPanelProps = {
  label: string
  /** The number being served, or null. */
  number: string | null
  /** True for the 3 seconds after a new call: an opacity pulse, nothing moves. */
  pulse: boolean
}

/** The one counter's panel: its name and the number being served, huge and yellow. */
export function CounterPanel({ label, number, pulse }: CounterPanelProps) {
  return (
    <Stack asChild gap={4} align="center">
      <section
        aria-label={label}
        data-pulse={pulse}
        className={panelVariants({ pulse })}
      >
        <h1 className="text-3xl text-white">{label}</h1>
        <p className={numberVariants({ active: number !== null })} aria-live="polite">
          {number ?? "—"}
        </p>
        {number === null ? (
          <p className="text-xl text-white/70">Walang tinatawag ngayon</p>
        ) : null}
      </section>
    </Stack>
  )
}
