import { findByUuid, insertRow, updateSong } from "@/models/song";
import { respData, respErr } from "@/utils/resp";

import { Song } from "@/types/song";
import { formatSong } from "@/services/song";
import { getSongInfo } from "@/services/suno";
import { getUserUuid } from "@/services/user";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.clips;

    let songs: Song[] = [];

    for (const item of data) {
      const song = formatSong(item, false);

      if (song && song.uuid) {
        song.provider = "suno";
        const existSong = await findByUuid(song.uuid);
        if (existSong) {
          updateSong(song);
        } else {
          insertRow(song);
        }

        songs.push(song);
      }
    }

    return respData(songs);
  } catch (e) {
    console.log("submit songs failed:", e);
    return respErr("submit songs failed");
  }
}
