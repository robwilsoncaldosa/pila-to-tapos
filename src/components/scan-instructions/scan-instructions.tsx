import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Stack,
} from "@/components/ui"

type ScanInstructionsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Shown after "Kumuha ng number": the phone's own camera scans the TV's QR code. */
export function ScanInstructions({ open, onOpenChange }: ScanInstructionsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <Stack gap={4}>
          <DialogTitle>I-scan ang QR sa TV gamit ang camera ng phone mo</DialogTitle>
          <DialogDescription>
            Buksan ang camera ng phone mo at itutok sa QR code sa TV.
          </DialogDescription>
          <DialogClose asChild>
            <Button size="touch" variant="outline">
              Bumalik
            </Button>
          </DialogClose>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
