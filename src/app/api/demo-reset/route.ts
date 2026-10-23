import { getContainer } from "@/composition-root"

// Route handlers are adapters: check the guard, call one service method, map to a response.
// Off unless PILA_DEMO_RESET=1, so a production deploy answers 404 and empties nothing.

export const dynamic = "force-dynamic"

export async function POST(): Promise<Response> {
  if (process.env.PILA_DEMO_RESET !== "1") {
    return new Response(null, { status: 404 })
  }
  await getContainer().queueService.resetDemo()
  return new Response(null, { status: 204 })
}
