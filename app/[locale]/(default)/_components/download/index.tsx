"use client";

import { MdOutlineDownload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/song";
import { toast } from "sonner";

export default function Download({ song , isPlayer = false }: { song: Song , isPlayer?: boolean }) {
  const downloadSong = async (uuid: string) => {
    try {
      const response = await fetch('/api/download-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      });

      if (!response.ok) {
        throw new Error('下载失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title || 'song'}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('下载成功');
    } catch (error) {
      console.error('下载出错:', error);
      toast.error('下载失败');
    }
  };

  if (isPlayer) {
    return (
      <button className="mx-2" onClick={() => downloadSong(song.uuid)}>
        <MdOutlineDownload className="text-xl" />
      </button>
    );
  }

  return (
    <Button
      size="sm"
      className="hidden md:flex items-center gap-x-1 bg-base-300 text-base-content"
      onClick={() => downloadSong(song.uuid)}
    >
      <MdOutlineDownload className="text-2xl" />
    </Button>
  );
}