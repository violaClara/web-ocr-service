import { NextRequest, NextResponse } from "next/server";
import { emitter } from "@/lib/events";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // We emit a refresh signal. 
    // We don't necessarily need to pass the row data because 
    // the frontend will re-fetch the latest data from the sheet anyway.
    emitter.emit("refresh", {
      source: "google-sheets",
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Refresh signal broadcasted"
    });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({
      error: "Failed to process webhook"
    }, { status: 500 });
  }
}

// Support GET for manual testing/health checks
export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is active. Use POST to trigger a refresh."
  });
}
