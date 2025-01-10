import { findByUuid, insertRow, updateSong } from "@/models/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";
import { getUserUuid } from "@/services/user";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.clips;

    let songs: Song[] = [];

    for (const item of data) {
      const song = formatSong(item, false);

      if (song && song.uuid) {
        song.provider = "suno";
        let existSong;
        
        try {
          existSong = await findByUuid(song.uuid);
        } catch (error: any) {
          // 处理 PGRST116 错误（未找到记录）
          if (error?.code !== 'PGRST116') {
            throw error; // 重新抛出非 PGRST116 错误
          }
          // 如果是 PGRST116，existSong 保持为 undefined
        }

        if (existSong) {
          song.play_count = Math.floor(Math.random() * 10000) + 30;
          song.upvote_count = Math.floor(song.play_count / 4 + 3);
          if(existSong?.play_count !== undefined && existSong.play_count < 100){
            await updateSong(song);
          }
        } else {
          await insertRow(song);
        }

        songs.push(song);
      }
    }

    return respData(songs);
  } catch (e) {
    console.error("submit songs failed:", e);
    return respErr("submit songs failed");
  }
}
