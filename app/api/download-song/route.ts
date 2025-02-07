import { NextResponse } from "next/server";
import { findByUuid } from "@/models/song";
import { respErr } from "@/utils/resp";
import { getUserUuid } from "@/services/user";


export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();
    if (!uuid) {
      return respErr("invalid params");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    let song = await findByUuid(uuid);
    const songUrl = song?.audio_url;

    if (!songUrl) {
      return NextResponse.json({ error: "缺少歌曲URL参数" }, { status: 400 });
    }

    const response = await fetch(songUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "无法获取歌曲文件" }, { status: 404 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="song.mp3"',
      },
    });
  } catch (error) {
    console.error("下载歌曲时出错:", error);
    return NextResponse.json({ error: "下载歌曲失败" }, { status: 500 });
  }
}
