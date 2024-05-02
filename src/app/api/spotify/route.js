import { NextResponse } from "next/server";

let play_pause_status = false;
let song_id = "";
let action = "play_pause";
async function play_pause(request) {
  console.log("in play_pause");
  action = "play_pause";
  play_pause_status = !play_pause_status;
  return { status: play_pause_status, action: action };
}

async function change_song(song) {
  console.log("in change_song");
  console.log("song", song);
  song_id = song;
  action = "change";
  return { status: play_pause_status, song: song_id, action: action };
}

export async function POST(request) {
  const body = await request.json();
  if (body.type === "play_pause") {
    return NextResponse.json(await play_pause(request));
  } else if (body.type === "change_song") {
    return NextResponse.json(await change_song(body.song_id));
  } else {
    return NextResponse.json({ error: "Invalid request type" });
  }
}

export async function GET(request) {
  return NextResponse.json({
    status: play_pause_status,
    song: song_id,
    action: action,
  });
}
