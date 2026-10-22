import { Alert, AlertDescription, AlertTitle } from "@/components/ui"

export function PlanUnavailable() {
  return (
    <Alert variant="muted">
      <AlertTitle>Hindi mabuksan ang plano ngayon.</AlertTitle>
      <AlertDescription>
        Subukan ulit mamaya, o sabihan ang team na hindi mabasa ang plan file.
      </AlertDescription>
    </Alert>
  )
}
