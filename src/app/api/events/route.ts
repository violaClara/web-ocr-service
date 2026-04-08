import { NextRequest } from "next/server";
import { emitter } from "@/lib/events";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const onRefresh = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Listen for the refresh signal from the webhook
      emitter.on("refresh", onRefresh);

      // Keep connection alive with periodic heartbeats (every 30s)
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 30000);

      // Clean up when the request is closed
      req.signal.onabort = () => {
        emitter.off("refresh", onRefresh);
        clearInterval(heartbeat);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
