"use client"

import { QRCodeSVG } from "qrcode.react"
import { useSyncExternalStore } from "react"

import { Card, CardContent, Stack } from "@/components/ui"
import { useT } from "@/i18n"

const noopSubscribe = () => () => {}

/** The base address of this app: NEXT_PUBLIC_APP_URL if set, else the address this TV was opened on. */
const useBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_APP_URL
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => ""
  )
  return (configured || origin).replace(/\/+$/, "")
}

const isLocalHost = (baseUrl: string): boolean => {
  try {
    const { hostname } = new URL(baseUrl)
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
  } catch {
    return false
  }
}

/** The corner QR code: her phone's own camera opens it. The address is printed under it. */
export function JoinQr({ counterId }: { counterId: string }) {
  const { t } = useT()
  const baseUrl = useBaseUrl()
  if (!baseUrl) return null
  const joinUrl = `${baseUrl}/join?c=${counterId}`

  return (
    <Card size="sm">
      <CardContent>
        <Stack gap={2} align="center" className="max-w-56 text-center">
          <p className="font-bold">{t("tv.scan")}</p>
          <QRCodeSVG value={joinUrl} size={176} marginSize={2} title={t("tv.qrTitle")} />
          <small className="break-all">{joinUrl}</small>
          {isLocalHost(baseUrl) ? (
            <small data-tone="muted">{t("tv.lanHint")}</small>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
