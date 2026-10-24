"use client"

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Stack,
} from "@/components/ui"
import { useT } from "@/i18n"

type ScanInstructionsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Shown after "Get my number": the phone's own camera scans the TV's QR code. */
export function ScanInstructions({ open, onOpenChange }: ScanInstructionsProps) {
  const { t } = useT()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <Stack gap={4}>
          <DialogTitle>{t("scan.title")}</DialogTitle>
          <DialogDescription>{t("scan.body")}</DialogDescription>
          <DialogClose asChild>
            <Button size="touch" variant="outline">
              {t("common.back")}
            </Button>
          </DialogClose>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
