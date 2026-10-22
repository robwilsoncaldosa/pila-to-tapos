import { Alert, AlertDescription, AlertTitle, Stack } from "@/components/ui"

/** TEAM_PASSCODE (or TEAM_COOKIE_SECRET) is missing, so nobody can unlock /team. */
export function NotConfigured() {
  return (
    <Stack gap={4}>
      <h1>Team</h1>
      <Alert variant="missing">
        <AlertTitle>Hindi pa naka-set ang TEAM_PASSCODE sa .env.local</AlertTitle>
        <AlertDescription>
          Ilagay ang TEAM_PASSCODE at TEAM_COOKIE_SECRET sa .env.local (tingnan ang .env.example),
          tapos i-restart ang dev server.
        </AlertDescription>
      </Alert>
    </Stack>
  )
}
