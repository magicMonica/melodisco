import { Song } from "@/types/song";
import { getSupabaseClient } from "@/models/db";
import { getSongsFromSqlResult } from "@/models/song";
import { respData, respErr } from "@/utils/resp";
import { getRandomSongs } from "@/models/song";


export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { keyword, limit = 10 } = await req.json();
    
    if (!keyword) {
      const songs = await getRandomSongs(1, 20);

      return respData(getSongsFromSqlResult({ rows: songs }));
    }

    const supabase = getSupabaseClient();
    
    // 使用 ilike 进行模糊搜索,搜索范围包括标题、标签和歌词
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .or(`title.ilike.%${keyword}%,tags.ilike.%${keyword}%,lyrics.ilike.%${keyword}%`)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(limit);

    console.log("search songs data:", data);

    if (error) {
      console.error("search songs failed:", error);
      return respErr("search songs failed");
    }

    // 使用现有的 getSongsFromSqlResult 函数格式化结果
    const songs = getSongsFromSqlResult({ rows: data });
    
    return respData(songs);
  } catch (e) {
    console.error("search songs failed:", e);
    return respErr("search songs failed");
  }
}