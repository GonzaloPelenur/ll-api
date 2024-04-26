import { NextResponse } from "next/server";

let play_pause_status = false;

async function play_pause(request) {
  console.log("in play_pause");
  play_pause_status = !play_pause_status;
  return { status: play_pause_status };
}

export async function POST(request) {
  const body = await request.json();
  if (body.type === "play_pause") {
    return NextResponse.json(await play_pause(request));
  } else {
    return NextResponse.json({ error: "Invalid request type" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: play_pause_status });
}
